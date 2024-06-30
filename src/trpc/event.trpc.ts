import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';

import { SITE_URL } from '@/config/environment.config';
import { prismaClient } from '@/config/prisma.config';
import DeleteEventEmail from '@/emails/delete-event';
import NewEventEmail from '@/emails/new-event';
import UpdateEventEmail from '@/emails/update-event';
import { addAuditLog } from '@/lib/audit';
import { batchSendEmail } from '@/lib/email';
import { getEventDifference } from '@/lib/event';
import { groupAdminProcedure, privateProcedure } from '@/trpc/trpc';
import {
  CreateEventApplicationDto,
  CreateEventDto,
  DeleteEventDto,
  GetEventApplicationForUserDto,
  UpdateEventDto,
} from '@/types/event.types';

export const createEvent = groupAdminProcedure.input(CreateEventDto).mutation(async (opts) => {
  const event = await prismaClient.event.create({
    data: opts.input,
    include: {
      group: true,
    },
  });

  const membersOfGroup = await prismaClient.membership.findMany({
    where: {
      groupId: event.groupId,
    },
    include: {
      user: true,
    },
  });

  const emailRecipients = membersOfGroup
    .filter(({ user }) => Boolean(user.emailVerified))
    .map(({ user }) => user.email);

  batchSendEmail({
    to: emailRecipients,
    subject: event.name,
    html: render(
      NewEventEmail({
        eventLink: `${SITE_URL}/groups/${event.groupId}/events/${event.id}`,
        event,
        groupName: event.group.name,
      })
    ),
  });
  await addAuditLog({
    userId: opts.ctx.session?.user.id,
    action: `Esemény létrehozása: ${event.name}`,
    groupId: event.groupId,
  });

  return event;
});

export const updateEvent = groupAdminProcedure.input(UpdateEventDto).mutation(async (opts) => {
  const { id, ...data } = opts.input;

  const prevEvent = await prismaClient.event.findUnique({
    where: {
      id,
    },
  });

  if (!prevEvent) throw new TRPCError({ code: 'NOT_FOUND' });

  const updatedEvent = await prismaClient.event.update({
    where: {
      id,
    },
    data,
  });

  const attendees = await prismaClient.eventApplication.findMany({
    where: {
      eventId: id,
    },
    include: {
      user: true,
    },
  });

  const emailRecipients = attendees.filter(({ user }) => Boolean(user.emailVerified)).map(({ user }) => user.email);

  const difference = getEventDifference(prevEvent, updatedEvent);
  if (Object.keys(difference).length > 0) {
    batchSendEmail({
      to: emailRecipients,
      subject: 'Egy eseményedet frissítették',
      html: render(
        UpdateEventEmail({
          eventName: updatedEvent.name,
          difference,
        })
      ),
    });
  }
  await addAuditLog({
    userId: opts.ctx.session?.user.id,
    action: `Esemény frissítése: ${updatedEvent.name}`,
    groupId: updatedEvent.groupId,
  });

  return updatedEvent;
});

export const getEventApplicationForUser = privateProcedure.input(GetEventApplicationForUserDto).query(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return prismaClient.eventApplication.findFirst({
    where: {
      eventId: opts.input,
      userId: opts.ctx.session?.user.id,
    },
  });
});

export const createEventApplication = privateProcedure.input(CreateEventApplicationDto).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const event = await prismaClient.event.findUnique({
    where: {
      id: opts.input,
      OR: [
        {
          group: {
            members: {
              some: {
                userId: opts.ctx.session.user.id,
              },
            },
          },
        },
        {
          isPrivate: false,
        },
      ],
    },
  });

  if (!event) throw new TRPCError({ code: 'NOT_FOUND' });

  return prismaClient.eventApplication.create({
    data: {
      userId: opts.ctx.session.user.id,
      eventId: event.id,
    },
  });
});

export const deleteEvent = groupAdminProcedure.input(DeleteEventDto).mutation(async (opts) => {
  const event = await prismaClient.event.findUnique({
    where: {
      id: opts.input.eventId,
    },
    include: {
      group: true,
      EventApplication: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!event) throw new TRPCError({ code: 'NOT_FOUND' });

  await prismaClient.event.delete({
    where: {
      id: opts.input.eventId,
    },
  });

  batchSendEmail({
    to: event.EventApplication.map(({ user }) => user.email),
    subject: 'Esemény törölve',
    html: render(DeleteEventEmail({ event, groupName: event.group.name })),
  });

  await addAuditLog({
    userId: opts.ctx.session?.user.id,
    action: `Esemény törlése: ${event.name}`,
    groupId: event.groupId,
  });
});

import { TRPCError } from '@trpc/server';

import { prismaClient } from '@/config/prisma.config';
import { groupAdminProcedure, privateProcedure } from '@/trpc/trpc';
import {
  CreateEventApplicationDto,
  CreateEventDto,
  GetEventApplicationForUserDto,
  UpdateEventDto,
} from '@/types/event.types';

export const createEvent = groupAdminProcedure.input(CreateEventDto).mutation(async (opts) => {
  return prismaClient.event.create({
    data: opts.input,
  });
});

export const updateEvent = groupAdminProcedure.input(UpdateEventDto).mutation(async (opts) => {
  const { id, ...data } = opts.input;

  return prismaClient.event.update({
    where: {
      id,
    },
    data,
  });
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

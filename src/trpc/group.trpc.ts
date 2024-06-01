import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prismaClient } from '@/config/prisma.config';
import { batchSendEmail, singleSendEmail } from '@/lib/email';
import { StatusMap } from '@/lib/group';
import { groupAdminProcedure, privateProcedure, superAdminProcedure } from '@/trpc/trpc';
import {
  CreateGroupDto,
  DeleteMembershipDto,
  EditMembershipDto,
  JoinGroupDto,
  SendEmailDto,
  ToggleAdminDto,
  UpdateGroupDto,
} from '@/types/group.types';

import GroupGeneralEmail from '../../emails/group-general';
import MembershipStatusEmail from '../../emails/membership-status';

export const getGroups = superAdminProcedure.query(async () => {
  return prismaClient.group.findMany();
});

export const getGroup = superAdminProcedure.input(z.string()).query(async (opts) => {
  return prismaClient.group.findUnique({
    where: {
      id: opts.input,
    },
  });
});

export const createGroup = superAdminProcedure.input(CreateGroupDto).mutation(async (opts) => {
  const { parentGroupId, ...data } = opts.input;

  return prismaClient.group.create({
    data: {
      ...data,
      parentGroup: parentGroupId ? { connect: { id: parentGroupId } } : undefined,
    },
  });
});

export const updateGroup = groupAdminProcedure.input(UpdateGroupDto).mutation(async (opts) => {
  const { id, data } = opts.input;

  return prismaClient.group.update({
    where: {
      id,
    },
    data,
  });
});

export const joinGroup = privateProcedure.input(JoinGroupDto).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const membership = await prismaClient.membership.create({
    data: {
      groupId: opts.input,
      userId: opts.ctx.session.user.id,
    },
    include: {
      group: true,
    },
  });

  singleSendEmail({
    to: opts.ctx.session.user.email,
    subject: `${membership.group.name} csoporthoz csatlakoztál!`,
    html: render(
      MembershipStatusEmail({
        groupName: membership.group.name,
        status: StatusMap[membership.status].label,
      })
    ),
  });

  return membership;
});

export const leaveGroup = privateProcedure.input(JoinGroupDto).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return prismaClient.membership.deleteMany({
    where: {
      groupId: opts.input,
      userId: opts.ctx.session.user.id,
    },
  });
});

export const editMembership = groupAdminProcedure.input(EditMembershipDto).mutation(async (opts) => {
  const membership = await prismaClient.membership.update({
    where: {
      userId_groupId: {
        groupId: opts.input.groupId,
        userId: opts.input.userId,
      },
    },
    data: {
      status: opts.input.status,
    },
    include: {
      user: true,
      group: true,
    },
  });

  singleSendEmail({
    to: membership.user.email,
    subject: `${membership.group.name} csoporttagságod státusza megváltozott`,
    html: render(
      MembershipStatusEmail({
        groupName: membership.group.name,
        status: StatusMap[membership.status].label,
      })
    ),
  });

  return membership;
});

export const deleteMembership = groupAdminProcedure.input(DeleteMembershipDto).mutation(async (opts) => {
  return prismaClient.membership.deleteMany({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
  });
});

export const toggleAdmin = groupAdminProcedure.input(ToggleAdminDto).mutation(async (opts) => {
  const membership = await prismaClient.membership.findFirst({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
  });

  if (!membership) throw new TRPCError({ code: 'NOT_FOUND' });

  return prismaClient.membership.updateMany({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
    data: {
      isAdmin: !membership.isAdmin,
    },
  });
});

export const sendEmail = groupAdminProcedure.input(SendEmailDto).mutation(async (opts) => {
  const group = await prismaClient.group.findUnique({
    where: {
      id: opts.input.groupId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!group) throw new TRPCError({ code: 'NOT_FOUND' });

  batchSendEmail({
    to: group.members.map((member) => member.user.email),
    subject: opts.input.subject,
    html: render(
      GroupGeneralEmail({
        content: opts.input.content,
        groupName: group.name,
      })
    ),
  });
});

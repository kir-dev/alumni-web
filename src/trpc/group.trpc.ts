import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prismaClient } from '@/config/prisma.config';
import { groupAdminProcedure, privateProcedure, superAdminProcedure } from '@/trpc/trpc';
import {
  CreateGroupDto,
  DeleteMembershipDto,
  EditMembershipDto,
  JoinGroupDto,
  ToggleAdminDto,
  UpdateGroupDto,
} from '@/types/group.types';

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

  return prismaClient.membership.create({
    data: {
      groupId: opts.input,
      userId: opts.ctx.session.user.id,
    },
  });
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
  return prismaClient.membership.updateMany({
    where: {
      groupId: opts.input.groupId,
      userId: opts.input.userId,
    },
    data: {
      status: opts.input.status,
    },
  });
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

import { Group, Membership } from '@prisma/client';

import { prismaClient } from '@/config/prisma.config';
import { CreateGroupDto, UpdateGroupDto } from '@/types/group.types';

export function createGroup({ parentGroupId, ...data }: CreateGroupDto): Promise<Group> {
  return prismaClient.group.create({
    data: {
      ...data,
      parentGroup: parentGroupId ? { connect: { id: parentGroupId } } : undefined,
    },
  });
}

export function getGroupById(id: string): Promise<Group | null> {
  return prismaClient.group.findUnique({
    where: { id },
  });
}

export function updateGroup(id: string, group: UpdateGroupDto): Promise<Group | null> {
  return prismaClient.group.update({
    where: { id },
    data: group,
  });
}

export function joinGroup(groupId: string, userId: string): Promise<Membership> {
  return prismaClient.membership.create({
    data: {
      user: { connect: { id: userId } },
      group: { connect: { id: groupId } },
    },
  });
}

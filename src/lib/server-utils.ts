import { MembershipStatus } from '@prisma/client';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';

export async function getDomainForHost() {
  const host = headers().get('host');

  return host
    ? await prismaClient.groupDomain.findFirst({
        where: {
          domain: host,
        },
        include: {
          group: true,
        },
      })
    : null;
}

export async function getSession() {
  return getServerSession(authOptions);
}

export async function isSuperAdmin() {
  const session = await getSession();
  return session?.user.isSuperAdmin ?? false;
}

export async function isGroupAdmin(groupId: string) {
  const session = await getSession();
  if (!session) return false;
  const membership = await prismaClient.membership.findFirst({
    where: {
      groupId,
      userId: session?.user.id,
      isAdmin: true,
    },
  });

  return Boolean(membership);
}

export async function canEdit(groupId: string) {
  const superAdmin = await isSuperAdmin();
  const groupAdmin = await isGroupAdmin(groupId);

  return superAdmin || groupAdmin;
}

export async function getMembership(groupId: string) {
  const session = await getSession();
  if (!session) return null;
  return prismaClient.membership.findFirst({
    where: {
      groupId,
      userId: session?.user.id,
    },
  });
}

export async function isApprovedGroupMember(groupId: string) {
  const session = await getSession();
  const membership = await getMembership(groupId);

  return Boolean(membership?.status === MembershipStatus.Approved || session?.user.isSuperAdmin);
}

export async function getGroup(groupId: string) {
  return prismaClient.group.findUnique({
    where: {
      id: groupId,
    },
  });
}

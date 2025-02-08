import { MembershipStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { LEGACY_MAIL_LIST_ENABLED } from '@/config/environment.config';
import { prismaClient } from '@/config/prisma.config';
import { SetLegacyMailListDto, UnsubscribeFromLegacyMailListDto } from '@/types/legacy-mail-list.types';

import { groupAdminProcedure, publicProcedure } from './trpc';

export const setLegacyMailList = groupAdminProcedure.input(SetLegacyMailListDto).mutation(async (opts) => {
  if (!LEGACY_MAIL_LIST_ENABLED.includes(opts.input.groupId)) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Csoport nem támogatja a hagyaték levelezési listát' });
  }

  const uniqueMaillist = Array.from(new Set(opts.input.maillist));

  const acceptedMembers = await prismaClient.membership.findMany({
    where: {
      groupId: opts.input.groupId,
      status: MembershipStatus.Approved,
      user: {
        NOT: {
          emailVerified: null,
        },
      },
    },
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const existingMemberEmails = acceptedMembers.map((member) => member.user.email);

  const newMaillist = uniqueMaillist.filter((email) => !existingMemberEmails.includes(email));

  return prismaClient.group.update({
    where: { id: opts.input.groupId },
    data: { legacyMaillist: newMaillist },
  });
});

export const unsubscribeFromLegacyMailList = publicProcedure
  .input(UnsubscribeFromLegacyMailListDto)
  .mutation(async (opts) => {
    const group = await prismaClient.group.findUnique({
      where: { id: opts.input.groupId },
    });

    if (!group) throw new TRPCError({ code: 'NOT_FOUND', message: 'Csoport nem található' });

    const member = await prismaClient.membership.findFirst({
      where: {
        groupId: opts.input.groupId,
        user: { email: opts.input.email },
      },
    });

    if (member)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Ezt az e-mail címet nem lehet leiratkoztatni, mivel rendes tagja a csoportnak. Ebben az esetben a csoport oldalán az Értesítések beállításokban lehet az értesítéseket letiltani.',
      });

    await prismaClient.group.update({
      where: { id: opts.input.groupId },
      data: { legacyMaillist: { set: group.legacyMaillist.filter((email) => email !== opts.input.email) } },
    });
  });

import { TRPCError } from '@trpc/server';
import { isAxiosError } from 'axios';

import { prismaClient } from '@/config/prisma.config';
import { addVercelDomain, deleteVercelDomain, getDomainConfig } from '@/network/vercel.network';
import { groupAdminProcedure } from '@/trpc/trpc';
import { AddDomainDto, CheckDomainDto, DeleteDomainDto } from '@/types/domain.types';

export const addDomain = groupAdminProcedure.input(AddDomainDto).mutation(async (opts) => {
  const existingDomain = await prismaClient.groupDomain.findFirst({
    where: {
      domain: opts.input.domain,
    },
  });

  if (existingDomain) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A megadott domén már létezik',
    });
  }

  try {
    await addVercelDomain(opts.input.domain);

    return prismaClient.groupDomain.create({
      data: {
        domain: opts.input.domain,
        groupId: opts.input.groupId,
      },
    });
  } catch (e) {
    if (isAxiosError(e)) {
      console.error(e.response?.data);
    }
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A domén hozzáadása sikertelen',
    });
  }
});

export const checkDomain = groupAdminProcedure.input(CheckDomainDto).query(async (opts) => {
  const domain = await prismaClient.groupDomain.findFirst({
    where: {
      groupId: opts.input.groupId,
    },
  });

  if (!domain) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'A megadott domén nem létezik',
    });
  }

  try {
    const domainConfig = await getDomainConfig(domain.domain);

    return {
      misconfigured: Boolean(domainConfig.misconfigured),
    };
  } catch (e) {
    if (isAxiosError(e)) {
      console.error(e.response?.data);
    }
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A domén lekérése sikertelen',
    });
  }
});

export const deleteDomain = groupAdminProcedure.input(DeleteDomainDto).mutation(async (opts) => {
  const domain = await prismaClient.groupDomain.findFirst({
    where: {
      domain: opts.input.domain,
      groupId: opts.input.groupId,
    },
  });

  if (!domain) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'A megadott domén nem létezik',
    });
  }

  try {
    await deleteVercelDomain(domain.domain);

    return prismaClient.groupDomain.delete({
      where: {
        domain: opts.input.domain,
        groupId: opts.input.groupId,
      },
    });
  } catch (e) {
    if (isAxiosError(e)) {
      console.error(e.response?.data);
    }
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A domén törlése sikertelen',
    });
  }
});

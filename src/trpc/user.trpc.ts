import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prismaClient } from '@/config/prisma.config';
import { hashPassword } from '@/lib/utils';
import { privateProcedure, publicProcedure } from '@/trpc/trpc';
import { RegisterDto, UpdateUserProfileDto, UserProfileDto } from '@/types/user.types';

export const registerUser = publicProcedure.input(RegisterDto).mutation(async (opts): Promise<UserProfileDto> => {
  const { password, ...data } = opts.input;

  return prismaClient.user.create({
    data: {
      ...data,
      password: hashPassword(password),
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      address: true,
    },
  });
});

export const updateProfile = privateProcedure
  .input(UpdateUserProfileDto)
  .mutation(async (opts): Promise<UserProfileDto> => {
    if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

    const { email, ...data } = opts.input;

    return prismaClient.user.update({
      where: {
        id: opts.ctx.session.user.id,
      },
      data,
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
      },
    });
  });

export const getUserById = privateProcedure.input(z.string()).query(async (opts) => {
  return prismaClient.user.findUnique({
    where: {
      id: opts.input,
    },
  });
});

export const getMyUser = privateProcedure.query(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  return prismaClient.user.findUnique({
    where: {
      id: opts.ctx.session.user.id,
    },
  });
});

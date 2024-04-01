import { prismaClient } from '@/config/prisma.config';
import { publicProcedure } from '@/trpc/trpc';
import { RegisterDto, UserProfileDto } from '@/types/user.types';
import { hashPassword } from '@/utils/auth.utils';

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

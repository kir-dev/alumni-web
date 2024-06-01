import { VerificationTokenType } from '@prisma/client';
import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';
import { addMinutes } from 'date-fns';
import { z } from 'zod';

import { SITE_URL } from '@/config/environment.config';
import { prismaClient } from '@/config/prisma.config';
import EmailVerification from '@/emails/email-verification';
import PasswordResetEmail from '@/emails/password-reset';
import Welcome from '@/emails/welcome';
import { singleSendEmail } from '@/lib/email';
import { generateRandomString, hashPassword } from '@/lib/utils';
import { privateProcedure, publicProcedure } from '@/trpc/trpc';
import { PasswordResetDto, RegisterDto, UpdateUserProfileDto, UserProfileDto } from '@/types/user.types';

export const registerUser = publicProcedure.input(RegisterDto).mutation(async (opts): Promise<UserProfileDto> => {
  const { password, ...data } = opts.input;

  const user = await prismaClient.user.create({
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
      id: true,
    },
  });

  const verificationToken = await prismaClient.verificationToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      token: generateRandomString(32),
      expires: addMinutes(new Date(), 15),
      type: VerificationTokenType.Email,
    },
  });

  singleSendEmail({
    to: user.email,
    subject: 'Üdvözlünk az Almuni Weben 👋',
    html: render(
      Welcome({
        name: user.firstName,
        verificationLink: `${SITE_URL}/api/verify/${verificationToken.token}`,
      })
    ),
  });
  return user;
});

export const requestEmailVerification = privateProcedure.mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  const user = await prismaClient.user.findUnique({
    where: {
      id: opts.ctx.session.user.id,
    },
  });

  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

  await createEmailVerificationSession(user.id);
});

export const resetPassword = publicProcedure.input(PasswordResetDto).mutation(async (opts) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email: opts.input.email,
    },
  });

  if (!user) return;

  const verificationToken = await prismaClient.verificationToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      token: generateRandomString(32),
      expires: addMinutes(new Date(), 15),
      type: VerificationTokenType.Password,
    },
  });

  singleSendEmail({
    to: user.email,
    subject: 'Jelszó visszaállítás',
    html: render(
      PasswordResetEmail({
        name: user.firstName,
        resetLink: `${SITE_URL}/password-reset/${verificationToken.token}`,
      })
    ),
  });
});

export const newPassword = publicProcedure
  .input(z.object({ token: z.string(), password: z.string() }))
  .mutation(async (opts) => {
    const verificationToken = await prismaClient.verificationToken.findUnique({
      where: {
        token: opts.input.token,
      },
    });

    if (!verificationToken) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid token' });

    if (verificationToken.expires < new Date()) {
      await prismaClient.verificationToken.delete({
        where: {
          token: verificationToken.token,
        },
      });
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Token expired' });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: verificationToken.userId,
      },
    });

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashPassword(opts.input.password),
      },
    });

    await prismaClient.verificationToken.delete({
      where: {
        token: verificationToken.token,
      },
    });
  });

export const updateProfile = privateProcedure
  .input(UpdateUserProfileDto)
  .mutation(async (opts): Promise<UserProfileDto> => {
    if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    const existingUser = await prismaClient.user.findUnique({
      where: {
        id: opts.ctx.session.user.id,
      },
    });

    if (!existingUser) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const user = await prismaClient.user.update({
      where: {
        id: opts.ctx.session.user.id,
      },
      data: opts.input,
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
      },
    });

    if (existingUser.email !== user.email) {
      await createEmailVerificationSession(opts.ctx.session.user.id);
    }

    return user;
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

async function createEmailVerificationSession(userId: string) {
  const user = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: null,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prismaClient.verificationToken.deleteMany({
    where: {
      userId: user.id,
      type: VerificationTokenType.Email,
    },
  });

  const token = await prismaClient.verificationToken.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      token: generateRandomString(32),
      expires: addMinutes(new Date(), 15),
      type: VerificationTokenType.Email,
    },
  });

  singleSendEmail({
    to: user.email,
    subject: 'E-mail cím megerősítése',
    html: render(
      EmailVerification({
        name: user.firstName,
        verificationLink: `${SITE_URL}/api/verify/${token.token}`,
      })
    ),
  });
}

export const toggleSuperAdmin = privateProcedure.input(z.string()).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  const user = await prismaClient.user.findUnique({
    where: {
      id: opts.input,
    },
  });

  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      isSuperAdmin: !user.isSuperAdmin,
    },
  });
});

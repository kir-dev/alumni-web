import { TRPCError } from '@trpc/server';
import { authenticator } from 'otplib';

import { prismaClient } from '@/config/prisma.config';
import { privateProcedure } from '@/trpc/trpc';
import { VerifyTfaInput } from '@/types/tfa.types';

export const createTfa = privateProcedure.mutation(async (opts) => {
  if (!opts.ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  await prismaClient.tfaToken.deleteMany({
    where: {
      userId: opts.ctx.session.user.id,
    },
  });

  const token = await prismaClient.tfaToken.create({
    data: {
      token: createSecret(),
      secret: createSecret(),
      userId: opts.ctx.session.user.id,
    },
  });

  const issuer = process.env.TFA_ISSUER || 'localhost:3000';

  return {
    url: authenticator.keyuri(opts.ctx.session.user.email, issuer, token.secret),
  };
});

export const removeTfa = privateProcedure.mutation(async (opts) => {
  if (!opts.ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  await prismaClient.tfaToken.deleteMany({
    where: {
      userId: opts.ctx.session.user.id,
    },
  });
});

export const verifyTfa = privateProcedure.input(VerifyTfaInput).mutation(async (opts) => {
  if (!opts.ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  const tfaToken = await prismaClient.tfaToken.findUnique({
    where: {
      userId: opts.ctx.session.user.id,
    },
  });

  if (!tfaToken) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'A kétlépcsős azonosítás nincs bekapcsolva.',
    });
  }

  const isValid = authenticator.verify({
    token: opts.input.token,
    secret: tfaToken.secret,
  });

  if (!isValid) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Érvénytelen kód.',
    });
  }

  await prismaClient.tfaToken.update({
    where: {
      id: tfaToken.id,
    },
    data: {
      isEnabled: true,
    },
  });

  return { success: true };
});

function createSecret() {
  return authenticator.generateSecret();
}

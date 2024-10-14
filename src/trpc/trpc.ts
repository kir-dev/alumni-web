import * as Sentry from '@sentry/node';
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';

export const createContext = async () => {
  const session = await getServerSession(authOptions);

  return {
    session,
  };
};

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();
const middleware = t.middleware;

const sentryMiddleware = middleware(Sentry.trpcMiddleware({ attachRpcInput: true }));

const isAuthorized = middleware(async (opts) => {
  if (!opts.ctx.session?.user?.email || !opts.ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }

  return opts.next();
});

const isSuperAdmin = middleware(async (opts) => {
  if (!opts.ctx.session?.user?.isSuperAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }

  return opts.next();
});

const isGroupAdmin = middleware(async (opts) => {
  const isSuperAdmin = opts.ctx.session?.user?.isSuperAdmin;

  if (isSuperAdmin) {
    return opts.next();
  }

  const input = await opts.getRawInput();

  const groupId =
    typeof input === 'object'
      ? (
          input as {
            groupId: string | undefined;
          }
        ).groupId
      : undefined;

  if (!groupId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A kérésben szereplő csoport nem azonosítható.',
      cause: 'groupId is missing',
    });
  }

  const membership = await prismaClient.membership.findFirst({
    where: {
      userId: opts.ctx.session?.user?.id,
      groupId: groupId,
      isAdmin: true,
    },
  });

  if (!membership) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }

  return opts.next();
});

export const router = t.router;
export const publicProcedure = t.procedure.use(sentryMiddleware);
export const privateProcedure = t.procedure.use(sentryMiddleware).use(isAuthorized);
export const groupAdminProcedure = t.procedure.use(sentryMiddleware).use(isAuthorized).use(isGroupAdmin);
export const superAdminProcedure = t.procedure.use(sentryMiddleware).use(isAuthorized).use(isSuperAdmin);

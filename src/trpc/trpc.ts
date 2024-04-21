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
  const groupId =
    typeof opts.input === 'object'
      ? (
          opts.input as {
            groupId: string | undefined;
          }
        ).groupId
      : undefined;

  const membership = await prismaClient.membership.findFirst({
    where: {
      userId: opts.ctx.session?.user?.id,
      groupId: groupId,
    },
  });

  if (!membership?.isAdmin && !isSuperAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  }

  return opts.next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthorized);
export const groupAdminProcedure = t.procedure.use(isAuthorized).use(isGroupAdmin);
export const superAdminProcedure = t.procedure.use(isAuthorized).use(isSuperAdmin);

import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthorized);

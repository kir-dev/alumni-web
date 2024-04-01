import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

const middleware = t.middleware;

const isAuthorized = middleware(async (opts) => {
  return opts.next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthorized);

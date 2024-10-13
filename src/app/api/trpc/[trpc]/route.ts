import * as Sentry from '@sentry/node';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/trpc';
import { createContext } from '@/trpc/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    onError: (opts) => {
      if (opts.error.code === 'INTERNAL_SERVER_ERROR') {
        Sentry.captureEvent({ ...opts.error });
        opts.error.message = 'Nem várt szerver hiba';
      }
      return opts;
    },
  });

export { handler as GET, handler as POST };

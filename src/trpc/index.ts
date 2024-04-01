import { router } from '@/trpc/trpc';
import { registerUser } from '@/trpc/user.trpc';

export const appRouter = router({
  registerUser,
});

export type AppRouter = typeof appRouter;

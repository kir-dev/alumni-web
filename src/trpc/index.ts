import { router } from '@/trpc/trpc';
import { getMyUser, getUserById, registerUser, updateProfile } from '@/trpc/user.trpc';

export const appRouter = router({
  registerUser,
  updateProfile,
  getUserById,
  getMyUser,
});

export type AppRouter = typeof appRouter;

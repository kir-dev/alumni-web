import { createEvent, createEventApplication, getEventApplicationForUser, updateEvent } from '@/trpc/event.trpc';
import {
  createGroup,
  deleteMembership,
  editMembership,
  getGroup,
  getGroups,
  joinGroup,
  leaveGroup,
  toggleAdmin,
  updateGroup,
} from '@/trpc/group.trpc';
import { createNews } from '@/trpc/news.trpc';
import { router } from '@/trpc/trpc';
import { getMyUser, getUserById, registerUser, updateProfile } from '@/trpc/user.trpc';

export const appRouter = router({
  registerUser,
  updateProfile,
  getUserById,
  getMyUser,
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  editMembership,
  deleteMembership,
  toggleAdmin,
  createEvent,
  updateEvent,
  getEventApplicationForUser,
  createEventApplication,
  createNews,
});

export type AppRouter = typeof appRouter;

import { createEvent, createEventApplication, getEventApplicationForUser, updateEvent } from '@/trpc/event.trpc';
import {
  createGroup,
  deleteMembership,
  editMembership,
  getGroup,
  getGroups,
  joinGroup,
  leaveGroup,
  sendEmail,
  toggleAdmin,
  updateGroup,
} from '@/trpc/group.trpc';
import { createNews } from '@/trpc/news.trpc';
import { createSite, deleteSite, editSite } from '@/trpc/site-editor.trpc';
import { createTfa, removeTfa, verifyTfa } from '@/trpc/tfa.trpc';
import { router } from '@/trpc/trpc';
import {
  getMyUser,
  getUserById,
  newPassword,
  registerUser,
  requestEmailVerification,
  resetPassword,
  updateProfile,
} from '@/trpc/user.trpc';

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
  createSite,
  editSite,
  deleteSite,
  createTfa,
  removeTfa,
  verifyTfa,
  resetPassword,
  newPassword,
  requestEmailVerification,
  sendEmail,
});

export type AppRouter = typeof appRouter;

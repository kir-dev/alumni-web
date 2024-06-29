import {
  createEvent,
  createEventApplication,
  deleteEvent,
  getEventApplicationForUser,
  updateEvent,
} from '@/trpc/event.trpc';
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
import { createNews, deleteNews, updateNews } from '@/trpc/news.trpc';
import {
  createGroupSite,
  createSite,
  deleteGroupSite,
  deleteSite,
  editGroupSite,
  editSite,
} from '@/trpc/site-editor.trpc';
import { createTfa, removeTfa, verifyTfa } from '@/trpc/tfa.trpc';
import { router } from '@/trpc/trpc';
import {
  changePassword,
  deleteMyUser,
  getMyUser,
  getUserById,
  newPassword,
  registerUser,
  requestEmailVerification,
  resetPassword,
  toggleSuperAdmin,
  updateProfile,
} from '@/trpc/user.trpc';

export const appRouter = router({
  registerUser,
  updateProfile,
  getUserById,
  getMyUser,
  deleteMyUser,
  changePassword,
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
  updateNews,
  deleteNews,
  createSite,
  createGroupSite,
  editSite,
  editGroupSite,
  deleteSite,
  deleteGroupSite,
  createTfa,
  removeTfa,
  verifyTfa,
  resetPassword,
  newPassword,
  requestEmailVerification,
  sendEmail,
  toggleSuperAdmin,
  deleteEvent,
});

export type AppRouter = typeof appRouter;

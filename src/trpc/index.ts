import { addDomain, checkDomain, deleteDomain } from '@/trpc/domain.trpc';
import {
  createEvent,
  createEventApplication,
  deleteEvent,
  deleteEventApplication,
  getEventApplicationForUser,
  updateEvent,
} from '@/trpc/event.trpc';
import {
  createGroup,
  deleteGroup,
  deleteMembership,
  editMembership,
  getGroup,
  getGroups,
  getMembers,
  joinGroup,
  leaveGroup,
  sendEmail,
  toggleAdmin,
  updateGroup,
  updateNotificationPreferences,
} from '@/trpc/group.trpc';
import { createNews, deleteNews, updateNews } from '@/trpc/news.trpc';
import { privateSearch, publicSearch } from '@/trpc/search.trpc';
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
  getUsers,
  importUsers,
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
  deleteGroup,
  joinGroup,
  leaveGroup,
  editMembership,
  deleteMembership,
  toggleAdmin,
  createEvent,
  updateEvent,
  getEventApplicationForUser,
  createEventApplication,
  deleteEventApplication,
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
  addDomain,
  checkDomain,
  deleteDomain,
  updateNotificationPreferences,
  getUsers,
  importUsers,
  publicSearch,
  privateSearch,
  getMembers,
});

export type AppRouter = typeof appRouter;

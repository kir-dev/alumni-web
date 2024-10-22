import { Prisma } from '@prisma/client';
import { z } from 'zod';
import SortOrder = Prisma.SortOrder;

export const CreateGroupDto = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  parentGroupId: z.string().optional(),
  icon: z.string().optional(),
});

export const UpdateGroupDto = z.object({
  groupId: z.string(),
  data: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const JoinGroupDto = z.string();

export const EditMembershipDto = z.object({
  groupId: z.string(),
  userId: z.string(),
  status: z.enum(['Approved', 'Rejected']),
});

export const DeleteMembershipDto = z.object({
  groupId: z.string(),
  userId: z.string(),
});

export const ToggleAdminDto = z.object({
  userId: z.string(),
  groupId: z.string(),
});

export const SendEmailDto = z.object({
  groupId: z.string({ required_error: 'Csoport kötelező' }),
  subject: z.string({ required_error: 'Tárgy kötelező' }),
  content: z.string({ required_error: 'Tartalom kötelező' }),
});

export const UpdateNotificationSettingsDto = z.object({
  groupId: z.string(),
  enableGroupNotification: z.boolean().optional(),
  enableEventNotification: z.boolean().optional(),
  enableNewsNotification: z.boolean().optional(),
});

export const MemberQuery = z.object({
  groupId: z.string(),
  name: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  sort: z
    .object({
      field: z.string(),
      order: z.nativeEnum(SortOrder),
    })
    .optional(),
  isAdministrator: z.boolean().optional(),
});

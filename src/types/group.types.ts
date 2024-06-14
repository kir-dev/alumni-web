import { z } from 'zod';

export const CreateGroupDto = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  parentGroupId: z.string().optional(),
});

export const UpdateGroupDto = z.object({
  id: z.string(),
  data: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
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

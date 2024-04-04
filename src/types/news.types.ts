import { z } from 'zod';

export const CreateNewsDto = z.object({
  groupId: z.string({ required_error: 'A csoport azonosítója kötelező' }),
  title: z.string({ required_error: 'A cím kötelező' }),
  content: z.string({ required_error: 'A tartalom kötelező' }),
  publishDate: z.string().datetime().optional(),
  isPrivate: z.boolean().optional(),
});

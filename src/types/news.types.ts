import { z } from 'zod';

export const CreateNewsDto = z.object({
  groupId: z.string({ required_error: 'A csoport azonosítója kötelező' }),
  title: z.string({ required_error: 'A cím kötelező' }).min(3, 'A címnek legalább 3 karakter hosszúnak kell lennie'),
  content: z
    .string({ required_error: 'A tartalom kötelező' })
    .min(3, 'A tartalomnak legalább 3 karakter hosszúnak kell lennie'),
  publishDate: z.string().datetime().optional(),
  isPrivate: z.boolean().optional(),
});

export const UpdateNewsDto = z.object({
  id: z.string({ required_error: 'Az azonosító kötelező' }),
  groupId: z.string({ required_error: 'A csoport azonosítója kötelező' }),
  title: z.string({ required_error: 'A cím kötelező' }).min(3, 'A címnek legalább 3 karakter hosszúnak kell lennie'),
  content: z
    .string({ required_error: 'A tartalom kötelező' })
    .min(3, 'A tartalomnak legalább 3 karakter hosszúnak kell lennie'),
  publishDate: z.string().datetime().optional(),
  isPrivate: z.boolean().optional(),
});

export const DeleteNewsDto = z.object({
  newsId: z.string({ required_error: 'Az azonosító kötelező' }),
  groupId: z.string({ required_error: 'A csoport azonosítója kötelező' }),
});

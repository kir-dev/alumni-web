import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  password: z
    .string({ required_error: 'Jelszó megadása kötelező' })
    .min(8, 'A jelszó legalább 8 karakter hosszú kell legyen'),
  firstName: z.string({ required_error: 'Keresztnév megadása kötelező' }),
  lastName: z.string({ required_error: 'Vezetéknév megadása kötelező' }),
  phone: z.string().regex(/^\+?[0-9]+$/, 'Helytelen telefonszám'),
  address: z.string().min(5, 'A cím legalább 5 karakter hosszú kell legyen'),
});

export const LoginDto = z.object({
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  password: z.string({ required_error: 'Jelszó megadása kötelező' }),
});

export const UpdateUserProfileDto = z.object({
  firstName: z.string({ required_error: 'Keresztnév megadása kötelező' }),
  lastName: z.string({ required_error: 'Vezetéknév megadása kötelező' }),
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  phone: z.string().regex(/^\+?[0-9]+$/, 'Helytelen telefonszám'),
  address: z.string().min(5, 'A cím legalább 5 karakter hosszú kell legyen'),
});

export type UserProfileDto = z.infer<typeof UpdateUserProfileDto>;

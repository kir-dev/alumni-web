import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  password: z
    .string({ required_error: 'Jelszó megadása kötelező' })
    .min(8, 'A jelszó legalább 8 karakter hosszú kell legyen'),
  firstName: z.string({ required_error: 'Keresztnév megadása kötelező' }).min(1),
  lastName: z.string({ required_error: 'Vezetéknév megadása kötelező' }).min(1),
  phone: z.string({ required_error: 'Telefonszám megadása kötelező' }).regex(/^\+?[0-9]+$/, 'Helytelen telefonszám'),
  address: z
    .string({ required_error: 'Levelezési cím megadása kötelező' })
    .min(5, 'A cím legalább 5 karakter hosszú kell legyen'),
});

export const LoginDto = z.object({
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  password: z.string({ required_error: 'Jelszó megadása kötelező' }),
  token: z.string().optional(),
});

export const UpdateUserProfileDto = z.object({
  firstName: z.string({ required_error: 'Keresztnév megadása kötelező' }).min(1, 'Keresztnév megadása kötelező'),
  lastName: z.string({ required_error: 'Vezetéknév megadása kötelező' }).min(1, 'Vezetéknév megadása kötelező'),
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  phone: z.string({ required_error: 'Telefonszám megadása kötelező' }).regex(/^\+?[0-9]+$/, 'Helytelen telefonszám'),
  address: z
    .string({ required_error: 'Levelezési cím megadása kötelező' })
    .min(5, 'A cím legalább 5 karakter hosszú kell legyen'),
});

export type UserProfileDto = z.infer<typeof UpdateUserProfileDto>;

import { z } from 'zod';

export type UpdateUserProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
};

export const RegisterDto = z.object({
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  password: z
    .string({ required_error: 'Jelszó megadása kötelező' })
    .min(8, 'A jelszó legalább 8 karakter hosszú kell legyen'),
  firstName: z.string({ required_error: 'Keresztnév megadása kötelező' }),
  lastName: z.string({ required_error: 'Vezetéknév megadása kötelező' }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const LoginDto = z.object({
  email: z.string({ required_error: 'Email cím megadása kötelező' }).email('Helytelen email cím'),
  password: z.string({ required_error: 'Jelszó megadása kötelező' }),
});

export type UserProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

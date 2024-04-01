import { z } from 'zod';

export type UpdateUserProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
};

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string(),
});

export type UserProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

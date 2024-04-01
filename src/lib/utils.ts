import { type ClassValue, clsx } from 'clsx';
import crypto from 'crypto';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

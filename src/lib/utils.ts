import { type ClassValue, clsx } from 'clsx';
import crypto from 'crypto';
import { format, isSameDay, isSameYear } from 'date-fns';
import { hu } from 'date-fns/locale/hu';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function formatHu(date: string | number | Date, formatString: string): string {
  return format(date, formatString, { locale: hu });
}

export function getFormattedDateInterval(start: string | number | Date, end: string | number | Date): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDateString = isSameYear(startDate, endDate)
    ? formatHu(startDate, 'MMM dd. HH:mm')
    : formatHu(startDate, 'yyyy. MMM dd. HH:mm');
  const endDateString = isSameDay(startDate, endDate) ? formatHu(endDate, 'HH:mm') : formatHu(endDate, 'MMM dd. HH:mm');

  return `${startDateString} - ${endDateString}`;
}

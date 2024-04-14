import { User } from '@prisma/client';
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

export function exportUsersToCsv(users: User[], name: string = 'vair-export') {
  const fileName = name.toLowerCase().replace(/ /g, '-');
  const csv = `Név,Email,Telefonszám,Cím\n${users
    .map((user) => `${user.lastName} ${user.firstName},${user.email},${user.phone},${user.address}`)
    .join('\n')}`;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[áéíóöőúüű]/g, (char) => {
      switch (char) {
        case 'á':
          return 'a';
        case 'é':
          return 'e';
        case 'í':
          return 'i';
        case 'ó':
          return 'o';
        case 'ö':
          return 'o';
        case 'ő':
          return 'o';
        case 'ú':
          return 'u';
        case 'ü':
          return 'u';
        case 'ű':
          return 'u';
      }
      return '';
    })
    .replace(/[^a-z0-9-]/g, '');
}

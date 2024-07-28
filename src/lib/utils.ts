import { User } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import crypto from 'crypto';
import { format, formatRelative, isSameDay, isSameYear } from 'date-fns';
import { hu } from 'date-fns/locale/hu';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function formatHu(date: string | number | Date, formatString: string): string {
  return formatInTimeZone(date, 'Europe/Budapest', formatString, { locale: hu });
}

export function formatRelativeHu(date: string | number | Date, baseDate: string | number | Date): string {
  return formatRelative(toZonedTime(date, 'Europe/Budapest'), toZonedTime(baseDate, 'Europe/Budapest'), { locale: hu });
}

export function getFormattedDateInterval(start: string | number | Date, end: string | number | Date): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDateString =
    isSameYear(startDate, endDate) && isSameYear(startDate, new Date())
      ? formatHu(startDate, 'MMM dd. HH:mm')
      : formatHu(startDate, 'yyyy. MMM dd. HH:mm');
  const endDateString = isSameDay(startDate, endDate) ? formatHu(endDate, 'HH:mm') : formatHu(endDate, 'MMM dd. HH:mm');

  return `${startDateString} - ${endDateString}`;
}

export function exportUsersToCsv(users: User[], name: string = 'vair-export') {
  const fileName = name.toLowerCase().replace(/ /g, '-');
  const csv = `Név,Email,Telefonszám,Cím\n${users
    .map((user) => `${user.lastName} ${user.firstName},${user.email},${user.phone}`)
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

export function safeSlugify(title: string) {
  return `${slugify(title)}-${generateRandomString(5)}`;
}

export function getSuffixedTitle(title: string, ...suffix: string[]): string {
  let suffixedTitle = title;
  suffix.forEach((s) => {
    suffixedTitle += ` | ${s}`;
  });
  suffixedTitle += ' | Alumni';
  return suffixedTitle;
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < length; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomPart;
}

const fullConfig = resolveConfig(tailwindConfig);

export function generateGlobalThemePalette(baseColor: string) {
  const colors = fullConfig.theme?.colors;
  if (!colors) return '';
  const colorScheme = colors[baseColor as keyof typeof colors];
  if (!colorScheme) return '';
  let text = ':root{\n';
  Object.entries(colorScheme).forEach(([key, value]) => {
    text += `--color-primary-${key}: ${value};\n`;
  });
  text += '}';
  return text;
}

export function getAvailableColors(): { value: string; color: string }[] {
  const colors = fullConfig.theme?.colors;
  if (!colors) return [];
  return Object.entries(colors)
    .map(([key, value]) => ({ value: key, color: key === 'primary' ? '#163b66' : value[500] }))
    .filter((color) => ['inherit', 'current', 'transparent', 'black', 'white'].indexOf(color.value) === -1)
    .sort((a) => {
      if (['primary', 'bme'].includes(a.value)) return -1;
      return 1;
    });
}

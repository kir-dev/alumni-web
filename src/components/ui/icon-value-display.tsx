import { HTMLAttributes } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface IconValueDisplayProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconType;
  value: string;
  prefix?: string;
  type?: 'email' | 'tel' | 'address' | 'text';
}

export function IconValueDisplay({ icon: Icon, value, prefix, type, className, ...props }: IconValueDisplayProps) {
  return (
    <span
      className={cn('flex items-center space-x-2 text-lg text-primary-600 dark:text-primary-300', className)}
      {...props}
    >
      <Icon />
      {prefix && <span className='text-primary-600 dark:text-primary-300'>{prefix}</span>}
      {type === 'email' && <a href={`mailto:${value}`}>{value}</a>}
      {type === 'tel' && <a href={`tel:${value}`}>{value}</a>}
      {type === 'address' && <a href={`https://maps.google.com/?q=${encodeURIComponent(value)}`}>{value}</a>}
      {type === 'text' && <p className='text-primary-600 dark:text-primary-300 mt-0'>{value}</p>}
    </span>
  );
}

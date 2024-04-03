import { HTMLAttributes } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface IconValueDisplayProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconType;
  value: string;
  type?: 'email' | 'tel' | 'address';
}

export function IconValueDisplay({ icon: Icon, value, type, className, ...props }: IconValueDisplayProps) {
  return (
    <div className={cn('flex items-center space-x-2 text-lg', className)} {...props}>
      <Icon />
      {type === 'email' && <a href={`mailto:${value}`}>{value}</a>}
      {type === 'tel' && <a href={`tel:${value}`}>{value}</a>}
      {type === 'address' && <a href={`https://maps.google.com/?q=${encodeURIComponent(value)}`}>{value}</a>}
      {!type && <p>{value}</p>}
    </div>
  );
}

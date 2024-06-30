import { HTMLAttributes } from 'react';

import { cn, formatHu } from '@/lib/utils';

interface UpdatedAtProps extends HTMLAttributes<HTMLParagraphElement> {
  date: Date;
}

export function UpdatedAt({ date, className, ...props }: UpdatedAtProps) {
  const formattedDate = formatHu(date, 'yyyy. MMMM dd. HH:mm');
  return (
    <p className={cn('text-slate-500', className)} {...props}>
      Frissítve: {formattedDate}
    </p>
  );
}

import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface TextRendererProps extends Partial<Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>> {
  content: string;
}

export function TextRenderer({ content, className, ...props }: TextRendererProps) {
  return (
    <p className={cn('text-justify', className)} {...props}>
      {content}
    </p>
  );
}

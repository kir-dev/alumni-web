import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface EditorFieldWrapperProps extends HTMLAttributes<HTMLDivElement> {}

export function EditorFieldWrapper({ className, ...props }: EditorFieldWrapperProps) {
  return (
    <div
      className={cn('border border-primary-100 hover:border-primary-500 rounded-md p-2 transition-colors', className)}
      {...props}
    />
  );
}

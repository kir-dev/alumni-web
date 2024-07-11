import { HTMLAttributes } from 'react';

import { ChatPopup } from '@/components/ai/chat-popup';
import { cn } from '@/lib/utils';

interface AiWrapperProps extends HTMLAttributes<HTMLDivElement> {
  context?: string;
  onGenerate: (value: string) => void;
}

export function AiWrapper({ context, onGenerate, className, children, ...props }: AiWrapperProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
      <ChatPopup onGenerate={onGenerate} context={context} className='absolute right-2 bottom-2' />
    </div>
  );
}

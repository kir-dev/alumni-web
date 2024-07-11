'use client';

import { PopoverClose } from '@radix-ui/react-popover';
import { useChat } from 'ai/react';
import * as React from 'react';
import { useEffect } from 'react';
import { TbExclamationCircle, TbLoader, TbSparkles } from 'react-icons/tb';

import { Button, ButtonProps } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatPopupProps extends Omit<ButtonProps, 'children'> {
  onGenerate: (value: string) => void;
  context?: string;
}

export function ChatPopup({ onGenerate, context, className }: ChatPopupProps) {
  const chat = useChat({});
  const isLoading = chat.isLoading.valueOf();

  const lastMessage = chat.messages[chat.messages.length - 1]?.content;

  useEffect(() => {
    if (lastMessage) onGenerate(lastMessage);
  }, [lastMessage]);

  if (!process.env.NEXT_PUBLIC_AI_ENABLED) return null;

  let icon = <TbSparkles />;
  if (isLoading) {
    icon = <TbLoader className='animate-spin' />;
  } else if (chat.error) {
    icon = <TbExclamationCircle />;
  }

  return (
    <Popover>
      <Button
        disabled={isLoading}
        className={cn(
          'text-white bg-gradient-to-r from-purple-500 to-yellow-500 hover:to-purple-900',
          { 'from-red-500 to-yellow-500 hover:to-red-900': chat.error },
          className
        )}
        asChild
      >
        <PopoverTrigger>
          {icon}
          Tartalom generálása
        </PopoverTrigger>
      </Button>

      <PopoverContent>
        <form
          onSubmit={(event) => {
            event.stopPropagation();
            chat.handleSubmit(event, {
              body: {
                context,
              },
            });
          }}
        >
          <Textarea required onChange={chat.handleInputChange} value={chat.input} />
          <Button type='submit' className='mt-5' asChild>
            <PopoverClose>
              <TbSparkles />
              Generálás
            </PopoverClose>
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

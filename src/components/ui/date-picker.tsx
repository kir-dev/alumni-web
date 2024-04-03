import { format } from 'date-fns';
import { hu } from 'date-fns/locale/hu';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';

import { Button, ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps extends Omit<ButtonProps, 'onChange' | 'value'> {
  value: string | undefined;
  onChange: (date: string | undefined) => void;
}

export function DatePicker({ value, onSelect, className, variant, onChange, ...props }: DatePickerProps) {
  const [dateState, setDateState] = useState<Date>();

  let date = dateState;
  if (value) {
    try {
      date = new Date(value);
    } catch {}
  }

  const onDateSelect: SelectSingleEventHandler = (date: Date | undefined) => {
    setDateState(date);
    onChange(date?.toISOString());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant ?? 'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal bg-white',
            !date && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP', { locale: hu }) : <span>Válassz dátumot</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date} onSelect={onDateSelect} initialFocus locale={hu} />
      </PopoverContent>
    </Popover>
  );
}

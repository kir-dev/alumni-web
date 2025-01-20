import { hu } from 'date-fns/locale/hu';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';

import { Button, ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatHu } from '@/lib/utils';

interface DatePickerProps extends Omit<ButtonProps, 'onChange' | 'value'> {
  value: string | null;
  onChange: (date: string | null) => void;
  clearable?: boolean;
}

export function DatePicker({ value, className, variant, onChange, clearable, ...props }: DatePickerProps) {
  const [dateState, setDateState] = useState<Date>();

  let date = dateState;
  if (value) {
    try {
      date = new Date(value);
    } catch {
      date = undefined;
    }
  }

  const onDateSelect: SelectSingleEventHandler = (date: Date | undefined) => {
    setDateState(date ?? undefined);
    onChange(date ? date.toISOString() : null);
  };

  const onClear = () => {
    setDateState(undefined);
    onChange(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant ?? 'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900',
            !date && 'text-muted-foreground',
            { 'rounded-tr-none rounded-br-none': clearable && date },
            className
          )}
          {...props}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? formatHu(date, 'yyyy. MM. dd.') : <span>Válassz dátumot</span>}
        </Button>
      </PopoverTrigger>
      {clearable && date && (
        <Button
          variant='outline'
          size='icon'
          onClick={onClear}
          className='rounded-tl-none rounded-bl-none bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 border-l-0'
        >
          <X className='h-4 w-4' />
        </Button>
      )}
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date ?? undefined} onSelect={onDateSelect} initialFocus locale={hu} />
      </PopoverContent>
    </Popover>
  );
}

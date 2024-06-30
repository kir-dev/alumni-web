import * as React from 'react';
import { useState } from 'react';

import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type Time = {
  hour: number;
  minute: number;
};

interface TimePickerProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: Time | undefined;
  onChange: (time: Time) => void;
}

export function TimePicker({ value, onChange, className, ...props }: TimePickerProps) {
  const [timeState, setTimeState] = useState<Time | undefined>(value);
  return (
    <Input
      type='time'
      className={cn('w-fit', className)}
      value={timeState ? getTimeString(timeState) : undefined}
      onChange={(e) => {
        const [hour, minute] = e.target.value.split(':').map(Number);
        setTimeState({ hour, minute });
        onChange({ hour, minute });
      }}
      {...props}
    />
  );
}

const getTimeString = (time: Time) => {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
};

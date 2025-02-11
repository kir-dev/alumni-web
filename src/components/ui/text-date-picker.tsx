'use client';

import { ChangeEvent, forwardRef, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface TextDatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  onBlur: () => void;
  className?: string;
  name: string;
  fields?: {
    year?: boolean;
    month?: boolean;
    day?: boolean;
  };
}

const monthNames = [
  { label: 'Január', value: '1' },
  { label: 'Február', value: '2' },
  { label: 'Március', value: '3' },
  { label: 'Április', value: '4' },
  { label: 'Május', value: '5' },
  { label: 'Június', value: '6' },
  { label: 'Július', value: '7' },
  { label: 'Augusztus', value: '8' },
  { label: 'Szeptember', value: '9' },
  { label: 'Október', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const TextDatePicker = forwardRef<HTMLInputElement, TextDatePickerProps>(
  ({ value, onChange, className, name, onBlur, fields }, ref) => {
    const [year, setYear] = useState<string>(fields?.year ? '' : '1');
    const [month, setMonth] = useState<string>(fields?.month ? '0' : '1');
    const [day, setDay] = useState<string>(fields?.day ? '' : '1');

    const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d+$/.test(val)) {
        const actualVal = Math.min(Math.max(parseInt(val), 1), 9999);
        setYear(actualVal.toString());
        updateDate(actualVal.toString(), month, day);
      } else if (val === '') {
        setYear('');
        updateDate('', month, day);
      }
    };

    const handleMonthChange = (value: string) => {
      const val = value;
      if (/^\d+$/.test(val) && val !== '0') {
        const actualVal = Math.min(Math.max(parseInt(val), 1), 12);
        setMonth(actualVal.toString());
        updateDate(year, actualVal.toString(), day);
      } else if (val === '0') {
        setMonth('');
        updateDate(year, '', day);
      }
    };

    const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d+$/.test(val) && val !== '0') {
        const actualVal = Math.min(Math.max(parseInt(val), 1), 31);
        setDay(actualVal.toString());
        updateDate(year, month, actualVal.toString());
      } else if (val === '') {
        setDay('');
        updateDate(year, month, '');
      } else if (val === '0') {
        setDay('0');
        updateDate(year, month, '');
      }
    };

    const updateDate = (y: string, m: string, d: string) => {
      if (y && m && d) {
        const date = new Date();
        date.setUTCFullYear(parseInt(y));
        date.setUTCMonth(parseInt(m) - 1);
        date.setUTCDate(parseInt(d));
        date.setUTCHours(0, 0, 0, 0);
        if (isValidDate(date)) {
          onChange(date.toISOString());
        } else {
          onChange(null);
        }
      } else {
        onChange(null);
      }
    };

    const isValidDate = (date: Date) => {
      return date instanceof Date && !isNaN(date.getTime());
    };

    useEffect(() => {
      if (value) {
        const date = new Date(value);
        setYear(date.getFullYear().toString());
        setMonth(String(date.getMonth() + 1));
        setDay(String(date.getDate()));
      }
    }, [value]);

    return (
      <div className={cn('flex gap-2 items-center', className)}>
        {fields?.year && (
          <Input
            id={`${name}-year`}
            ref={ref}
            type='text'
            value={year}
            onChange={handleYearChange}
            onBlur={onBlur}
            placeholder='ÉÉÉÉ'
            maxLength={4}
          />
        )}
        {fields?.month && (
          <Select value={month} onValueChange={(value) => handleMonthChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Hónap' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Nincs megadva</SelectItem>
              {monthNames.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {fields?.day && (
          <Input
            id={`${name}-day`}
            type='text'
            value={day}
            onChange={handleDayChange}
            onBlur={onBlur}
            placeholder='NN'
            maxLength={2}
          />
        )}
      </div>
    );
  }
);

TextDatePicker.displayName = 'TextDatePicker';

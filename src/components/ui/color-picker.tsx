import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { TbCheck } from 'react-icons/tb';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const availableColors = ['#b91c1c', '#c2410c', '#be185d', '#7e22ce', '#0e7490', '#1d4ed8', '#15803d'];

interface ColorPickerProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function ColorPicker<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: ColorPickerProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ul className='flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 w-fit'>
              {availableColors.map((color) => (
                <li
                  key={color}
                  onClick={() => field.onChange(color)}
                  className='rounded-md h-10 w-10 flex items-center justify-center cursor-pointer'
                  style={{ backgroundColor: color }}
                >
                  {field.value === color && <TbCheck size={20} className='text-white' />}
                </li>
              ))}
            </ul>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

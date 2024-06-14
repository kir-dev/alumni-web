import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { TbCheck } from 'react-icons/tb';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getAvailableColors } from '@/lib/utils';

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
  const availableColors = getAvailableColors();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TooltipProvider delayDuration={0}>
              <ul className='flex mt-0 items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800 border border-slate-200 w-fit max-w-full overflow-x-auto'>
                {availableColors.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger type='button'>
                      <li
                        onClick={() => field.onChange(color.value)}
                        className='rounded-md h-10 w-10 flex items-center justify-center cursor-pointer mt-0'
                        style={{ backgroundColor: color.color }}
                      >
                        {field.value === color.value && <TbCheck size={20} className='text-white' />}
                      </li>
                    </TooltipTrigger>
                    <TooltipContent>{color.value}</TooltipContent>
                  </Tooltip>
                ))}
              </ul>
            </TooltipProvider>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

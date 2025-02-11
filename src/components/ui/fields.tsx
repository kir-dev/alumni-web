import { HTMLInputTypeAttribute, ReactNode } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';

import { TextDatePicker } from './text-date-picker';

interface TextFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
}

export function TextField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  type,
  autoComplete,
}: TextFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} autoComplete={autoComplete} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

interface TextAreaFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function TextAreaField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: TextAreaFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

interface SelectFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  options: { label: string; value: string }[];
}

export function SelectField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
}: SelectFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

interface DateFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  clearable?: boolean;
}

export function DateField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  clearable = false,
}: DateFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, disabled, name, value }, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DatePicker
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              name={name}
              clearable={clearable}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

interface DateTimeFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function DateTimeField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: DateTimeFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, disabled, name, value }, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex items-center flex-wrap space-x-2'>
              <DatePicker
                value={value}
                onChange={(dateString) => {
                  if (!dateString) return;
                  const date = new Date(value ?? new Date());
                  const newDate = new Date(dateString);
                  newDate.setHours(date.getHours(), date.getMinutes());
                  onChange(newDate.toISOString());
                }}
                onBlur={onBlur}
                disabled={disabled}
                name={name}
              />
              <TimePicker
                value={{
                  hour: value ? new Date(value).getHours() : 0,
                  minute: value ? new Date(value).getMinutes() : 0,
                }}
                onChange={(time) => {
                  const date = new Date(value ?? new Date());
                  date.setHours(time.hour, time.minute);
                  onChange(date.toISOString());
                }}
                onBlur={onBlur}
                disabled={disabled}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

interface CheckboxFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: ReactNode;
  description?: string;
}

export function CheckboxField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: CheckboxFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <FormItem>
          <div className='flex space-x-2 items-center mt-5'>
            <Checkbox id={`${name}-checkbox`} checked={value} onCheckedChange={onChange} {...field} />
            <div>
              <FormLabel className='m-0' htmlFor={`${name}-checkbox`}>
                {label}
              </FormLabel>
              {description && <FormDescription className='m-0'>{description}</FormDescription>}
            </div>
          </div>
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

interface TextDatePickerFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  fields?: {
    year?: boolean;
    month?: boolean;
    day?: boolean;
  };
}

export function TextDatePickerField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  fields,
}: TextDatePickerFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TextDatePicker
              value={field.value}
              onChange={field.onChange}
              name={name}
              onBlur={field.onBlur}
              fields={fields}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

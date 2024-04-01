import { Control, FieldPath, FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TextFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function TextField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: TextFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

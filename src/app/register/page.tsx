'use client';

import { Control, FieldPath, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import Providers from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterDto } from '@/types/user.types';

export default function RegisterPage() {
  return (
    <main className='container'>
      <h1>Regisztráció</h1>
      <Providers>
        <RegisterForm />
      </Providers>
    </main>
  );
}

function RegisterForm() {
  const { mutateAsync, isPending, isError } = trpc.registerUser.useMutation();

  const form = useForm<z.infer<typeof RegisterDto>>();

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='lastName' label='Vezetéknév' />
        <TextField control={form.control} name='firstName' label='Keresztnév' />
        <TextField control={form.control} name='email' label='Email' />
        <TextField control={form.control} name='password' label='Jelszó' />
        <TextField control={form.control} name='phone' label='Telefonszám' />
        <TextField control={form.control} name='address' label='Levelezési cím' />
        <Button type='submit'>Regisztráció</Button>
        {isError && <p>Hiba történt a regisztráció során</p>}
        {isPending && <p>Folyamatban...</p>}
      </form>
    </Form>
  );
}

interface FormFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

function TextField<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: FormFieldProps<TName, TFieldValues>) {
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

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form, FormMessage } from '@/components/ui/form';
import { RegisterDto } from '@/types/user.types';

export function RegisterForm() {
  const { mutateAsync, isPending, isError } = trpc.registerUser.useMutation();

  const form = useForm<z.infer<typeof RegisterDto>>({
    resolver: zodResolver(RegisterDto),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} type='text' name='lastName' label='Vezetéknév' />
        <TextField control={form.control} type='text' name='firstName' label='Keresztnév' />
        <TextField control={form.control} type='email' name='email' label='Email' />
        <TextField control={form.control} type='password' name='password' label='Jelszó' />
        <TextField control={form.control} type='tel' name='phone' label='Telefonszám' />
        <TextField control={form.control} type='text' name='address' label='Levelezési cím' />
        <LoadingButton isLoading={isPending} className='mt-5' type='submit'>
          Regisztráció
        </LoadingButton>
        {isError && <FormMessage>Hiba történt a regisztráció során</FormMessage>}
      </form>
    </Form>
  );
}

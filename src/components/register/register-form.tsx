'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { CheckboxField, TextField } from '@/components/ui/fields';
import { Form, FormMessage } from '@/components/ui/form';
import { RegisterDto } from '@/types/user.types';

const RegisterFormSchema = RegisterDto.merge(
  z.object({
    gdpr: z.boolean().refine((value) => value, { message: 'Az adatvédelmi irányelvek elfogadása kötelező' }),
  })
);

export function RegisterForm() {
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const { mutateAsync, isPending, isError, error } = trpc.registerUser.useMutation();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    defaultValues: {
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      gdpr: false,
    },
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = form.handleSubmit(async ({ gdpr, ...data }) => {
    if (!gdpr) return;
    setLoginLoading(true);
    await mutateAsync(data);
    const signInResponse = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (signInResponse?.ok) {
      router.push('/profile');
      router.refresh();
    } else {
      form.setError('email', { message: 'Hiba történt a bejelentkezés során' });
    }
    setLoginLoading(false);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} type='text' name='lastName' label='Vezetéknév' />
        <TextField control={form.control} type='text' name='firstName' label='Keresztnév' />
        <TextField control={form.control} type='text' name='nickname' label='Becenév (nem kötelező)' />
        <TextField control={form.control} type='email' name='email' label='Email' />
        <TextField control={form.control} type='password' name='password' label='Jelszó' />
        <TextField control={form.control} type='tel' name='phone' label='Telefonszám' />
        <TextField control={form.control} type='text' name='address' label='Levelezési cím' />
        <CheckboxField
          control={form.control}
          name='gdpr'
          label={
            <>
              Elfogadom az{' '}
              <Link className='underline' href='/sites/adatvedelem' target='_blank'>
                adatvédelmi irányelveket
              </Link>
              .
            </>
          }
        />
        <LoadingButton isLoading={isPending || loginLoading} className='mt-5' type='submit'>
          Regisztráció
        </LoadingButton>
        {isError && <FormMessage>{error?.message || 'Hiba történt a regisztráció során'}</FormMessage>}
      </form>
    </Form>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { LoginDto } from '@/types/user.types';

export function LoginForm() {
  const form = useForm<z.infer<typeof LoginDto>>({
    resolver: zodResolver(LoginDto),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: true,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='email' label='E-mail cím' type='email' />
        <TextField control={form.control} name='password' label='Jelszó' type='password' />
        <div className='mt-5'>
          <Button type='submit'>Bejelentkezés</Button>
          <Button variant='link' asChild>
            <Link href='/register'>Regisztráció</Link>
          </Button>
        </div>
        {/*{isError && <p>Hiba történt a regisztráció során</p>}*/}
        {/*{isPending && <p>Folyamatban...</p>}*/}
      </form>
    </Form>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { LoginDto } from '@/types/user.types';

export function LoginForm() {
  const router = useRouter();
  const [tokenInputVisible, setTokenInputVisible] = useState(false);
  const form = useForm<z.infer<typeof LoginDto>>({
    defaultValues: {
      email: '',
      password: '',
      token: '',
    },
    resolver: zodResolver(LoginDto),
  });

  const onSubmit = form.handleSubmit((data) => {
    signIn('credentials', {
      email: data.email,
      password: data.password,
      token: data.token,
      redirect: false,
    }).then((response) => {
      if (response?.error === 'token_required') {
        setTokenInputVisible(true);
      } else if (response?.error === 'invalid_token') {
        form.setError('token', { message: 'Hibás token' });
      } else if (response?.ok) {
        router.push('/profile');
      }
    });
  });

  const token = form.watch('token', '');
  const setToken = (value: string) => {
    form.setValue('token', value);
    if (value.length === 6) {
      onSubmit();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {tokenInputVisible ? (
          <InputOTP maxLength={6} autoFocus onChange={(value) => setToken(value)} value={token}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        ) : (
          <>
            <TextField control={form.control} name='email' label='E-mail cím' type='email' />
            <TextField control={form.control} name='password' label='Jelszó' type='password' />
          </>
        )}
        <div className='mt-5'>
          <Button type='submit'>Bejelentkezés</Button>
          <Button variant='link' asChild>
            <Link href='/register'>Regisztráció</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

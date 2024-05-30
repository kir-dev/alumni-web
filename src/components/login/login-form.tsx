'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbMailCheck, TbMailX } from 'react-icons/tb';
import { z } from 'zod';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button, LoadingButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { LoginDto } from '@/types/user.types';

export function LoginForm() {
  const params = useSearchParams();
  const [loginLoading, setLoginLoading] = useState(false);
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
    setLoginLoading(true);
    signIn('credentials', {
      email: data.email,
      password: data.password,
      token: data.token,
      redirect: false,
    })
      .then((response) => {
        if (response?.error === 'token_required') {
          setTokenInputVisible(true);
        } else if (response?.error === 'invalid_token') {
          form.setError('token', { message: 'Hibás token' });
        } else if (response?.ok) {
          router.push('/feed');
          router.refresh();
        } else if (response?.status === 401) {
          form.setError('email', { message: 'Hibás e-mail cím vagy jelszó' });
        } else {
          form.setError('email', { message: 'Hiba történt a bejelentkezés során' });
        }
      })
      .finally(() => {
        setLoginLoading(false);
      });
  });

  const token = form.watch('token', '');
  const setToken = (value: string) => {
    form.setValue('token', value);
    if (value.length === 6) {
      onSubmit();
    }
  };

  const isVerified = params.get('verified') === 'true';
  const isVerificationError = params.get('verified') === 'false';

  return (
    <Form {...form}>
      {isVerified && (
        <Alert variant='success' className='mt-5'>
          <TbMailCheck />
          <AlertTitle>Sikeresen megerősítetted az e-mail címedet!</AlertTitle>
        </Alert>
      )}
      {isVerificationError && (
        <Alert variant='error' className='mt-5'>
          <TbMailX />
          <AlertTitle>Hiba történt az e-mail cím megerősítése során</AlertTitle>
        </Alert>
      )}
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
          <LoadingButton isLoading={loginLoading} type='submit'>
            Bejelentkezés
          </LoadingButton>
          <Button variant='link' asChild>
            <Link href='/register'>Regisztráció</Link>
          </Button>
          <Button variant='link' asChild>
            <Link href='/password-reset'>Elfelejtett jelszó</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

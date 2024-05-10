'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { NewPasswordDto } from '@/types/user.types';

interface NewPasswordFormProps {
  token: string;
}

export function NewPasswordForm({ token }: NewPasswordFormProps) {
  const router = useRouter();
  const newPassword = trpc.newPassword.useMutation();
  const form = useForm<z.infer<typeof NewPasswordDto>>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(NewPasswordDto),
  });

  const onSubmit = form.handleSubmit((data) => {
    newPassword
      .mutateAsync({
        token,
        password: data.password,
      })
      .then(() => {
        router.push('/login');
      });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField
          control={form.control}
          name='password'
          label='Új jelszó'
          type='password'
          autoComplete='new-password'
        />
        <div className='mt-5'>
          <LoadingButton isLoading={newPassword.isPending} type='submit'>
            Jelszó visszaállítása
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}

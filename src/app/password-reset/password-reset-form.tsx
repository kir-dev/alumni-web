'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { TbCircleCheck } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button, LoadingButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { PasswordResetDto } from '@/types/user.types';

export function PasswordResetForm() {
  const resetPassword = trpc.resetPassword.useMutation();
  const form = useForm<z.infer<typeof PasswordResetDto>>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(PasswordResetDto),
  });

  const onSubmit = form.handleSubmit((data) => {
    resetPassword.mutate(data);
  });

  if (resetPassword.isSuccess) {
    return (
      <>
        <Alert variant='success'>
          <TbCircleCheck />
          <AlertTitle>
            Az új jelszót tartalmazó e-mailt elküldtük a megadott címre. Kérjük, ellenőrizd a beérkezett levelek között.
          </AlertTitle>
        </Alert>
        <Button asChild className='mt-5'>
          <Link href='/login'>Vissza a bejelentkezéshez</Link>
        </Button>
      </>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='email' label='E-mail cím' type='email' />
        <div className='mt-5'>
          <LoadingButton isLoading={resetPassword.isPending} type='submit'>
            Jelszó visszaállítása
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}

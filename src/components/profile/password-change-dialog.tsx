'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/fields';
import { FormMessage } from '@/components/ui/form';
import { ChangePasswordDto } from '@/types/user.types';

export default function PasswordChangeDialog() {
  const changePassword = trpc.changePassword.useMutation();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof ChangePasswordDto>>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
    resolver: zodResolver(ChangePasswordDto),
  });

  const onSubmit = form.handleSubmit((data) => {
    changePassword
      .mutateAsync(data)
      .then(() => {
        setOpen(false);
      })
      .catch((e) => {
        form.setError('root', { message: e.message });
      });
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Button onClick={() => setOpen(true)} variant='outline'>
        Jelszó módosítása
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jelszó módosítása</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <TextField control={form.control} name='oldPassword' label='Régi jelszó' type='password' />
            <TextField control={form.control} name='newPassword' label='Új jelszó' type='password' />
            <TextField
              control={form.control}
              name='newPasswordConfirmation'
              label='Új jelszó megerősítése'
              type='password'
            />
            {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}
            <DialogFooter className='mt-5'>
              <Button type='submit'>Mentés</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

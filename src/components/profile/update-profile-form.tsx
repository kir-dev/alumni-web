'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TextDatePickerField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { UpdateUserProfileDto } from '@/types/user.types';

interface UpdateProfileFormProps {
  user: User;
}

export default function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const deleteMyUser = trpc.deleteMyUser.useMutation();
  const router = useRouter();
  const update = trpc.updateProfile.useMutation();
  const form = useForm<z.infer<typeof UpdateUserProfileDto>>({
    resolver: zodResolver(UpdateUserProfileDto),
    defaultValues: {
      lastName: user.lastName,
      firstName: user.firstName,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      graduationDate: user.graduationDate
        ? new Date(new Date(user.graduationDate).setUTCHours(0, 0, 0, 0)).toISOString()
        : undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await update.mutateAsync(data);
    router.refresh();
  });

  const onDelete = async () => {
    await deleteMyUser.mutateAsync();
    await signOut();
  };

  return (
    <Dialog>
      <Button variant='outline' asChild>
        <DialogTrigger>Adataim szerkesztése</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adataim szerkesztése</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogBody>
              <TextField control={form.control} name='lastName' label='Vezetéknév' />
              <TextField control={form.control} name='firstName' label='Keresztnév' />
              <TextField control={form.control} name='nickname' label='Becenév (nem kötelező)' />
              <TextField control={form.control} name='email' label='E-mail cím' />
              <TextField control={form.control} name='phone' label='Telefonszám' autoComplete='tel' />
              <TextField control={form.control} name='address' label='Levelezési cím' />
              <TextDatePickerField
                control={form.control}
                name='graduationDate'
                label='Felsőfokú végzettség dátuma'
                fields={{ year: true, month: true, day: false }}
              />
            </DialogBody>
            <DialogFooter className='mt-5'>
              <ConfirmationDialog
                title='Felhasználóm törlése'
                message='Biztosan törölni szeretnéd a felhasználódat? Ezzel az összes adataid törlésre kerülnek, és nem lesz lehetőséged visszaállítani azokat. Törlésre kerülnek a csoporttagságaid, jelentkezéseid is.'
                onConfirm={onDelete}
                trigger={<Button variant='destructiveOutline'>Felhasználóm törlése</Button>}
              />
              <Button type='submit' asChild>
                <DialogClose>Mentés</DialogClose>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

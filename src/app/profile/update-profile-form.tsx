'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { UpdateUserProfileDto } from '@/types/user.types';

export function UpdateProfileForm() {
  const user = trpc.getMyUser.useQuery(undefined);
  const update = trpc.updateProfile.useMutation();
  const form = useForm<z.infer<typeof UpdateUserProfileDto>>({
    resolver: zodResolver(UpdateUserProfileDto),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await update.mutateAsync(data);
  });

  useEffect(() => {
    if (user.data) {
      form.reset(user.data);
    }
  }, [user.data]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='lastName' label='Vezetéknév' />
        <TextField control={form.control} name='firstName' label='Keresztnév' />
        <TextField control={form.control} name='email' label='E-mail cím' />
        <TextField control={form.control} name='phone' label='Telefonszám' />
        <TextField control={form.control} name='address' label='Levelezési cím' />
        <Button className='mt-5' type='submit'>
          Mentés
        </Button>
      </form>
    </Form>
  );
}

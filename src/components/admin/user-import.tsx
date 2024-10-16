'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TbCircleCheck, TbCircleX } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { ImportUserDto } from '@/types/user.types';

const defaultValues: z.infer<typeof ImportUserDto> = {
  email: '',
  firstName: '',
  lastName: '',
  nickname: '',
  phone: '',
  address: '',
};

export function UserImport() {
  const importUsers = trpc.importUsers.useMutation();
  const form = useForm<z.infer<typeof ImportUserDto>>({
    defaultValues,
    resolver: zodResolver(ImportUserDto),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    importUsers.mutateAsync([data]).then((data) => {
      if (data.length > 0) {
        form.setError('email', { message: 'Ez az email cím már regisztrálva van' });
      } else {
        form.reset(defaultValues);
      }
    });
  });

  const isSuccess = importUsers.data && importUsers.data.length === 0;
  const isError = importUsers.data && importUsers.data.length > 0;

  return (
    <Card className='mt-5'>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <TextField control={form.control} type='email' name='email' label='Email' />
            <TextField control={form.control} type='text' name='lastName' label='Vezetéknév' />
            <TextField control={form.control} type='text' name='firstName' label='Keresztnév' />
            <TextField control={form.control} type='text' name='nickname' label='Becenév (nem kötelező)' />
            <TextField control={form.control} type='text' name='phone' label='Telefonszám (nem kötelező)' />
            <TextField control={form.control} type='text' name='address' label='Cím (nem kötelező)' />
            <div className='flex gap-2 items-center mt-5 flex-wrap'>
              <LoadingButton isLoading={importUsers.isPending} type='submit'>
                Importálás
              </LoadingButton>
              {isSuccess && (
                <div className='text-green-500 mt-2 flex items-center gap-1'>
                  <TbCircleCheck /> Sikeres importálás
                </div>
              )}
              {isError && (
                <div className='text-red-500 mt-2 flex items-center gap-1'>
                  <TbCircleX /> Hiba történt az importálás során
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

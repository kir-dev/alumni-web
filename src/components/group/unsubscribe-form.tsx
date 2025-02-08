'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { TbCircleCheck, TbCircleX } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { UnsubscribeFromLegacyMailListDto } from '@/types/legacy-mail-list.types';

import { LoadingButton } from '../ui/button';
import { TextField } from '../ui/fields';
import { Form } from '../ui/form';

interface UnsubscribeFormProps {
  group: Group;
}

export function UnsubscribeForm({ group }: UnsubscribeFormProps) {
  const unsubscribe = trpc.unsubscribeFromLegacyMailList.useMutation({
    onError: () => {},
  });

  const form = useForm<z.infer<typeof UnsubscribeFromLegacyMailListDto>>({
    resolver: zodResolver(UnsubscribeFromLegacyMailListDto),
    defaultValues: {
      email: '',
      groupId: group.id,
    },
  });

  if (unsubscribe.isSuccess) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <TbCircleCheck className='w-32 h-32 text-green-500 dark:text-green-400' />
        <p>Sikeresen leiratkoztál a csoport értesítéseiről.</p>
      </div>
    );
  }

  if (unsubscribe.isError) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <TbCircleX className='w-32 h-32 text-red-500 dark:text-red-400' />
        <p>Hiba történt a leiratkozás közben: {unsubscribe.error.message}</p>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    unsubscribe.mutate(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField
          name='email'
          label='E-mail címed'
          control={form.control}
          description='Ezt az e-mail címet leiratkoztatjuk a csoport értesítéseiről.'
        />
        <LoadingButton className='mt-5' type='submit' isLoading={unsubscribe.isPending}>
          Leiratkozás
        </LoadingButton>
      </form>
    </Form>
  );
}

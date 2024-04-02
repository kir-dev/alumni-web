'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { CreateGroupDto } from '@/types/group.types';

export function CreateGroupForm() {
  const router = useRouter();
  const groups = trpc.getGroups.useQuery(undefined);
  const createGroup = trpc.createGroup.useMutation();

  const form = useForm<z.infer<typeof CreateGroupDto>>({
    resolver: zodResolver(CreateGroupDto),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createGroup.mutateAsync(data).then((data) => {
      router.push(`/groups/${data.id}`);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='name' label='Csoport neve' />
        <TextAreaField control={form.control} name='description' label='Csoport leírása' />
        <ColorPicker control={form.control} name='color' label='Csoport színe' />
        <Button type='submit'>Létrehozás</Button>
      </form>
    </Form>
  );
}

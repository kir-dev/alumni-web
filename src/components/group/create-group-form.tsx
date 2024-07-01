'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { SelectField, TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { CreateGroupDto } from '@/types/group.types';

export function CreateGroupForm() {
  const router = useRouter();
  const groups = trpc.getGroups.useQuery(undefined);
  const createGroup = trpc.createGroup.useMutation();

  const form = useForm<z.infer<typeof CreateGroupDto>>({
    resolver: zodResolver(CreateGroupDto),
    defaultValues: {
      color: 'primary',
      parentGroupId: 'no-parent',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (data.parentGroupId === 'no-parent') data.parentGroupId = undefined;
    await createGroup.mutateAsync(data).then((data) => {
      router.push(`/groups/${data.id}`);
    });
  });

  const options = useMemo(() => {
    const opts = (groups.data ?? []).map((group) => ({
      label: group.name,
      value: group.id,
    }));
    opts.push({ label: 'Nincs szülő csoport', value: 'no-parent' });
    return opts;
  }, [groups.data]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='name' label='Csoport neve' />
        <TextAreaField control={form.control} name='description' label='Csoport leírása' />
        <ColorPicker control={form.control} name='color' label='Csoport színe' />
        <SelectField control={form.control} name='parentGroupId' label='Szülő csoport' options={options} />
        <LoadingButton isLoading={createGroup.isPending} className='mt-5' type='submit'>
          Létrehozás
        </LoadingButton>
      </form>
    </Form>
  );
}

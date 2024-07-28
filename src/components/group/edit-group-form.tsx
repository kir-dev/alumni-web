'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { FileInputField } from '@/components/file-input';
import { LoadingButton } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { CreateGroupDto } from '@/types/group.types';

interface EditGroupFormProps {
  group: Group;
}

export const dynamic = 'force-dynamic';

export function EditGroupForm({ group }: EditGroupFormProps) {
  const router = useRouter();
  const updateGroup = trpc.updateGroup.useMutation();

  const form = useForm<z.infer<typeof CreateGroupDto>>({
    resolver: zodResolver(CreateGroupDto),
    defaultValues: {
      name: group.name,
      description: group.description,
      color: group.color ?? undefined,
      icon: group.icon ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateGroup.mutateAsync({ id: group.id, data }).then((data) => {
      router.push(`/groups/${data.id}`);
      router.refresh();
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='name' label='Csoport neve' />
        <TextAreaField control={form.control} name='description' label='Csoport leírása' />
        <ColorPicker control={form.control} name='color' label='Csoport színe' />
        <FileInputField
          control={form.control}
          name='icon'
          label='Csoport ikonja (opcionális)'
          description='Csoport ikonja csak doménnel rendelkező csoportok esetén jelenik meg a felső menüben.'
        />
        <LoadingButton isLoading={updateGroup.isPending} className='mt-5' type='submit'>
          Mentés
        </LoadingButton>
      </form>
    </Form>
  );
}

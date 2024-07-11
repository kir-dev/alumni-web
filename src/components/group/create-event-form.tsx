'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { AiWrapper } from '@/components/ai/ai-wrapper';
import { LoadingButton } from '@/components/ui/button';
import { CheckboxField, DateTimeField, TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { getEventGenerationContext } from '@/lib/ai';
import { CreateEventDto } from '@/types/event.types';

interface CreateGroupFormProps {
  groupId: string;
  group: Group;
}

export function CreateEventForm({ groupId, group }: CreateGroupFormProps) {
  const router = useRouter();
  const createEvent = trpc.createEvent.useMutation();

  const form = useForm<z.infer<typeof CreateEventDto>>({
    resolver: zodResolver(CreateEventDto),
    defaultValues: {
      isPrivate: false,
      groupId,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createEvent.mutateAsync(data).then((result) => {
      router.push(`/groups/${groupId}/events/${result.id}`);
    });
  });

  const context = getEventGenerationContext(
    group,
    form.watch('name'),
    form.watch('location'),
    form.watch('startDate'),
    form.watch('endDate'),
    form.watch('isPrivate')
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='name' label='Esemény neve' />
        <TextField control={form.control} name='location' label='Helyszín' />
        <AiWrapper onGenerate={(text) => form.setValue('description', text)} context={context}>
          <TextAreaField control={form.control} name='description' label='Esemény leírása' />
        </AiWrapper>
        <DateTimeField control={form.control} name='startDate' label='Kezdés dátuma' />
        <DateTimeField control={form.control} name='endDate' label='Befejezés dátuma' />
        <CheckboxField
          control={form.control}
          name='isPrivate'
          label='Privát esemény'
          description='Privát esemény csak tagok számára elérhető'
        />
        <LoadingButton isLoading={createEvent.isPending} className='mt-5' type='submit'>
          Létrehozás
        </LoadingButton>
      </form>
    </Form>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Event, Group } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { AiWrapper } from '@/components/ai/ai-wrapper';
import { Button } from '@/components/ui/button';
import { CheckboxField, DateTimeField, TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { getEventGenerationContext } from '@/lib/ai';
import { UpdateEventDto } from '@/types/event.types';

interface CreateGroupFormProps {
  groupId: string;
  group: Group;
  event: Event;
}

export function UpdateEventForm({ groupId, event, group }: CreateGroupFormProps) {
  const router = useRouter();
  const updateEvent = trpc.updateEvent.useMutation();

  const form = useForm<z.infer<typeof UpdateEventDto>>({
    resolver: zodResolver(UpdateEventDto),
    defaultValues: {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
      groupId,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateEvent.mutateAsync(data).then(() => {
      router.push(`/groups/${groupId}/events/${event.id}`);
      router.refresh();
    });
  });

  const context = getEventGenerationContext(
    group,
    form.watch('name') ?? '',
    form.watch('location') ?? '',
    form.watch('startDate') ?? '',
    form.watch('endDate') ?? '',
    form.watch('isPrivate') ?? false
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
        <Button className='mt-5' type='submit'>
          Frissítés
        </Button>
      </form>
    </Form>
  );
}

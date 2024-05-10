'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { CheckboxField, DateField, TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { CreateNewsDto } from '@/types/news.types';

interface CreateNewsFormProps {
  groupId: string;
}

export function CreateNewsForm({ groupId }: CreateNewsFormProps) {
  const router = useRouter();
  const createEvent = trpc.createNews.useMutation();

  const form = useForm<z.infer<typeof CreateNewsDto>>({
    resolver: zodResolver(CreateNewsDto),
    defaultValues: {
      isPrivate: false,
      groupId,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createEvent.mutateAsync(data).then(() => {
      router.push(`/groups/${groupId}`);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='title' label='Hír címe' />
        <TextAreaField control={form.control} name='content' label='Hír tartalma' />
        <DateField control={form.control} name='publishDate' label='Publikálás dátuma (opcionális)' />
        <CheckboxField
          control={form.control}
          name='isPrivate'
          label='Privát hír'
          description='Privát hír csak tagok számára elérhető'
        />
        <Button className='mt-5' type='submit'>
          Létrehozás
        </Button>
      </form>
    </Form>
  );
}

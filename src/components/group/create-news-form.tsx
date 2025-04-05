'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { CheckboxField, DateTimeField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { getNewsGenerationContext } from '@/lib/ai';
import { CreateNewsDto } from '@/types/news.types';

import { NewsContentEditor } from './news-content-editor';

interface CreateNewsFormProps {
  groupId: string;
  group: Group;
}

export function CreateNewsForm({ groupId, group }: CreateNewsFormProps) {
  const router = useRouter();
  const createNews = trpc.createNews.useMutation();

  const form = useForm<z.infer<typeof CreateNewsDto>>({
    resolver: zodResolver(CreateNewsDto),
    defaultValues: {
      isPrivate: false,
      shouldNotify: true,
      groupId,
      content: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createNews.mutateAsync(data).then((result) => {
      router.push(`/groups/${groupId}/news/${result.id}`);
    });
  });

  const title = form.watch('title');

  const context = useMemo(() => getNewsGenerationContext(group, title), [group, title]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='title' label='Hír címe' />
        <NewsContentEditor
          value={form.watch('content')}
          onChange={(value) => form.setValue('content', value)}
          context={context}
        />
        <DateTimeField control={form.control} name='publishDate' label='Publikálás dátuma (opcionális)' />
        <CheckboxField
          control={form.control}
          name='isPrivate'
          label='Privát hír'
          description='Privát hír csak tagok számára elérhető'
        />

        <CheckboxField
          control={form.control}
          name='shouldNotify'
          label='Értesítés a tagoknak'
          description='Amennyiben be van jelölve, az értesítés a tagoknak küldésre kerül a publikálási dátum utáni ütemezéskor.'
        />
        <LoadingButton isLoading={createNews.isPending} className='mt-5' type='submit'>
          Létrehozás
        </LoadingButton>
      </form>
    </Form>
  );
}

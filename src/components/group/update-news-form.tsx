'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { News } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { CheckboxField, DateTimeField, TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { UpdateNewsDto } from '@/types/news.types';

interface UpdateNewsFormProps {
  news: News;
}

export function UpdateNewsForm({ news }: UpdateNewsFormProps) {
  const router = useRouter();
  const updateNews = trpc.updateNews.useMutation();

  const form = useForm<z.infer<typeof UpdateNewsDto>>({
    resolver: zodResolver(UpdateNewsDto),
    defaultValues: {
      ...news,
      publishDate: news.publishDate ? new Date(news.publishDate).toISOString() : undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateNews.mutateAsync(data).then(() => {
      router.push(`/groups/${news.groupId}/news/${news.id}`);
      router.refresh();
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='title' label='Hír címe' />
        <TextAreaField control={form.control} name='content' label='Hír tartalma' />
        <DateTimeField control={form.control} name='publishDate' label='Publikálás dátuma (opcionális)' />
        <CheckboxField
          control={form.control}
          name='isPrivate'
          label='Privát hír'
          description='Privát hír csak tagok számára elérhető'
        />
        <LoadingButton isLoading={updateNews.isPending} className='mt-5' type='submit'>
          Mentés
        </LoadingButton>
      </form>
    </Form>
  );
}

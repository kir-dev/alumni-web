'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { AiWrapper } from '@/components/ai/ai-wrapper';
import { LoadingButton } from '@/components/ui/button';
import { CheckboxField, DateTimeField, TextAreaField, TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { getNewsGenerationContext } from '@/lib/ai';
import { CreateNewsDto } from '@/types/news.types';

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
      groupId,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createNews.mutateAsync(data).then((result) => {
      router.push(`/groups/${groupId}/news/${result.id}`);
    });
  });

  const context = useMemo(() => getNewsGenerationContext(group), [group]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} name='title' label='Hír címe' />
        <AiWrapper onGenerate={(text) => form.setValue('content', text)} context={context}>
          <TextAreaField control={form.control} name='content' label='Hír tartalma' />
        </AiWrapper>
        <DateTimeField control={form.control} name='publishDate' label='Publikálás dátuma (opcionális)' />
        <CheckboxField
          control={form.control}
          name='isPrivate'
          label='Privát hír'
          description='Privát hír csak tagok számára elérhető'
        />
        <LoadingButton isLoading={createNews.isPending} className='mt-5' type='submit'>
          Létrehozás
        </LoadingButton>
      </form>
    </Form>
  );
}

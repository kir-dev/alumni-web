'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { AddBlockField } from '@/components/sites/editor/add-block-field';
import { BlockFieldDistributor } from '@/components/sites/editor/block-field-distributor';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields';
import { Form } from '@/components/ui/form';
import { CreateSiteDto, StaticSiteBlock } from '@/types/site-editor.types';

export function CreateSiteForm() {
  const router = useRouter();
  const createSite = trpc.createSite.useMutation();
  const form = useForm<z.infer<typeof CreateSiteDto>>({
    defaultValues: {
      title: '',
      blocks: [],
    },
    resolver: zodResolver(CreateSiteDto),
  });

  const onAddBlock = (type: StaticSiteBlock['type']) => {
    const blocks = form.getValues('blocks');
    let newBlock: StaticSiteBlock;
    switch (type) {
      case 'Text':
        newBlock = { type, content: '' };
        break;
      case 'Image':
        newBlock = { type, content: '' };
        break;
      case 'ImageText':
        newBlock = {
          type,
          content: JSON.stringify({
            text: '',
            image: '',
          }),
        };
        break;
    }
    form.setValue('blocks', [...blocks, newBlock]);
  };

  const onSubmit = form.handleSubmit((data) => {
    createSite.mutateAsync(data).then(() => {
      router.push('/sites');
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <TextField control={form.control} label='Cím' name='title' />
        <BlockFieldDistributor control={form.control} name='blocks' />
        <AddBlockField onAdd={onAddBlock} />
        <Button className='mt-10' type='submit'>
          Létrehozás
        </Button>
      </form>
    </Form>
  );
}

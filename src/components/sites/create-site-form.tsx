import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AddBlockField } from '@/components/sites/editor/add-block-field';
import { BlockFieldDistributor } from '@/components/sites/editor/block-field-distributor';
import { LoadingButton } from '@/components/ui/button';
import { Form, FormMessage } from '@/components/ui/form';
import { SpecialSiteSlugs } from '@/lib/static-site';
import { CreateSiteDto, StaticSiteBlock } from '@/types/site-editor.types';

interface CreateSiteFormProps {
  onSave: (input: z.infer<typeof CreateSiteDto>) => void;
  isLoading: boolean;
}

export function CreateSiteForm({ onSave, isLoading }: CreateSiteFormProps) {
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

  const onSubmit = form.handleSubmit(onSave);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <input
          placeholder='Oldal címe'
          className='bg-transparent text-3xl font-bold text-primary-900 dark:text-primary-100 outline-none w-full'
          {...form.register('title')}
        />
        <p className='text-sm text-slate-500'>
          A következő speciális oldalak megjelennek a láblécben: {SpecialSiteSlugs.map((slug) => slug.label).join(', ')}
          .
        </p>
        {form.formState.errors.title && <FormMessage>{form.formState.errors.title.message}</FormMessage>}

        <BlockFieldDistributor control={form.control} name='blocks' />
        <AddBlockField onAdd={onAddBlock} />
        <LoadingButton isLoading={isLoading} className='mt-10' type='submit'>
          Létrehozás
        </LoadingButton>
      </form>
    </Form>
  );
}

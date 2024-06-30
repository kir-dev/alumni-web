import { zodResolver } from '@hookform/resolvers/zod';
import { SiteBlock, StaticSite } from '@prisma/client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { TbExternalLink } from 'react-icons/tb';
import { z } from 'zod';

import { AddBlockField } from '@/components/sites/editor/add-block-field';
import { BlockFieldDistributor } from '@/components/sites/editor/block-field-distributor';
import { Button, LoadingButton } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EditSiteDto, StaticSiteBlock } from '@/types/site-editor.types';

interface EditSiteFormProps {
  site: StaticSite & {
    siteBlocks: SiteBlock[];
  };
  onSave: (input: z.infer<typeof EditSiteDto>) => void;
  onDelete: () => void;
  isLoading: boolean;
  isDeleting: boolean;
}

export function EditSiteForm({ site, onSave, onDelete, isLoading, isDeleting }: EditSiteFormProps) {
  const form = useForm<z.infer<typeof EditSiteDto>>({
    defaultValues: {
      id: site.id,
      title: site.title,
      blocks: site.siteBlocks.map((block) => ({
        type: block.type,
        content: block.content,
      })),
    },
    resolver: zodResolver(EditSiteDto),
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
        <BlockFieldDistributor control={form.control} name='blocks' />
        <AddBlockField onAdd={onAddBlock} />
        <div className='flex justify-between gap-2 mt-10'>
          <LoadingButton isLoading={isDeleting} variant='destructiveOutline' type='button' onClick={onDelete}>
            Oldal törlése
          </LoadingButton>
          <div className='flex gap-2'>
            <Button variant='outline' asChild>
              <Link href={site.groupId ? `/groups/${site.groupId}/sites/${site.url}` : `/sites/${site.url}`}>
                Oldal megtekintése
                <TbExternalLink />
              </Link>
            </Button>
            <LoadingButton isLoading={isLoading} type='submit'>
              Mentés
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

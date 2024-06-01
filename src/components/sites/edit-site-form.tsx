'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SiteBlock, StaticSite } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TbExternalLink } from 'react-icons/tb';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { AddBlockField } from '@/components/sites/editor/add-block-field';
import { BlockFieldDistributor } from '@/components/sites/editor/block-field-distributor';
import { Button, LoadingButton } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EditSiteDto, StaticSiteBlock } from '@/types/site-editor.types';

interface EditSiteFormProps {
  site: StaticSite & {
    siteBlocks: SiteBlock[];
  };
}

export function EditSiteForm({ site }: EditSiteFormProps) {
  const router = useRouter();
  const editSite = trpc.editSite.useMutation();
  const deleteSite = trpc.deleteSite.useMutation();
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

  const onSubmit = form.handleSubmit((data) => {
    editSite.mutateAsync(data).then(() => {
      router.push('/sites');
      router.refresh();
    });
  });

  const onDelete = () => {
    deleteSite.mutateAsync(site.id).then(() => {
      router.push('/sites');
      router.refresh();
    });
  };

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
          <Button variant='destructiveOutline' type='button' onClick={onDelete}>
            Oldal törlése
          </Button>
          <div className='flex gap-2'>
            <Button variant='outline' asChild>
              <Link href={`/sites/${site.url}`}>
                Oldal megtekintése
                <TbExternalLink />
              </Link>
            </Button>
            <LoadingButton isLoading={editSite.isPending} type='submit'>
              Mentés
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

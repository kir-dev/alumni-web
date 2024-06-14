'use client';
import { SiteBlock, StaticSite } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { EditSiteForm } from '@/components/sites/edit-site-form';
import { EditSiteDto } from '@/types/site-editor.types';

interface EditGlobalSiteProps {
  site: StaticSite & { siteBlocks: SiteBlock[] };
}

export function EditGlobalSite({ site }: EditGlobalSiteProps) {
  const router = useRouter();
  const editSite = trpc.editSite.useMutation();
  const deleteSite = trpc.deleteSite.useMutation();

  const onDelete = async () => {
    await deleteSite.mutateAsync(site.id);
    router.push('/sites');
    router.refresh();
  };

  const onSave = async (input: z.infer<typeof EditSiteDto>) => {
    await editSite.mutateAsync(input);
    router.push('/sites');
    router.refresh();
  };

  return (
    <EditSiteForm
      site={site}
      isLoading={editSite.isPending}
      isDeleting={deleteSite.isPending}
      onDelete={onDelete}
      onSave={onSave}
    />
  );
}

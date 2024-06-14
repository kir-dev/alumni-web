'use client';
import { SiteBlock, StaticSite } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { EditSiteForm } from '@/components/sites/edit-site-form';
import { EditSiteDto } from '@/types/site-editor.types';

interface EditGlobalSiteProps {
  groupId: string;
  site: StaticSite & { siteBlocks: SiteBlock[] };
}

export function EditGroupSite({ site, groupId }: EditGlobalSiteProps) {
  const router = useRouter();
  const editSite = trpc.editGroupSite.useMutation();
  const deleteSite = trpc.deleteGroupSite.useMutation();

  const onDelete = async () => {
    await deleteSite.mutateAsync({
      id: site.id,
      groupId,
    });
    router.push(`/groups/${groupId}`);
    router.refresh();
  };

  const onSave = async (input: z.infer<typeof EditSiteDto>) => {
    await editSite.mutateAsync({
      ...input,
      groupId,
    });
    router.push(`/groups/${groupId}`);
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

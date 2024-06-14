'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { CreateSiteForm } from '@/components/sites/create-site-form';
import { CreateSiteDto } from '@/types/site-editor.types';

interface CreateGroupSiteProps {
  groupId: string;
}

export function CreateGroupSite({ groupId }: CreateGroupSiteProps) {
  const router = useRouter();
  const createSite = trpc.createGroupSite.useMutation();

  const onSave = async (input: z.infer<typeof CreateSiteDto>) => {
    await createSite.mutateAsync({ ...input, groupId });
    router.push(`/groups/${groupId}`);
    router.refresh();
  };

  return <CreateSiteForm isTitleRestricted onSave={onSave} isLoading={createSite.isPending} />;
}

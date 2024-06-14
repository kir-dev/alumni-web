'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { trpc } from '@/_trpc/client';
import { CreateSiteForm } from '@/components/sites/create-site-form';
import { CreateSiteDto } from '@/types/site-editor.types';

export function CreateGlobalSite() {
  const router = useRouter();
  const createSite = trpc.createSite.useMutation();

  const onSave = async (input: z.infer<typeof CreateSiteDto>) => {
    await createSite.mutateAsync(input);
    router.push('/sites');
    router.refresh();
  };

  return <CreateSiteForm onSave={onSave} isLoading={createSite.isPending} />;
}

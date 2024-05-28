'use client';

import { useRouter } from 'next/navigation';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface DeleteNewsProps {
  newsId: string;
  groupId: string;
}

export function DeleteNews({ newsId, groupId }: DeleteNewsProps) {
  const deleteNews = trpc.deleteNews.useMutation();
  const router = useRouter();

  const onDelete = async () => {
    await deleteNews.mutateAsync({ newsId, groupId });
    router.push(`/groups/${groupId}`);
    router.refresh();
  };

  return (
    <ConfirmationDialog
      trigger={
        <LoadingButton isLoading={deleteNews.isPending} variant='destructiveOutline'>
          Törlés
        </LoadingButton>
      }
      title='Hír törlése'
      message='Biztosan törölni szeretnéd a hírt?'
      onConfirm={onDelete}
    />
  );
}

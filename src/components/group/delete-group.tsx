'use client';

import { useRouter } from 'next/navigation';
import { TbTrash } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface DeleteGroupProps {
  groupId: string;
}

export default function DeleteGroup({ groupId }: DeleteGroupProps) {
  const router = useRouter();
  const deleteGroup = trpc.deleteGroup.useMutation();

  const onDelete = async () => {
    await deleteGroup.mutateAsync(groupId);
    router.push(`/groups`);
    router.refresh();
  };

  return (
    <ConfirmationDialog
      trigger={
        <LoadingButton isLoading={deleteGroup.isPending} variant='destructiveOutline'>
          <TbTrash />
          Csoport törlése
        </LoadingButton>
      }
      title='Csoport törlése'
      message='Biztosan törölni szeretnéd a csoportot?'
      onConfirm={onDelete}
    />
  );
}

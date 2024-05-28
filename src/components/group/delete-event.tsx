'use client';

import { useRouter } from 'next/navigation';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface DeleteEventProps {
  eventId: string;
  groupId: string;
}

export function DeleteEvent({ eventId, groupId }: DeleteEventProps) {
  const deleteEvent = trpc.deleteEvent.useMutation();
  const router = useRouter();

  const onDelete = async () => {
    await deleteEvent.mutateAsync({ eventId, groupId });
    router.push(`/groups/${groupId}`);
    router.refresh();
  };

  return (
    <ConfirmationDialog
      trigger={
        <LoadingButton isLoading={deleteEvent.isPending} variant='destructiveOutline'>
          Törlés
        </LoadingButton>
      }
      title='Esemény törlése'
      message='Biztosan törölni szeretnéd az eseményt?'
      onConfirm={onDelete}
    />
  );
}

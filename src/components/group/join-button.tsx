'use client';

import { Membership } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { TbUserCancel, TbUserExclamation, TbUserMinus, TbUserPlus } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Button, LoadingButton } from '@/components/ui/button';

interface JoinButtonProps {
  membership: Membership | null;
  groupId: string;
}

export function JoinButton({ membership, groupId }: JoinButtonProps) {
  const router = useRouter();
  const joinGroup = trpc.joinGroup.useMutation();
  const leaveGroup = trpc.leaveGroup.useMutation();

  const isPending = membership?.status === 'Pending' || membership?.status === 'Dependent';
  const isMember = membership?.status === 'Approved';
  const isRejected = membership?.status === 'Rejected';

  const onJoin = async () => {
    await joinGroup.mutateAsync(groupId).then(router.refresh);
  };

  const onLeave = async () => {
    await leaveGroup.mutateAsync(groupId).then(router.refresh);
  };

  if (isPending) {
    return (
      <LoadingButton isLoading={leaveGroup.isPending} onClick={onLeave} variant='outline'>
        <TbUserCancel />
        Jelentkezés visszavonása
      </LoadingButton>
    );
  }

  if (isMember) {
    return (
      <LoadingButton isLoading={leaveGroup.isPending} onClick={onLeave} variant='outline'>
        <TbUserMinus />
        Kilépés
      </LoadingButton>
    );
  }

  if (isRejected) {
    return (
      <Button variant='outline' disabled>
        <TbUserExclamation />
        Elutasítva
      </Button>
    );
  }

  return (
    <LoadingButton isLoading={joinGroup.isPending} onClick={onJoin} variant='outline'>
      <TbUserPlus />
      Csatlakozás
    </LoadingButton>
  );
}

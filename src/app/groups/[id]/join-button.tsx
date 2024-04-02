'use client';

import { Membership } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { TbUserCancel, TbUserExclamation, TbUserMinus, TbUserPlus } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';

interface JoinButtonProps {
  membership: Membership | null;
  groupId: string;
}

export function JoinButton({ membership, groupId }: JoinButtonProps) {
  const router = useRouter();
  const joinGroup = trpc.joinGroup.useMutation();
  const leaveGroup = trpc.leaveGroup.useMutation();

  const isPending = membership?.status === 'Pending';
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
      <Button onClick={onLeave} variant='outline'>
        <TbUserCancel />
        Jelentkezés visszavonása
      </Button>
    );
  }

  if (isMember) {
    return (
      <Button onClick={onLeave} variant='outline'>
        <TbUserMinus />
        Kilépés
      </Button>
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
    <Button onClick={onJoin} variant='outline'>
      <TbUserPlus />
      Csatlakozás
    </Button>
  );
}

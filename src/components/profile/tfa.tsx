'use client';

import { TfaToken } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';

const TfaDialog = dynamic(() => import('./tfa-dialog'), { ssr: false });

interface TfaProps {
  token: TfaToken | undefined | null;
}

export function Tfa({ token }: TfaProps) {
  const router = useRouter();
  const removeTfa = trpc.removeTfa.useMutation();

  const onRemove = async () => {
    await removeTfa.mutateAsync().then(() => {
      router.refresh();
    });
  };

  if (token && token.isEnabled) {
    return (
      <Button onClick={onRemove} variant='outline'>
        TFA kikapcsolása
      </Button>
    );
  }

  return <TfaDialog />;
}

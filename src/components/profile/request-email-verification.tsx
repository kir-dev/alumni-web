'use client';

import { trpc } from '@/_trpc/client';
import { LoadingButton } from '@/components/ui/button';

export function RequestEmailVerification() {
  const requestEmailVerification = trpc.requestEmailVerification.useMutation();
  return (
    <LoadingButton
      isLoading={requestEmailVerification.isPending}
      onClick={() => requestEmailVerification.mutate()}
      variant='destructive'
      className=''
    >
      Megerősítő e-mail küldése
    </LoadingButton>
  );
}

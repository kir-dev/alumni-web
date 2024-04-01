'use client';

import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export function SignOut() {
  return (
    <Button
      onClick={async () => {
        await signOut();
      }}
    >
      Kijelentkezés
    </Button>
  );
}

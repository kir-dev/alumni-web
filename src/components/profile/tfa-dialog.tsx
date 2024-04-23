'use client';

import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

import { trpc } from '@/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

export default function TfaDialog() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const createTfa = trpc.createTfa.useMutation();
  const verifyTfa = trpc.verifyTfa.useMutation();

  const onSubmit = async (token: string) => {
    await verifyTfa.mutateAsync({ token }).then(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    if (token.length === 6) {
      onSubmit(token);
    }
  }, [token]);

  return (
    <Dialog>
      <Button variant='outline' asChild>
        <DialogTrigger>TFA bekapcsolása</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kétlépcsős azonosítás</DialogTitle>
        </DialogHeader>
        <p>
          A kétlépcsős azonosítás bekapcsolásával a fiókodba való belépéshez egy második eszközre lesz szükséged. A
          kódot egyszer tudod megnézni, beállítása az érvényesítés után történik csak meg. A kódot minden
          bejelentkezéskor meg kell adnod. Bejelentkezés után ugyanitt ki tudod kapcsolni ezt a funkciót.
        </p>
        {!createTfa.data && <Button onClick={() => createTfa.mutate()}>Bekapcsolás</Button>}
        {createTfa.data && !isValidating && (
          <>
            <QRCodeSVG value={createTfa.data.url} size={256} />
            <p>Scanneld be a QR kódot az Authenticator alkalmazásban.</p>
            <Button onClick={() => setIsValidating(true)}>Kész!</Button>
          </>
        )}
        {isValidating && (
          <InputOTP
            disabled={verifyTfa.status === 'success'}
            maxLength={6}
            autoFocus
            onChange={(value) => setToken(value)}
            value={token}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        )}
        {verifyTfa.error && <p className='text-red-500'>{verifyTfa.error.message}</p>}
      </DialogContent>
    </Dialog>
  );
}

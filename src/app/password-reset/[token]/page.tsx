import { isAfter } from 'date-fns';

import { NewPasswordForm } from '@/app/password-reset/[token]/new-password-form';
import Providers from '@/components/providers';
import { prismaClient } from '@/config/prisma.config';

export default async function VerifyPage({ params }: { params: { token: string } }) {
  const verificationToken = await prismaClient.verificationToken.findUnique({
    where: {
      token: params.token,
    },
  });

  if (!verificationToken) {
    return (
      <main>
        <h1>Érvénytelen token</h1>
        <p>A megadott token érvénytelen. Kérjük, ellenőrizd a linket, vagy kérj újat!</p>
      </main>
    );
  }

  if (isAfter(new Date(), verificationToken.expires)) {
    return (
      <main>
        <h1>Lejárt token</h1>
        <p>A megadott token lejárt. Kérjük, kérj újat!</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Jelszó visszaállítása</h1>
      <Providers>
        <NewPasswordForm token={params.token} />
      </Providers>
    </main>
  );
}

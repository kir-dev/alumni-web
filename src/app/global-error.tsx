'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { TbMoodConfuzed } from 'react-icons/tb';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className='mx-auto w-fit max-w-full'>
          <TbMoodConfuzed className='w-32 h-32 mx-auto' />
          <h1 className='mx-auto'>Nem várt hiba történt</h1>
          <p className='mx-auto'>A fejlesztők értesítve lettek a hibáról.</p>
        </main>
      </body>
    </html>
  );
}

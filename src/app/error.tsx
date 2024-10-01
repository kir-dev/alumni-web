'use client';

import { TbMoodConfuzed } from 'react-icons/tb';

export default function ErrorPage() {
  return (
    <main className='mx-auto w-fit max-w-full'>
      <TbMoodConfuzed className='w-32 h-32 mx-auto' />
      <h1 className='mx-auto'>Nem várt hiba történt</h1>
      <p className='mx-auto'>Kérjük jelezd a Kir-Dev fejlesztőinek!</p>
    </main>
  );
}

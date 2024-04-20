import { Metadata } from 'next';

import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Kezdőlap'),
  description: 'A Schönherz és a VIK Alumni oldala.',
};

export default function Home() {
  return <main className='flex min-h-screen flex-col items-center justify-between p-24' />;
}

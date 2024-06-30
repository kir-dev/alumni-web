import Image from 'next/image';
import Link from 'next/link';
import { TbHeartFilled } from 'react-icons/tb';

import { Button } from '@/components/ui/button';

const FooterLinks: { label: string; href: string }[] = [
  { label: 'Kezdőlap', href: '/' },
  { label: 'Impresszum', href: '/sites/impresszum' },
  { label: 'Adatvédelem', href: '/sites/adatvedelem' },
  { label: 'Kapcsolat', href: '/sites/kapcsolat' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='bg-slate-900 text-white text-center'>
      <div className='flex justify-between items-center container p-10 flex-col md:flex-row gap-10'>
        <div>
          <div className='flex gap-2 items-center'>
            {FooterLinks.map(({ label, href }) => (
              <Button key={label} className='text-white p-0' variant='link' asChild>
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>
          <hr className='border-slate-500 dark:border-slate-700 rounded-full my-2' />
          <div className='text-slate-500 dark:text-slate-700'>
            Minden jog fenntartva &copy; 2024-{year} Schönherz & VIK Alumni
          </div>
        </div>
        <div>
          <div>
            Készítette <TbHeartFilled className='inline text-red-500' />
            -ből a{' '}
            <a target='_blank' href='https://kir-dev.hu' rel='noreferrer'>
              <Image className='inline' src='/kirdev.svg' alt='Kir-Dev' width={100} height={20} />
            </a>
          </div>
          <a target='_blank' href='https://vercel.com' rel='noreferrer'>
            <Image className='mt-5 inline' src='/vercel.svg' alt='Powered by Vercel' width={200} height={40} />
          </a>
        </div>
      </div>
    </footer>
  );
}

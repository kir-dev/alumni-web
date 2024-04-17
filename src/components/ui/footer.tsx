import Image from 'next/image';
import Link from 'next/link';
import { TbHeartFilled } from 'react-icons/tb';

import { Button } from '@/components/ui/button';

const FooterLinks: { label: string; href: string }[] = [
  { label: 'Kezdőlap', href: '/' },
  { label: 'Impresszum', href: '/impressum' },
  { label: 'Adatvédelem', href: '/privacy' },
  { label: 'Kapcsolat', href: '/contact' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='bg-primary-500 text-white text-center'>
      <div className='flex justify-between items-center container p-10'>
        <div>
          <div className='flex gap-2 items-center'>
            {FooterLinks.map(({ label, href }) => (
              <Button key={label} className='text-white p-0' variant='link' asChild>
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>
          <hr className='border-primary-200 rounded-full my-2' />
          <div className='text-primary-200'>Minden jog fenntartva &copy; 2024-{year} Schönherz & VIK Alumni</div>
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

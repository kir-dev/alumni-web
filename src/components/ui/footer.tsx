import Image from 'next/image';
import Link from 'next/link';
import { TbHeartFilled } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import { prismaClient } from '@/config/prisma.config';
import { SpecialSiteSlugs } from '@/lib/static-site';

interface FooterProps {
  groupId: string | undefined;
}

export async function Footer({ groupId }: FooterProps) {
  const year = new Date().getFullYear();
  const staticSites = await getStaticSites(groupId);

  return (
    <footer className='bg-slate-900 text-white text-center'>
      <div className='flex justify-between items-center container p-10 flex-col md:flex-row gap-10'>
        <div>
          <div className='flex gap-2 items-center flex-wrap'>
            {staticSites.map(({ label, href }) => (
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

async function getStaticSites(groupId: string | undefined): Promise<{ label: string; href: string }[]> {
  const baseLinks = [
    {
      label: 'Kezdőlap',
      href: '/',
    },
  ];

  const staticSites = await prismaClient.staticSite.findMany({
    where: {
      groupId: groupId ?? null,
    },
  });

  const prefix = groupId ? `/groups/${groupId}` : '';

  return [
    ...baseLinks,
    ...SpecialSiteSlugs.filter((link) => staticSites.some((site) => site.url === link.href)).map((link) => ({
      label: link.label,
      href: `${prefix}/sites/${link.href}`,
    })),
  ];
}

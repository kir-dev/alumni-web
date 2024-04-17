'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export function Navbar({ isLoggedIn, isAdmin }: NavbarProps) {
  const [onTop, setOnTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setOnTop(false);
      } else {
        setOnTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn('sticky top-0 transition-colors', {
        'border-b bg-white shadow-sm': !onTop,
      })}
    >
      <div className='flex justify-between items-center container px-10 py-5'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/icon.png' alt='Sch' width={100} height={100} className='h-10 w-10' />
          <div className='text-xl text-primary-500'>Villanykari Alumni</div>
        </Link>
        <div className='flex'>
          <Button variant='link' asChild>
            <Link href='/groups'>Csoportok</Link>
          </Button>
          {isLoggedIn && isAdmin && (
            <Button variant='link' asChild>
              <Link href='/sites'>Statikus oldalak</Link>
            </Button>
          )}
          {isLoggedIn ? (
            <Button variant='link' asChild>
              <Link href='/profile'>Profil</Link>
            </Button>
          ) : (
            <Button variant='link' asChild>
              <Link href='/login'>Bejelentkezés</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

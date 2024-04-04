'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
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
      className={cn('flex justify-between items-center px-10 py-5 container sticky top-0 transition-colors', {
        'border-b bg-white shadow-sm': !onTop,
      })}
    >
      <div>VAIR</div>
      <div className='flex'>
        <Button variant='link' asChild>
          <Link href='/groups'>Csoportok</Link>
        </Button>
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
    </nav>
  );
}
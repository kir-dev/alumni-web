'use client';

import { Group } from '@prisma/client';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import { PropsWithChildren, useEffect, useState } from 'react';
import { TbChevronDown, TbMenu } from 'react-icons/tb';

import { Icon } from '@/components/icon/icon';
import { ColorModeSelector } from '@/components/navbar/color-mode-selector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, generateGlobalThemePalette } from '@/lib/utils';

interface NavbarProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  group?: Group;
}

export function Navbar({ isLoggedIn, isAdmin, group }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [onTop, setOnTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setOnTop(false);
      } else {
        setOnTop(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn('sticky top-0 z-10 transition-colors', {
        'border-b bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950 dark:border-0': !onTop,
      })}
    >
      {group?.color && <style>{generateGlobalThemePalette(group.color)}</style>}

      <div className='flex justify-between items-center container px-10 py-5'>
        <Link href='/' className='flex items-center gap-2'>
          {group?.icon ? (
            <Image
              src={group.icon}
              alt='Icon'
              width={100}
              height={100}
              className='w-8 h-8 object-contain object-center'
            />
          ) : (
            <Icon className='w-8 h-8' />
          )}
          <div className='text-xl text-primary-500 dark:text-primary-300'>{group?.name ?? 'Schönherz'} Alumni</div>
        </Link>
        <div className='flex z-10'>
          <div className='hidden md:flex'>
            {isLoggedIn && (
              <Button variant='link' asChild>
                <Link href='/feed'>Hírfolyam</Link>
              </Button>
            )}
            <Button variant='link' asChild>
              <Link href='/groups'>Csoportok</Link>
            </Button>
            {isLoggedIn && isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='link'>
                    Admin <TbChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href='/sites'>Statikus oldalak</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/admin/users'>Felhasználók</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/admin/uploads'>Feltöltések</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/admin/domains'>Domének</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/admin/logs'>Audit napló</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          <ColorModeSelector />
          <Button
            size='icon'
            variant='outline'
            className='ml-2 md:hidden'
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label='Menü'
          >
            <TbMenu />
          </Button>
        </div>
      </div>
      <div
        className={cn('md:hidden px-10', {
          hidden: !menuOpen,
        })}
      >
        {isLoggedIn && <MobileNavItem href='/feed'>Hírfolyam</MobileNavItem>}
        <MobileNavItem href='/groups'>Csoportok</MobileNavItem>
        {isLoggedIn && isAdmin && <MobileNavItem href='/sites'>Statikus oldalak</MobileNavItem>}
        {isLoggedIn ? (
          <MobileNavItem href='/profile'>Profil</MobileNavItem>
        ) : (
          <MobileNavItem href='/login'>Bejelentkezés</MobileNavItem>
        )}
      </div>
    </nav>
  );
}

interface MobileNavItemProps extends LinkProps, PropsWithChildren {
  className?: string;
}

function MobileNavItem({ className, ...props }: MobileNavItemProps) {
  return <Link className={cn('py-2 block border-t', className)} {...props} />;
}

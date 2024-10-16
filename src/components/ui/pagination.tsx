import * as React from 'react';
import { ComponentProps } from 'react';
import { TbChevronLeft, TbChevronRight, TbDots } from 'react-icons/tb';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

type PaginationLinkProps = {
  isActive?: boolean;
} & ButtonProps;

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    variant={isActive ? 'outline' : 'ghost'}
    className={cn('text-primary-500 dark:text-slate-50', className)}
    size={size}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, ...props }: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to previous page' size='default' className={cn('gap-1 pl-2.5', className)} {...props}>
    <TbChevronLeft className='h-4 w-4' />
    <span>Előző</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to next page' size='default' className={cn('gap-1 pr-2.5', className)} {...props}>
    <span>Következő</span>
    <TbChevronRight className='h-4 w-4' />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: ComponentProps<'span'>) => (
  <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <TbDots className='h-4 w-4' />
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export { Pagination, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious };

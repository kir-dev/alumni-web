import { Prisma } from '@prisma/client';
import { PropsWithChildren } from 'react';
import { TbArrowsSort, TbSortAscendingLetters, TbSortDescendingLetters } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import SortOrder = Prisma.SortOrder;

interface SortableTableHeaderProps extends PropsWithChildren {
  column: string;
  sortDirection: SortOrder | undefined;
  onSort: (sortOrder: SortOrder) => void;
}

export function SortableTableHead({ children, sortDirection, onSort }: SortableTableHeaderProps) {
  return (
    <TableHead className='group/item'>
      {children}
      <Button
        variant='outline'
        size='icon'
        className={cn('group-hover/item:opacity-100 ml-2', {
          'opacity-0': !sortDirection,
        })}
        onClick={() => onSort(sortDirection === 'asc' ? 'desc' : 'asc')}
      >
        {!sortDirection && <TbArrowsSort className='text-current' />}
        {sortDirection === 'asc' && <TbSortAscendingLetters />}
        {sortDirection === 'desc' && <TbSortDescendingLetters />}
      </Button>
    </TableHead>
  );
}

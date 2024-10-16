import { Fragment } from 'react';

import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';

interface PaginatorProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Paginator({ currentPage, totalCount, pageSize, onPageChange }: PaginatorProps) {
  const pagination = usePagination({
    pageSize,
    totalCount,
    currentPage,
    onPageChange,
  });

  const onPrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const onNext = () => {
    onPageChange(Math.min(pagination.maxPage, currentPage + 1));
  };

  return (
    <Pagination className='mt-5'>
      <PaginationPrevious onClick={onPrevious} disabled={currentPage === 1} />
      {pagination.items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          {typeof item.value === 'number' ? (
            <PaginationLink isActive={item.active} onClick={item.action}>
              {item.value}
            </PaginationLink>
          ) : (
            <PaginationEllipsis>{item.value}</PaginationEllipsis>
          )}
        </Fragment>
      ))}
      <PaginationNext onClick={onNext} disabled={currentPage === pagination.maxPage} />
    </Pagination>
  );
}

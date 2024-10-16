import { useMemo } from 'react';

type PaginationProps = {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
};

type ItemInfo = {
  value: number | string;
  active?: boolean;
  disabled?: boolean;
  action?: () => void;
};

export const usePagination = (props: PaginationProps) => {
  const { onPageChange, totalCount, currentPage, pageSize } = props;

  const maxPage = Math.max(1, Math.ceil(totalCount / pageSize));

  const items = useMemo(() => {
    const itemsToReturn: ItemInfo[] = [{ value: 1, action: () => onPageChange(1), active: currentPage === 1 }];
    if (currentPage >= 4) {
      itemsToReturn.push({ value: '...', disabled: true });
    }

    [-1, 0, 1].forEach((index) => {
      if (currentPage + index > 1 && currentPage + index < maxPage) {
        itemsToReturn.push({
          value: currentPage + index,
          action: () => onPageChange(currentPage + index),
          active: currentPage === currentPage + index,
        });
      }
    });

    if (currentPage <= maxPage - 3) {
      itemsToReturn.push({ value: '...', disabled: true });
    }

    if (maxPage > 1) {
      itemsToReturn.push({ value: maxPage, action: () => onPageChange(maxPage), active: currentPage === maxPage });
    }
    return itemsToReturn;
  }, [currentPage, maxPage, onPageChange]);

  return {
    items,
  };
};

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
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props;

  const maxPage = Math.max(1, Math.ceil(totalCount / pageSize));

  const items = useMemo(() => {
    const itemsToReturn: ItemInfo[] = [{ value: currentPage, active: true }];
    for (let i = 1; i <= siblingCount; i++) {
      if (currentPage - i >= 1) {
        itemsToReturn.unshift({
          value: currentPage - i,
          action: () => onPageChange(currentPage - i),
        });
      }
      if (currentPage + i <= maxPage) {
        itemsToReturn.push({
          value: currentPage + i,
          action: () => onPageChange(currentPage + i),
        });
      }
    }
    if (Number(itemsToReturn[0].value) > 2) {
      itemsToReturn.unshift({ value: '...', disabled: true });
    }

    if (Number(itemsToReturn[0].value) > 1) {
      itemsToReturn.unshift({ value: 1, action: () => onPageChange(1) });
    }

    if (Number(itemsToReturn[itemsToReturn.length - 1].value) < maxPage - 1) {
      itemsToReturn.push({ value: '...', disabled: true });
    }

    if (Number(itemsToReturn[itemsToReturn.length - 1].value) < maxPage) {
      itemsToReturn.push({ value: maxPage, action: () => onPageChange(maxPage) });
    }
    return itemsToReturn;
  }, [currentPage, maxPage, onPageChange, siblingCount]);

  return {
    items,
  };
};

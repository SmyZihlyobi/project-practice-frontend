'use client';

import { useEffect } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { observer } from 'mobx-react-lite';

import { PAGE_SIZE_STORAGE_KEY } from '../lib/constant';
import { useTeamStore } from '../store';

export const TeamsPagination = observer(() => {
  const {
    currentTeamPageIndex,
    currentTeamsPagesCount,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useTeamStore;

  useEffect(() => {
    const savedPageSize = localStorage.getItem(PAGE_SIZE_STORAGE_KEY);
    if (savedPageSize) {
      const size = savedPageSize === 'Infinity' ? Infinity : Number(savedPageSize);
      setPageSize(size);
    }
  }, [setPageSize]);

  const handlePageSizeChange = (value: string) => {
    const size = value === 'Infinity' ? Infinity : Number(value);
    setPageSize(size);
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, value);
  };

  if (currentTeamsPagesCount < 1) {
    return <p className="text-center">Слишком мало команд</p>;
  }

  const getVisiblePages = () => {
    if (pageSize === Infinity) return [];

    if (currentTeamsPagesCount <= 7) {
      return Array.from({ length: currentTeamsPagesCount }, (_, i) => i + 1);
    }

    const pages = [1, currentTeamsPagesCount];
    const pagesToAdd = [
      currentTeamPageIndex - 2,
      currentTeamPageIndex - 1,
      currentTeamPageIndex,
      currentTeamPageIndex + 1,
      currentTeamPageIndex + 2,
    ].filter(p => p > 1 && p < currentTeamsPagesCount);

    pages.push(...pagesToAdd);
    const sortedPages = [...new Set(pages)].sort((a, b) => a - b);

    const result = [];
    for (let i = 0; i < sortedPages.length; i++) {
      result.push(sortedPages[i]);
      if (i < sortedPages.length - 1 && sortedPages[i + 1] - sortedPages[i] > 1) {
        result.push('ellipsis' + i);
      }
    }

    return result;
  };

  const visiblePages = getVisiblePages();
  const isInfiniteMode = pageSize === Infinity;
  const selectValue = isInfiniteMode ? 'Infinity' : pageSize.toString();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= currentTeamsPagesCount) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 ml-2 py-4 overflow-hidden">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Число команд</p>
        <Select value={selectValue} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={selectValue} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="Infinity">Все</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isInfiniteMode && (
        <>
          <Pagination className="flex justify-center lg:mr-11">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentTeamPageIndex - 1)}
                  className={
                    currentTeamPageIndex === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {visiblePages.map(page => {
                if (typeof page === 'string' && page.includes('ellipsis')) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentTeamPageIndex}
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentTeamPageIndex + 1)}
                  className={
                    currentTeamPageIndex === currentTeamsPagesCount
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-sm text-muted-foreground">
            Страница {currentTeamPageIndex} из {currentTeamsPagesCount}
          </div>
        </>
      )}
    </div>
  );
});

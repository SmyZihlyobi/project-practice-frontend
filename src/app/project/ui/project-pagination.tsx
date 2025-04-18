'use client';

import React, { useEffect } from 'react';

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

import { PAGE_SIZE_STORAGE_KEY } from '../lib/const';
import { useProjectStore } from '../store/project-store';

export const ProjectPagination = observer(() => {
  const projectStore = useProjectStore;

  useEffect(() => {
    const savedSize = localStorage.getItem('projectPageSize');
    if (savedSize) {
      const size = savedSize === 'infinity' ? Infinity : Number(savedSize);
      projectStore.setPageSize(size);
    }
  }, [projectStore]);

  const getVisiblePages = () => {
    if (projectStore.pageSize === Infinity) return [];

    const totalPages = projectStore.totalPages;
    const currentPage = projectStore.currentPage;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1, totalPages];

    const pagesToAdd = [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ].filter(p => p > 1 && p < totalPages);

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

  useEffect(() => {
    const value =
      projectStore.pageSize === Infinity ? 'infinity' : projectStore.pageSize.toString();
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, value);
  }, [projectStore.pageSize]);

  const visiblePages = getVisiblePages();

  const getDisplayValue = () => {
    return projectStore.pageSize === Infinity ? 'Все' : projectStore.pageSize.toString();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 ml-2 py-4 overflow-hidden">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Число проектов</p>
        <Select
          value={
            projectStore.pageSize === Infinity
              ? 'infinity'
              : projectStore.pageSize.toString()
          }
          onValueChange={value => {
            const size = value === 'infinity' ? Infinity : Number(value);
            projectStore.setPageSize(size);
          }}
        >
          <SelectTrigger className="h-8 w-[100px]">
            <SelectValue placeholder={getDisplayValue()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="infinity">Все</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {projectStore.pageSize !== Infinity && (
        <>
          <Pagination className="flex justify-center lg:mr-11">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => projectStore.prevPage()}
                  className={
                    projectStore.currentPage === 1
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
                      isActive={page === projectStore.currentPage}
                      onClick={() => projectStore.goToPage(page as number)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => projectStore.nextPage()}
                  className={
                    projectStore.currentPage === projectStore.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-sm text-muted-foreground">
            Страница {projectStore.currentPage} из {projectStore.totalPages}
          </div>
        </>
      )}
    </div>
  );
});

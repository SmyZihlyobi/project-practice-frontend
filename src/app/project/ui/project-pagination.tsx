import React from 'react';
import { observer } from 'mobx-react-lite';
import { useProjectStore } from '../store/project-store';
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

export const ProjectPagination = observer(() => {
  const projectStore = useProjectStore;

  const getVisiblePages = () => {
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

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 ml-2 py-4 overflow-hidden">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Число проектов</p>
        <Select
          value={projectStore.pageSize.toString()}
          onValueChange={value => projectStore.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={projectStore.pageSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
});

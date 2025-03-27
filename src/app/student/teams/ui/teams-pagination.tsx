'use client';

import { observer } from 'mobx-react-lite';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { MAX_VISIBLE_PAGINATION } from '../lib/constant';
import { useTeamStore } from '../store';

export const TeamsPagination = observer(() => {
  const { currentTeamPageIndex, currentTeamsPagesCount, setCurrentPage } = useTeamStore;

  if (currentTeamsPagesCount < 1) {
    return <p className="text-center">Слишком мало команд</p>;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= currentTeamsPagesCount) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    let startPage = Math.max(
      1,
      currentTeamPageIndex - Math.floor(MAX_VISIBLE_PAGINATION / 2),
    );
    const endPage = Math.min(
      currentTeamsPagesCount,
      startPage + MAX_VISIBLE_PAGINATION - 1,
    );

    if (endPage - startPage + 1 < MAX_VISIBLE_PAGINATION) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGINATION + 1);
    }

    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={() => handlePageChange(currentTeamPageIndex - 1)}
        />
      </PaginationItem>,
    );

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(i)}
            isActive={i === currentTeamPageIndex}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < currentTeamsPagesCount) {
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={() => handlePageChange(currentTeamPageIndex + 1)}
        />
      </PaginationItem>,
    );

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>{renderPaginationItems()}</PaginationContent>
    </Pagination>
  );
});

'use client';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { SEARCH_DELAY } from '@/app/student/teams/lib/constant';
import { useProjectStore } from '@/store';

export const Search = observer(() => {
  const projectStore = useProjectStore;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        projectStore.findByName(value);
      }, SEARCH_DELAY),
    [projectStore],
  );

  const handleSearch = useCallback(
    (value: string) => {
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  return (
    <Input
      placeholder="Найти проект"
      className="mb-2"
      onChange={e => handleSearch(e.target.value)}
    />
  );
});

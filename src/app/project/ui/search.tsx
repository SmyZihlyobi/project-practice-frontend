'use client';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { useProjectStore } from '../store/project-store';
import { useCallback, useMemo } from 'react';
import { SEARCH_DELAY } from '@/app/student/teams/lib/constant';

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
    <Input placeholder="Найти проект" onChange={e => handleSearch(e.target.value)} />
  );
});

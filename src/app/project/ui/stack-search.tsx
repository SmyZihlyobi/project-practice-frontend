'use client';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { SEARCH_DELAY } from '@/app/student/teams/lib/constant';
import { useProjectStore } from '@/store';

export const StackSearch = observer(() => {
  const projectStore = useProjectStore;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        projectStore.findByStackItemName(value);
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
      className="my-2 border-0 bg-black text-white dark:bg-white dark:text-black dark:!placeholder-black !placeholder-white"
      placeholder="Поиск по стеку"
      onChange={e => handleSearch(e.target.value)}
    />
  );
});

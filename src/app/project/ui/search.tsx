'use client';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { useProjectStore } from '../store/project-store';
import { useCallback } from 'react';
import { SEARCH_DELAY } from '@/app/student/teams/lib/constant';

export const Search = observer(() => {
  const projectStore = useProjectStore;

  const handleSearch = useCallback(
    debounce((value: string) => {
      projectStore.findByName(value);
    }, SEARCH_DELAY),
    [projectStore],
  );

  return (
    <Input placeholder="Найти проект" onChange={e => handleSearch(e.target.value)} />
  );
});

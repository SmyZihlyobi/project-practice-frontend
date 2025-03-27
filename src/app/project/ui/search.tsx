'use client';

import { useCallback } from 'react';

import { observer } from 'mobx-react-lite';

import { debounce } from '@/lib/utils';

import { Input } from '@/components/ui/input';

import { SEARCH_DELAY } from '@/app/student/teams/lib/constant';

import { useProjectStore } from '../store/project-store';

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

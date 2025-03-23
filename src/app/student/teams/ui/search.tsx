'use client';

import { useCallback, useMemo } from 'react';

import { observer } from 'mobx-react-lite';

import { debounce } from '@/lib/utils';

import { Input } from '@/components/ui/input';

import { SEARCH_DELAY } from '../lib/constant';
import { useTeamStore } from '../store';

export const Search = observer(() => {
  const teamStore = useTeamStore;

  const debouncedFindByName = useMemo(
    () => debounce((value: string) => teamStore.findByName(value), SEARCH_DELAY),
    [teamStore],
  );

  const handleSearch = useCallback(
    (value: string) => debouncedFindByName(value),
    [debouncedFindByName],
  );

  return (
    <Input
      className="mb-4"
      placeholder="Найти команду"
      onChange={e => handleSearch(e.target.value)}
    />
  );
});

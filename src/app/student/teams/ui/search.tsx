'use client';

import { useCallback, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';

import { SEARCH_DELAY } from '../lib/constant';
import { useTeamStore } from '../store/team-store';

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

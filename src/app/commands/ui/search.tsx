'use client';

import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { useTeamStore } from '../store/team-store';
import { useCallback } from 'react';
import { SEARCH_DELAY } from '../lib/constant';

export const Search = observer(() => {
  const teamStore = useTeamStore;

  const handleSearch = useCallback(
    debounce((value: string) => {
      teamStore.findByName(value);
    }, SEARCH_DELAY),
    [teamStore],
  );

  return (
    <Input
      className="mb-4"
      placeholder="Найти команду"
      onChange={e => handleSearch(e.target.value)}
    />
  );
});

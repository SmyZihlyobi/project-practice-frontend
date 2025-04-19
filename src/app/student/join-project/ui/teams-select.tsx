'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useTeamsStore } from '@/store';

export const TeamsSelect = (props: React.ComponentProps<typeof Select>) => {
  const teamStore = useTeamsStore;
  const { fetchTeams, getTeams, getUndecidedTeamId, getIsCachedLoaded } = teamStore;

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const teams = getTeams();
  const isCachedLoaded = getIsCachedLoaded();

  if (teams.length < 1) {
    teams.push({
      id: getUndecidedTeamId(),
      name: 'Не выбрана',
      students: [],
    });
  }
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Выбери команду" />
      </SelectTrigger>
      <SelectContent>
        {isCachedLoaded ? (
          <SelectItem value="loading" disabled>
            <Skeleton className="h-4 w-full" />
          </SelectItem>
        ) : (
          teams.map(team => (
            <SelectItem key={team.name} value={team.name}>
              {team.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

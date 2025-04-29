'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

import { useTeamsStore } from '@/store';
import { observer } from 'mobx-react-lite';

export const TeamsSelect = observer((props: React.ComponentProps<typeof Select>) => {
  const teamStore = useTeamsStore;
  const { fetchTeams, getTeams, getUndecidedTeamId } = teamStore;

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const teams = getTeams();

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
        {teams.map(team => (
          <SelectItem key={team.name} value={team.name}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

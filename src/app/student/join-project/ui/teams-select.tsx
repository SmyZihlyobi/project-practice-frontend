'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_TEAMS } from '../api/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Team } from '../api/dto/teams';

export const TeamsSelect = (props: React.ComponentProps<typeof Select>) => {
  const {
    data,
    loading,
    error,
    refetch: getTeams,
  } = useQuery<{ teams: Team[] }>(GET_TEAMS);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Выбери команду" />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>
            <Skeleton className="h-4 w-full" />
          </SelectItem>
        ) : (
          data?.teams.map(team => (
            <SelectItem key={team.name} value={team.name}>
              {team.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

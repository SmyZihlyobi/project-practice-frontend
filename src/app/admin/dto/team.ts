import { ApolloQueryResult } from '@apollo/client';
import { Student } from './student';

export interface Team {
  id: string;
  name: string;
  students: Student[];
}

interface GetTeamsData {
  teams: Team[];
}

interface GetTeamData {
  team: Team;
}

export type GetTeamResponse = ApolloQueryResult<GetTeamData>;
export type GetTeamsResponse = ApolloQueryResult<GetTeamsData>;

import { ApolloQueryResult } from '@apollo/client';

export interface Team {
  name: string;
}

interface GetTeamsData {
  teams: Team[];
}

export type GetTeamsResponse = ApolloQueryResult<GetTeamsData>;

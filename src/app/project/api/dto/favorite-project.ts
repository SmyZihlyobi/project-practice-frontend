import { ApolloQueryResult } from '@apollo/client';

export interface FavoriteProject {
  projectId: string;
}

interface FavoriteProjectQueryResponse {
  favoriteProjects: FavoriteProject[];
}

export type GetFavoriteProjectResponse = ApolloQueryResult<FavoriteProjectQueryResponse>;

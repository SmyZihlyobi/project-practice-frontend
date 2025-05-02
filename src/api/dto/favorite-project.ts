import { ApolloQueryResult } from '@apollo/client';

export interface FavoriteProject {
  projectId: string;
  studentId: string;
}

interface FavoriteProjectQueryResponse {
  favoriteProjects: FavoriteProject[];
}

export type GetFavoriteProjectResponse = ApolloQueryResult<FavoriteProjectQueryResponse>;

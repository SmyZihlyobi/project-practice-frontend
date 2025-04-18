import { gql } from '@apollo/client';

export const GET_FAVORITE_PROJECT_QUERY = gql`
  query FavoriteProjects($id: ID!) {
    favoriteProjects(id: $id) {
      projectId
    }
  }
`;

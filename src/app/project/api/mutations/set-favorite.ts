import { gql } from '@apollo/client';

export const SER_FAVORITE_MUTATION = gql`
  mutation addFavoriteProject($input: FavoriteProjectInput!) {
    addFavoriteProject(input: $input) {
      projectId
    }
  }
`;

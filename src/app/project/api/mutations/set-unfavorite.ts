import { gql } from '@apollo/client';

export const SER_UNFAVORITE_MUTATION = gql`
  mutation RemoveFavoriteProject($studentId: ID!, $projectId: ID!) {
    removeFavoriteProject(studentId: $studentId, projectId: $projectId) {
      projectId
    }
  }
`;

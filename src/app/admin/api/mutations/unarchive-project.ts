import { gql } from '@apollo/client';

export const UNARCHIVE_PROJECT_MUTATION = gql`
  mutation UnarchiveProject($id: ID!) {
    unarchiveProject(id: $id)
  }
`;

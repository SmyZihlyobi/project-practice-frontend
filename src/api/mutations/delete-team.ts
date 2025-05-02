import { gql } from '@apollo/client';

export const DELETE_TEAM_MUTATION = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;

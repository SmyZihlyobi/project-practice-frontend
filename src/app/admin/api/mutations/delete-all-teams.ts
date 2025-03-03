import { gql } from '@apollo/client';

export const DELETE_ALL_TEAMS_MUTATION = gql`
  mutation deleteAllTeams {
    deleteAllTeams
  }
`;

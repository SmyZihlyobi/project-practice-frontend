import { gql } from '@apollo/client';

export const GET_TEAMS_QUERY = gql`
  query getTeams {
    teams {
      id
      name
      students {
        id
        year
      }
    }
  }
`;

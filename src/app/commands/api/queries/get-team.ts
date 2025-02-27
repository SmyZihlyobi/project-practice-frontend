import { gql } from '@apollo/client';

export const GET_TEAM_QUERY = gql`
  query getTeam($id: ID!) {
    team(id: $id) {
      name
      students {
        firstName
        id
        lastName
        resumeLink
        patronymic
        resumePdf
        telegram
        year
      }
    }
  }
`;

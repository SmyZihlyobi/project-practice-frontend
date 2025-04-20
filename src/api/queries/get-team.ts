import { gql } from '@apollo/client';

export const GET_TEAM_QUERY = gql`
  query getTeam($id: ID!) {
    team(id: $id) {
      id
      students {
        firstName
        firstPriority
        groupId
        id
        lastName
        otherPriorities
        patronymic
        secondPriority
        thirdPriority
        resumeLink
        telegram
        year
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
  mutation MyMutation(
    $team_name: String!
    $group_id: String!
    $year: Int!
    $lastName: String!
    $firstName: String!
    $patronymic: String!
    $firstPriority: Int!
    $secondPriority: Int!
    $thirdPriority: Int!
    $resumeLink: String!
    $resumePdf: String!
    $telegram: String!
    $otherPriorities: String!
  ) {
    createStudent(
      input: {
        teamName: $team_name
        groupId: $group_id
        year: $year
        lastName: $lastName
        firstName: $firstName
        patronymic: $patronymic
        firstPriority: $firstPriority
        secondPriority: $secondPriority
        thirdPriority: $thirdPriority
        resumeLink: $resumeLink
        resumePdf: $resumePdf
        telegram: $telegram
        otherPriorities: $otherPriorities
      }
    ) {
      id
    }
  }
`;

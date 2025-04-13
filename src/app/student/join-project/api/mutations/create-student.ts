import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
  mutation createStudent(
    $teamName: String
    $groupId: String!
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
    $username: String!
  ) {
    createStudent(
      input: {
        teamName: $teamName
        groupId: $groupId
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
        username: $username
      }
    ) {
      id
    }
  }
`;

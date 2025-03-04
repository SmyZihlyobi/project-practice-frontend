import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation createStudent(
    $name: String!
    $description: String!
    $stack: String!
    $teamsAmount: Int!
    $studentProject: Boolean!
  ) {
    createProject(
      input: {
        name: $name
        description: $description
        stack: $stack
        teamsAmount: $teamsAmount
        studentProject: $studentProject
      }
    ) {
      id
    }
  }
`;

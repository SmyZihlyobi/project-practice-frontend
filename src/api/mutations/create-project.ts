import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation createStudent(
    $name: String!
    $description: String!
    $stack: String!
    $teamsAmount: Int!
    $studentProject: Boolean!
    $direction: String
    $requiredRoles: String
  ) {
    createProject(
      input: {
        name: $name
        description: $description
        stack: $stack
        teamsAmount: $teamsAmount
        studentProject: $studentProject
        direction: $direction
        requiredRoles: $requiredRoles
      }
    ) {
      description
      name
      presentation
      stack
      studentProject
      teamsAmount
      technicalSpecifications
      active
      id
      companyName
      direction
      requiredRoles
    }
  }
`;

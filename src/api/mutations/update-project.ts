import { gql } from '@apollo/client';

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String!
    $description: String!
    $stack: String!
    $teamsAmount: Int!
    $studentProject: Boolean!
    $direction: String!
    $requiredRoles: String!
  ) {
    updateProject(
      id: $id
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
      id
      name
      description
      stack
      teamsAmount
      studentProject
      direction
      requiredRoles
    }
  }
`;

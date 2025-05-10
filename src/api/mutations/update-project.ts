import { gql } from '@apollo/client';
export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      stack
      teamsAmount
      studentProject
      presentation
      direction
      requiredRoles
      technicalSpecifications
      active
    }
  }
`;

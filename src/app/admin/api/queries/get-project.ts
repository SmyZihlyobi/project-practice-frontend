import { gql } from '@apollo/client';

export const GET_PROJECT_QUERY = gql`
  query getProject($id: ID!) {
    project(id: $id) {
      id
      name
      studentProject
      presentation
      stack
      teamsAmount
      technicalSpecifications
      description
    }
  }
`;

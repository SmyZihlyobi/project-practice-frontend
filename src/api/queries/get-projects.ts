import { gql } from '@apollo/client';

export const GET_PROJECTS_QUERY = gql`
  query GetProjectsQuery {
    projects {
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
    }
  }
`;

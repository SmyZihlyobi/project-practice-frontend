import { gql } from '@apollo/client';

export const GET_PROJECTS_QUERY = gql`
  query getProjects {
    projects {
      id
      name
      studentProject
    }
  }
`;

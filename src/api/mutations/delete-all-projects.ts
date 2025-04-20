import { gql } from '@apollo/client';

export const DELETE_ALL_PROJECTS_MUTATION = gql`
  mutation deleteAllProjects {
    deleteAllProjects
  }
`;

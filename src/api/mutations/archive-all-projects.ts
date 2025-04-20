import { gql } from '@apollo/client';

export const ARCHIVE_ALL_PROJECTS_MUTATION = gql`
  mutation VenomMutation {
    archiveAllProjects
  }
`;

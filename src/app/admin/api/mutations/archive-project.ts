import { gql } from '@apollo/client';

export const ARCHIVE_PROJECT_MUTATION = gql`
  mutation ArchiveProject($id: ID!) {
    archiveProject(id: $id)
  }
`;

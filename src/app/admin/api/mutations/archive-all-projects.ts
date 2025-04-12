import { gql } from '@apollo/client';

export const VENOM_MUTATION = gql`
  mutation VenomMutation {
    archiveAllProjects
  }
`;

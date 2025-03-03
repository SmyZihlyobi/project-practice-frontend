import { gql } from '@apollo/client';

export const DELETE_ALL_COMPANIES_MUTATION = gql`
  mutation deleteAllCompanies {
    deleteAllCompanies
  }
`;

import { gql } from '@apollo/client';

export const DELETE_COMPANY_MUTATION = gql`
  mutation deleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`;

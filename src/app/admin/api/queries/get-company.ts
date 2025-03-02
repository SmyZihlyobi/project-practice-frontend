import { gql } from '@apollo/client';

export const GET_COMPANY_QUERY = gql`
  query getCompany($id: ID!) {
    company(id: $id) {
      contacts
      name
      id
      representative
      studentCompany
    }
  }
`;

import { gql } from '@apollo/client';

export const GET_COMPANY_QUERY = gql`
  query getCompany($id: ID!) {
    company(id: $id) {
      email
      contacts
      name
      id
      representative
      studentCompany
    }
  }
`;

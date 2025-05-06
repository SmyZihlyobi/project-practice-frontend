import { gql } from '@apollo/client';
export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($id: ID!, $input: CompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      representative
      website
      contacts
      studentCompany
    }
  }
`;

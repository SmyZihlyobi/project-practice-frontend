import { gql } from '@apollo/client';

export const CREATE_COMPANY_MUTATION = gql`
  mutation createCompany(
    $name: String!
    $representative: String!
    $email: String!
    $contacts: String!
    $studentProject: Boolean!
    $website: String
  ) {
    createCompany(
      input: {
        name: $name
        representative: $representative
        email: $email
        contacts: $contacts
        studentCompany: $studentProject
        website: $website
      }
    ) {
      id
    }
  }
`;

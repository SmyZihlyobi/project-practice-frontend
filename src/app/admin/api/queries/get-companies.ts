import { gql } from '@apollo/client';

export const GET_COMPANIES_QUERY = gql`
  query getCompanies {
    unapprovedCompanies {
      id
      name
    }
    companies {
      id
      name
    }
  }
`;

import { gql } from '@apollo/client';
export const GET_COMPANY_PROJECTS_QUERY = gql`
  query GetCompanyProjects($id: ID!) {
    company(id: $id) {
      name
      projects {
        id
        name
        teamsAmount
        direction
        companyLink
        description
        stack
        companyName
        requiredRoles
        presentation
        technicalSpecifications
        studentProject
        active
      }
    }
  }
`;

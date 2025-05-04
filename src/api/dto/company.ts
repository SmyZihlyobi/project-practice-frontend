import { ApolloQueryResult } from '@apollo/client';

export interface Company {
  id: string;
  name: string;
  representative?: string;
  studentCompany?: string;
  contacts?: string;
  isApproved?: boolean;
  website?: string;
}

export interface GetCompany {
  company: Company;
}

export interface CompanyInput {
  name: string;
  representative: string;
  website?: string;
  contacts: string;
  studentCompany: boolean;
}

export interface UpdateCompanyResponse {
  updateCompany: Company;
}

export interface GetCompanies {
  unapprovedCompanies: Company[];
  companies: Company[];
}

export type GetCompanyResponse = ApolloQueryResult<GetCompany>;
export type GetCompaniesResponse = ApolloQueryResult<GetCompanies>;

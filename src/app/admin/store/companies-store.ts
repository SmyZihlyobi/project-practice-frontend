import { makeAutoObservable } from 'mobx';
import { Company, GetCompaniesResponse, GetCompanyResponse } from '../dto';
import { apolloClient } from '@/lib';
import { GET_COMPANIES_QUERY, GET_COMPANY_QUERY } from '../api/queries';

export class CompaniesStore {
  public companies: Company[] = [];
  public isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getCompanies(): Promise<void> {
    try {
      this.isLoading = true;
      const response: GetCompaniesResponse = await apolloClient.query({
        query: GET_COMPANIES_QUERY,
      });

      this.companies = [...response.data.unapprovedCompanies, ...response.data.companies];
    } catch (error) {
      console.error('ERROR while getting companies', error);
    } finally {
      this.isLoading = false;
    }
  }

  async getCompany(id: string): Promise<void> {
    try {
      this.isLoading = true;

      const companyIndex = this.companies.findIndex(company => company.id === id);

      if (companyIndex === -1) {
        throw new Error('Company not found');
      }

      const response: GetCompanyResponse = await apolloClient.query({
        query: GET_COMPANY_QUERY,
        variables: { id },
      });

      this.companies[companyIndex] = response.data.company;
    } catch (error) {
      console.error('ERROR while getting company', error);
    } finally {
      this.isLoading = false;
    }
  }
}

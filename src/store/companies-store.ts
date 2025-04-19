import { makeAutoObservable, toJS, reaction } from 'mobx';
import { Company, GetCompaniesResponse, GetCompanyResponse } from '@/api/dto';
import { apolloClient } from '@/lib/Apollo';
import { axiosInstance } from '@/lib/axios';
import { GET_COMPANIES_QUERY, GET_COMPANY_QUERY } from '@/api/queries';
import { toast } from 'sonner';
import { DELETE_ALL_COMPANIES_MUTATION, DELETE_COMPANY_MUTATION } from '@/api/mutations';
import { isAxiosError } from 'axios';
import { isApolloError } from '@apollo/client';
import { APPROVE_API } from '@/lib/constant';
import { IndexedDBService } from '@/lib/index-db/index-db-service';

export class CompaniesStore {
  private companies: Company[] = [];
  public isLoading: boolean = false;
  private currentAdminId: string = '1';
  private isCacheLoaded: boolean = false;
  private dbService: IndexedDBService | null;
  private isCompaniesFetched: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.dbService = null;
    reaction(
      () => this.companies.slice(),
      async () => {
        if (this.isCompaniesFetched) {
          await this.saveToCache();
        }
      },
    );
  }

  getIsCacheLoaded = (): boolean => {
    return this.isCacheLoaded;
  };

  getCompanies = (): Company[] => {
    return this.companies;
  };

  private setCompanies = (companies: Company[]): void => {
    this.companies = companies;
  };

  fetchCompanies = async (): Promise<void> => {
    try {
      this.isLoading = true;
      const response: GetCompaniesResponse = await apolloClient.query({
        query: GET_COMPANIES_QUERY,
      });

      const unapprovedCompanies: Company[] = response.data.unapprovedCompanies.map(
        company => ({
          ...company,
          isApproved: false,
        }),
      );

      const approvedCompanies: Company[] = response.data.companies.map(company => ({
        ...company,
        isApproved: true,
      }));

      this.setCompanies([...unapprovedCompanies, ...approvedCompanies]);
    } catch (error) {
      console.error('ERROR while getting companies', error);
      toast.error('Ошибка при получении списка компаний, перезагрузите страницу');
    } finally {
      this.isLoading = false;
      this.isCompaniesFetched = true;
    }
  };

  getCurrentAdminId = () => {
    return this.currentAdminId;
  };

  fetchCompany = async (id: string): Promise<void> => {
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

      this.companies[companyIndex] = {
        ...response.data.company,
        isApproved: this.companies[companyIndex].isApproved,
      };
    } catch (error) {
      console.error('ERROR while getting company', error);
      toast.error('Ошибка при получении компании, перезагрузите страницу');
    } finally {
      this.isLoading = false;
    }
  };

  deleteCompany = async (id: string): Promise<void> => {
    try {
      this.isLoading = true;

      if (id === this.currentAdminId) {
        return;
      }

      await apolloClient.mutate({
        mutation: DELETE_COMPANY_MUTATION,
        variables: { id },
      });

      this.companies = this.companies.filter(company => company.id !== id);
      toast.success('Компания успешно удалена');
    } catch (error) {
      console.error('ERROR while deleting company', error);
      if (error instanceof Error && isApolloError(error)) {
        if (
          error.graphQLErrors.some(
            err =>
              err.extensions?.code === 'FORBIDDEN' ||
              err.extensions?.code === 'UNAUTHORIZED' ||
              err.message.includes('403') ||
              err.message.includes('Unauthorized'),
          ) ||
          error.message.includes('Unauthorized')
        ) {
          toast.error('У вас нет прав для удаления этой компании');
        } else {
          toast.error('Произошла ошибка при удалении компании');
        }
      }
    } finally {
      this.isLoading = false;
    }
  };

  approveCompany = async (id: string): Promise<void> => {
    try {
      this.isLoading = true;

      const companyToApproveIndex = this.companies.findIndex(
        company => company.id === id,
      );

      if (companyToApproveIndex === -1) {
        throw new Error('Company not found');
      }

      await axiosInstance.post(`${APPROVE_API}?companyId=${id}`);

      this.companies[companyToApproveIndex].isApproved = true;
      toast.success('Компания успешно одобрена');
    } catch (error) {
      console.error('ERROR while getting company', error);

      if (isAxiosError(error) && error.code === '403') {
        toast.error('У вас нет прав для одобрения этой компании');
      }

      toast.error('Ошибка при получении компании, перезагрузите страницу');
    } finally {
      this.isLoading = false;
    }
  };

  getCurrentCompany = (id: string): Company | undefined => {
    return this.companies.find(company => company.id === id);
  };

  deleteAllCompanies = async () => {
    try {
      this.isLoading = true;

      await apolloClient.mutate({
        mutation: DELETE_ALL_COMPANIES_MUTATION,
      });

      this.companies = this.companies.filter(
        company => company.id === this.currentAdminId,
      );
      toast.success('Компания успешно удалена');
    } catch (error) {
      console.error('ERROR while deleting companies', error);
      if (error instanceof Error && isApolloError(error)) {
        if (
          error.graphQLErrors.some(
            err =>
              err.extensions?.code === 'FORBIDDEN' ||
              err.extensions?.code === 'UNAUTHORIZED' ||
              err.message.includes('403') ||
              err.message.includes('Unauthorized'),
          ) ||
          error.message.includes('Unauthorized')
        ) {
          toast.error('У вас нет прав для удаления компаний');
        } else {
          toast.error('Произошла ошибка при удалении компаний');
        }
      }
    } finally {
      this.isLoading = false;
    }
  };

  private loadFromCache = async (): Promise<void> => {
    if (!this.dbService) return;
    const cachedProjects = await this.dbService.getAll<Company>();
    if (cachedProjects.length > 0) {
      this.setCompanies(cachedProjects);
    }
  };

  private saveToCache = async (): Promise<void> => {
    if (!this.dbService) return;
    await this.dbService.saveAll(toJS(this.companies));
  };

  private preLoad = async (): Promise<void> => {
    if (this.isCacheLoaded) return;
    try {
      this.dbService = new IndexedDBService('CompaniesDB', 'companies');
      await this.loadFromCache();
    } catch (error) {
      console.error('Problem with preload companies from cache', error);
    } finally {
      this.isCacheLoaded = true;
    }
  };
}

export const useCompaniesStore = new CompaniesStore();

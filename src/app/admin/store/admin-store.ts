import { makeAutoObservable } from 'mobx';
import { TeamStore } from './teams-store';
import { CompaniesStore } from './companies-store';
import { ProjectStore } from './projects-store';
import { axiosInstance } from '@/lib/axios';
import { EXEL_EXPORT_API } from '../lib/constant';

class AdminStore {
  public teamStore: TeamStore;
  public companiesStore: CompaniesStore;
  public projectStore: ProjectStore;
  public isLoading: boolean = false;

  async loadExelFile(): Promise<Blob> {
    try {
      this.isLoading = true;
      const response = await axiosInstance.get(EXEL_EXPORT_API, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.log(error);
      return new Blob();
    } finally {
      this.isLoading = false;
    }
  }

  constructor() {
    makeAutoObservable(this);
    this.teamStore = new TeamStore();
    this.companiesStore = new CompaniesStore();
    this.projectStore = new ProjectStore();
  }
}

export const useAdminStore = new AdminStore();

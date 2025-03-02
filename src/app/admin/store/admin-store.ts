import { makeAutoObservable } from 'mobx';
import { TeamStore } from './teams-store';
import { CompaniesStore } from './companies-store';

class AdminStore {
  public teamStore: TeamStore;
  public companiesStore: CompaniesStore;

  constructor() {
    makeAutoObservable(this);
    this.teamStore = new TeamStore();
    this.companiesStore = new CompaniesStore();
  }
}

export const useAdminStore = new AdminStore();

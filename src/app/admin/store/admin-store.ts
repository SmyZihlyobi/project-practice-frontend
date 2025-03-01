import { makeAutoObservable } from 'mobx';
import { TeamStore } from './teams-store';

class AdminStore {
  public teamStore: TeamStore;

  constructor() {
    makeAutoObservable(this);
    this.teamStore = new TeamStore();
  }
}

export const useAdminStore = new AdminStore();

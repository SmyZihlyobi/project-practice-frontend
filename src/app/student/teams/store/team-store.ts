import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable, toJS } from 'mobx';

import { GetTeamResponse, GetTeamsResponse, Team } from '../api/dto';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GET_TEAM_QUERY } from '../api/queries/get-team';
import { TEAMS_PER_PAGE } from '../lib/constant';
import { IndexedDBService } from '@/lib/index-db/index-db-service';

class TeamStore {
  private teams: Team[] = [];
  private _currentTeamPageIndex: number = 1;
  public loading: boolean = false;
  public currentTeams: Team[] = [];
  private _pageSize: number = TEAMS_PER_PAGE;
  private _isCacheLoaded: boolean = false;
  private dbService: IndexedDBService | null;

  constructor() {
    makeAutoObservable(this);
    this.dbService = null;
  }

  private loadFromCache = async (): Promise<void> => {
    if (!this.dbService) return;
    const cachedTeams = await this.dbService.getAll<Team>();
    if (cachedTeams.length > 0) {
      this.setTeams(cachedTeams);
    }
  };

  preLoad = async (): Promise<void> => {
    if (this._isCacheLoaded) return;
    this.dbService = new IndexedDBService('TeamsDB', 'teams');
    await this.loadFromCache();
    this._isCacheLoaded = true;
  };

  get isCachedLoaded() {
    return this._isCacheLoaded;
  }

  private saveToCache = async (): Promise<void> => {
    if (!this.dbService) return;
    await this.dbService.saveAll(toJS(this.teams));
  };

  get pageSize(): number {
    return this._pageSize;
  }

  get currentTeamPageIndex(): number {
    return this._currentTeamPageIndex;
  }

  setCurrentPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= this.currentTeamsPagesCount) {
      this._currentTeamPageIndex = newPage;
    }
  };

  getTeams = async (): Promise<void> => {
    try {
      this.loading = true;
      const response: GetTeamsResponse = await apolloClient.query({
        query: GET_TEAMS_QUERY,
      });

      this.setTeams(response.data.teams);
      this.saveToCache();
    } catch (error) {
      console.error('ERROR while fetching teams', error);
    } finally {
      this.loading = false;
    }
  };

  setTeams = (teams: Team[]) => {
    this.teams = teams;
    this.currentTeams = teams;
    this.setCurrentPage(1);
  };

  get currentTeamsPagesCount(): number {
    return this.pageSize === Infinity
      ? 1
      : Math.ceil(this.currentTeams.length / this.pageSize);
  }

  get currentTeamsPage(): Team[] {
    const pageCount = this.currentTeamsPagesCount;
    if (this.pageSize === Infinity) {
      return this.currentTeams;
    }

    if (pageCount < 1) {
      return [];
    }
    const startIdx = (this.currentTeamPageIndex - 1) * this.pageSize;
    const endIdx = this.currentTeamPageIndex * this.pageSize;
    return this.currentTeams.slice(startIdx, endIdx);
  }

  nextPage = (): void => {
    if (this.currentTeamPageIndex < this.currentTeamsPagesCount) {
      this.setCurrentPage(this.currentTeamPageIndex + 1);
    }
  };

  prevPage = (): void => {
    if (this.currentTeamPageIndex > 1) {
      this.setCurrentPage(this.currentTeamPageIndex - 1);
    }
  };

  goToPage = (page: number): void => {
    this.setCurrentPage(page);
  };

  setPageSize = (size: number): void => {
    this._pageSize = size;
    this.setCurrentPage(1);
  };

  getTeam = async (id: string): Promise<void> => {
    try {
      this.loading = true;
      const team = this.teams.find(team => team.id === id);
      if (!team) {
        throw new Error(`Team with id ${id} doesn't exist`);
      }

      const response: GetTeamResponse = await apolloClient.query({
        query: GET_TEAM_QUERY,
        variables: { id },
      });

      team.students = response.data.team.students;
      const currentTeam = this.currentTeams.find(team => team.id === id);

      if (!currentTeam) {
        return;
      }
      currentTeam.students = response.data.team.students;
    } catch (error) {
      console.error(`ERROR while fetching team with id: ${id}`, error);
    } finally {
      this.loading = false;
    }
  };

  sortByCourse = (course: number): void => {
    this.currentTeams = this.teams.filter(team => {
      const courseCounts: { [key: number]: number } = {};

      team.students.forEach(student => {
        if (courseCounts[student.year]) {
          courseCounts[student.year]++;
        } else {
          courseCounts[student.year] = 1;
        }
      });

      let predominantCourse = -1;
      let maxCount = 0;

      for (const [year, count] of Object.entries(courseCounts)) {
        if (count > maxCount) {
          maxCount = count;
          predominantCourse = parseInt(year, 10);
        }
      }

      return predominantCourse === course;
    });
    this.setCurrentPage(1);
  };

  sortByStudentCount = (
    count: number,
    moreExpected: boolean,
    lessExpected: boolean,
  ): void => {
    if (!moreExpected && !lessExpected) {
      this.currentTeams = this.teams.filter(team => team.students.length === count);
    } else if (moreExpected) {
      this.currentTeams = this.teams.filter(team => team.students.length >= count);
    } else {
      this.currentTeams = this.teams.filter(team => team.students.length <= count);
    }
    this.setCurrentPage(1);
  };

  findByName = (name: string): void => {
    this.currentTeams = this.teams.filter(team => team.name.startsWith(name));
    this.setCurrentPage(1);
  };

  findByStudentLastName = (lastName: string): void => {
    this.currentTeams = this.filterStudentsByCriteria({ lastName });
    this.setCurrentPage(1);
  };

  findByStudentFirstName = (firstName: string): void => {
    this.currentTeams = this.filterStudentsByCriteria({ firstName });
    this.setCurrentPage(1);
  };

  findByPatronymic = (patronymic: string): void => {
    this.currentTeams = this.filterStudentsByCriteria({ patronymic });
    this.setCurrentPage(1);
  };

  findByStudentFullName = (
    lastName?: string,
    firstName?: string,
    patronymic?: string,
  ): void => {
    this.currentTeams = this.filterStudentsByCriteria({
      lastName,
      firstName,
      patronymic,
    });
    this.setCurrentPage(1);
  };

  private filterStudentsByCriteria = (criteria: {
    lastName?: string;
    firstName?: string;
    patronymic?: string;
  }): Team[] => {
    if (!Object.values(criteria).some(Boolean)) {
      return this.teams;
    }

    return this.teams.filter(team =>
      team.students.some(student => {
        const matchesLastName = criteria.lastName
          ? (student.lastName || '')
              .toLowerCase()
              .includes(criteria.lastName.toLowerCase())
          : true;

        const matchesFirstName = criteria.firstName
          ? (student.firstName || '')
              .toLowerCase()
              .includes(criteria.firstName.toLowerCase())
          : true;

        const matchesPatronymic = criteria.patronymic
          ? (student.patronymic || '')
              .toLowerCase()
              .includes(criteria.patronymic.toLowerCase())
          : true;

        return matchesLastName && matchesFirstName && matchesPatronymic;
      }),
    );
  };

  resetFilters = (): void => {
    this.currentTeams = this.teams;
    this.setCurrentPage(1);
  };
}

export const useTeamStore = new TeamStore();

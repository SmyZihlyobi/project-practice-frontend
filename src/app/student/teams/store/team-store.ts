import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable } from 'mobx';

import { GetTeamResponse, GetTeamsResponse, Team } from '../api/dto';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GET_TEAM_QUERY } from '../api/queries/get-team';
import { TEAMS_PER_PAGE } from '../lib/constant';

class TeamStore {
  private teams: Team[] = [];
  public loading: boolean = false;
  public currentTeamPageIndex: number = 1;
  public currentTeams: Team[] = [];
  public pageSize: number = TEAMS_PER_PAGE;

  constructor() {
    makeAutoObservable(this);
  }

  getTeams = async (): Promise<void> => {
    try {
      this.loading = true;
      const response: GetTeamsResponse = await apolloClient.query({
        query: GET_TEAMS_QUERY,
      });

      this.teams = response.data.teams;
      this.currentTeams = response.data.teams;
      this.currentTeamPageIndex = 1;
    } catch (error) {
      console.error('ERROR while fetching teams', error);
    } finally {
      this.loading = false;
    }
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

  setCurrentPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= this.currentTeamsPagesCount) {
      this.currentTeamPageIndex = newPage;
    }
  };

  nextPage = (): void => {
    if (this.currentTeamPageIndex < this.currentTeamsPagesCount) {
      this.currentTeamPageIndex++;
    }
  };

  prevPage = (): void => {
    if (this.currentTeamPageIndex > 1) {
      this.currentTeamPageIndex--;
    }
  };

  goToPage = (page: number): void => {
    this.setCurrentPage(page);
  };

  setPageSize = (size: number): void => {
    this.pageSize = size;
    this.currentTeamPageIndex = 1;
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
    this.currentTeamPageIndex = 1;
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
    this.currentTeamPageIndex = 1;
  };

  findByName = (name: string): void => {
    this.currentTeams = this.teams.filter(team => team.name.startsWith(name));
    this.currentTeamPageIndex = 1;
  };

  findByStudentLastName = (lastName: string): void => {
    this.currentTeams = this.filterStudentsByCriteria({ lastName });
    this.currentTeamPageIndex = 1;
  };

  findByStudentFirstName = (firstName: string): void => {
    this.currentTeams = this.filterStudentsByCriteria({ firstName });
    this.currentTeamPageIndex = 1;
  };

  findByPatronymic = (patronymic: string): void => {
    this.currentTeams = this.filterStudentsByCriteria({ patronymic });
    this.currentTeamPageIndex = 1;
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
    this.currentTeamPageIndex = 1;
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
    this.currentTeamPageIndex = 1;
  };
}

export const useTeamStore = new TeamStore();

import { makeAutoObservable } from 'mobx';

import { apolloClient } from '@/lib/Apollo';

import { GetTeamResponse, GetTeamsResponse, Team } from '../api/dto';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GET_TEAM_QUERY } from '../api/queries/get-team';
import { TEAMS_PER_PAGE } from '../lib/constant';

class TeamStore {
  private teams: Team[] = [];
  public loading: boolean = false;
  public currentTeamPageIndex: number = 1;
  public currentTeams: Team[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getTeams(): Promise<void> {
    try {
      this.loading = true;
      const response: GetTeamsResponse = await apolloClient.query({
        query: GET_TEAMS_QUERY,
      });

      this.teams = response.data.teams;
      this.currentTeams = response.data.teams;
    } catch (error) {
      console.error('ERROR while fetching teams', error);
    } finally {
      this.loading = false;
    }
  }

  get currentTeamsPagesCount(): number {
    return Math.ceil(this.currentTeams.length / TEAMS_PER_PAGE);
  }

  get currentTeamsPage(): Team[] {
    const pageCount = this.currentTeamsPagesCount;
    if (pageCount < 1) {
      return [];
    }
    const startIdx = (this.currentTeamPageIndex - 1) * TEAMS_PER_PAGE;
    const endIdx = this.currentTeamPageIndex * TEAMS_PER_PAGE;

    return this.currentTeams.slice(startIdx, endIdx);
  }

  setCurrentPage(newPage: number): void {
    this.currentTeamPageIndex = newPage;
  }

  async getTeam(id: string): Promise<void> {
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
  }

  sortByCourse(course: number): void {
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
  }

  sortByStudentCount(count: number, moreExpected: boolean, lessExpected: boolean): void {
    if (!moreExpected && !lessExpected) {
      this.currentTeams = this.teams.filter(team => team.students.length === count);
      return;
    }
    if (moreExpected) {
      this.currentTeams = this.teams.filter(team => team.students.length >= count);
      return;
    }
    this.currentTeams = this.teams.filter(team => team.students.length <= count);
  }

  findByName(name: string): void {
    this.currentTeams = this.teams.filter(team => team.name.startsWith(name));
  }

  resetFilters(): void {
    this.currentTeams = this.teams;
  }
}

export const useTeamStore = new TeamStore();

import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable } from 'mobx';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GetTeamResponse, GetTeamsResponse, Team } from '../api/dto';
import { GET_TEAM_QUERY } from '../api/queries/get-team';

class TeamStore {
  private teams: Team[] = [];
  public loading: boolean = false;
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
      const studentsInCourse = team.students.filter(student => student.year === course);
      return studentsInCourse.length > 0;
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

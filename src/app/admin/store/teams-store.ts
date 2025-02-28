import { apolloClient } from '@/lib';
import { makeAutoObservable } from 'mobx';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GetTeamResponse, GetTeamsResponse, Team } from '../dto';
import { GET_TEAM_QUERY } from '../api/queries/get-team';

export class TeamStore {
  public teams: Team[] = [];
  public loading: boolean = false;

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
    } catch (error) {
      console.error(`ERROR while fetching team with id: ${id}`, error);
    } finally {
      this.loading = false;
    }
  }
}

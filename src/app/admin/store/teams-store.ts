import { apolloClient } from '@/lib/Apollo';
import { axiosInstance } from '@/lib/axios';
import { isApolloError } from '@apollo/client';
import { makeAutoObservable } from 'mobx';
import { toast } from 'sonner';
import {
  DELETE_ALL_STUDENTS_MUTATION,
  DELETE_ALL_TEAMS_MUTATION,
  DELETE_STUDENT_MUTATION,
  DELETE_TEAM_MUTATION,
} from '../api/mutations';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GET_TEAM_QUERY } from '../api/queries/get-team';
import {
  DeleteStudentResponse,
  GetTeamResponse,
  GetTeamsResponse,
  Team,
} from '../api/dto';
import { RESUME_API } from '../lib/constant';

export class TeamStore {
  public teams: Team[] = [];
  public loading: boolean = false;
  public undecidedTeamId: string = '0';

  constructor() {
    makeAutoObservable(this);
  }

  private async deleteStudentResume(resumePdf?: string): Promise<void> {
    try {
      this.loading = true;
      await axiosInstance.delete(`${RESUME_API}/${resumePdf}`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async getTeams(): Promise<void> {
    try {
      this.loading = true;
      const response: GetTeamsResponse = await apolloClient.query({
        query: GET_TEAMS_QUERY,
      });

      this.teams = response.data.teams;

      const undecidedTeam = this.teams.find(team => team.name === 'Не выбрана');
      if (undecidedTeam) {
        this.undecidedTeamId = undecidedTeam?.id;
      } else {
        console.error(
          'Not found undecided team, it can cause problems with delete teams',
        );
      }
    } catch (error) {
      console.error('ERROR while fetching teams', error);
      toast.error('Ошибка при получении списка команд, перезагрузите страницу');
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
      toast.error('Ошибка при получении списка студентов, перезагрузите страницу');
    } finally {
      this.loading = false;
    }
  }

  async deleteTeam(id: string) {
    try {
      this.loading = true;

      await apolloClient.mutate({
        mutation: DELETE_TEAM_MUTATION,
        variables: { id },
      });

      await this.getTeam(this.undecidedTeamId);

      this.teams = this.teams.filter(team => team.id !== id);

      toast.success('Команда успешно расформирована');
    } catch (error) {
      console.error('ERROR while delete student', error);
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
          toast.error('У вас нет прав для удаления этой команды');
        } else {
          toast.error('Произошла ошибка при удалении команды');
        }
      }
    } finally {
      this.loading = false;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      this.loading = true;
      const teamWithStudent = this.teams.find(team =>
        team.students.some(student => student.id === id),
      );

      const studentToDelete = teamWithStudent?.students.find(
        student => student.id === id,
      );

      if (!studentToDelete) {
        throw new Error('Студент не найден');
      }

      const deletedStudent: DeleteStudentResponse = await apolloClient.mutate({
        mutation: DELETE_STUDENT_MUTATION,
        variables: { id },
      });

      if (deletedStudent.data?.deleteStudent?.resumePdf) {
        await this.deleteStudentResume(deletedStudent.data.deleteStudent.resumePdf);
      }

      if (teamWithStudent) {
        teamWithStudent.students = teamWithStudent.students.filter(
          student => student.id !== id,
        );
      }

      toast.success('Студент успешно удалён');
    } catch (error) {
      console.error('ERROR while delete student', error);
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
          toast.error('У вас нет прав для удаления этого студента');
        } else {
          toast.error('Произошла ошибка при удалении студента');
        }
      }
    } finally {
      this.loading = false;
    }
  }

  async deleteAllTeams(): Promise<void> {
    try {
      this.loading = true;
      await apolloClient.mutate({
        mutation: DELETE_ALL_TEAMS_MUTATION,
      });
      await this.getTeams();
      toast.success('Все команды успешно удалены');
    } catch (error) {
      console.error('ERROR while delete all teams', error);
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
          toast.error('У вас нет прав для удаления команд');
        } else {
          toast.error('Произошла ошибка при удалении команд');
        }
      }
    } finally {
      this.loading = false;
    }
  }

  async deleteAllStudents() {
    try {
      this.loading = true;

      await apolloClient.mutate({
        mutation: DELETE_ALL_STUDENTS_MUTATION,
      });

      await this.deleteAllResume();

      await this.getTeam(this.undecidedTeamId);

      toast.success('Все студенты успешно удалены');
    } catch (error) {
      console.error('ERROR while delete all students', error);
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
          toast.error('У вас нет прав для удаления студентов');
        } else {
          toast.error('Произошла ошибка при удалении студентов');
        }
      }
    } finally {
      this.loading = false;
    }
  }

  async deleteAllResume() {
    try {
      this.loading = true;
      await axiosInstance.delete(`${RESUME_API}/clear-bucket`);
      toast.success('Все резюме успешно удалены');
    } catch (error) {
      console.error('ERROR while delete all resume', error);
      toast.error('Произошла ошибка при удалении резюме');
    } finally {
      this.loading = false;
    }
  }
}

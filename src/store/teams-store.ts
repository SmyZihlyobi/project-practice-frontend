import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable, toJS, reaction } from 'mobx';
import { SyncService } from '@/lib/index-db/sync-service';

import {
  DeleteStudentResponse,
  GetTeamResponse,
  GetTeamsResponse,
  Team,
} from '../api/dto';
import { GET_TEAMS_QUERY } from '../api/queries';
import { GET_TEAM_QUERY } from '../api/queries/get-team';
import { RESUME_API, RESUME_UPLOAD_URL, TEAMS_PER_PAGE } from '../lib/constant';
import { IndexedDBService } from '@/lib/index-db/index-db-service';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { isApolloError } from '@apollo/client';
import {
  DELETE_ALL_STUDENTS_MUTATION,
  DELETE_ALL_TEAMS_MUTATION,
  DELETE_STUDENT_MUTATION,
  DELETE_TEAM_MUTATION,
  CREATE_STUDENT_MUTATION,
} from '@/api/mutations';

class TeamStore {
  private teams: Team[] = [];
  private currentTeamPageIndex: number = 1;
  public loading: boolean = false;
  public currentTeams: Team[] = [];
  private pageSize: number = TEAMS_PER_PAGE;
  private isCacheLoaded: boolean = false;
  private dbService: IndexedDBService | null;
  private undecidedTeamId: string = '0';
  private isTeamsFetched: boolean = false;
  private syncService: SyncService;

  constructor() {
    makeAutoObservable(this);
    this.dbService = null;
    this.syncService = SyncService.getInstance();
    if (typeof window !== 'undefined') {
      this.syncService.init();
    }
    reaction(
      () => this.teams.slice(),
      async () => {
        if (this.isTeamsFetched) {
          await this.saveToCache();
        }
      },
    );
  }

  private loadFromCache = async (): Promise<void> => {
    if (!this.dbService) return;
    const cachedTeams = await this.dbService.getAll<Team>();
    if (cachedTeams.length > 0) {
      this.setTeams(cachedTeams);
    }
  };

  preLoad = async (): Promise<void> => {
    if (this.isCacheLoaded) return;
    try {
      this.dbService = new IndexedDBService('TeamsDB', 'teams');
      await this.loadFromCache();
    } catch (error) {
      console.error('Error while loading teams from cache', error);
    } finally {
      this.isCacheLoaded = true;
    }
  };

  getUndecidedTeamId = (): string => {
    return this.undecidedTeamId;
  };

  getIsCachedLoaded = () => {
    return this.isCacheLoaded;
  };

  private saveToCache = async (): Promise<void> => {
    if (!this.dbService) return;
    await this.dbService.saveAll(toJS(this.teams));
  };

  getPageSize = (): number => {
    return this.pageSize;
  };

  getCurrentTeamPageIndex = (): number => {
    return this.currentTeamPageIndex;
  };

  uploadResume = async (resumePDF: File, userId: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', resumePDF);

      if (this.syncService.isSyncOnline) {
        await axiosInstance.post(RESUME_UPLOAD_URL, formData);
        toast.success('Резюме успешно загружено');
      } else {
        await this.syncService.addAxiosRequest({
          url: RESUME_UPLOAD_URL,
          method: 'POST',
          data: formData,
        });
        toast.info('Резюме будет загружено при восстановлении соединения');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при загрузке резюме');
      throw error;
    }
  };

  createStudent = async (
    studentData: {
      teamName: string | null;
      groupId: string;
      year: number;
      lastName: string;
      firstName: string;
      patronymic?: string;
      firstPriority: number;
      secondPriority: number;
      thirdPriority: number;
      resumeLink?: string;
      telegram: string;
      otherPriorities?: string;
      username?: string;
    },
    resumePDF?: File,
  ): Promise<{ id: string }> => {
    try {
      this.loading = true;

      if (this.syncService.isSyncOnline) {
        const response = await apolloClient.mutate({
          mutation: CREATE_STUDENT_MUTATION,
          variables: {
            ...studentData,
            resumePdf: '',
          },
        });

        if (response.errors) {
          const errorMessages = response.errors.map(error => {
            if (error.extensions?.code === 'BAD_USER_INPUT') {
              return 'Ошибка ввода данных. Проверьте правильность заполнения полей.';
            } else if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
              return 'Внутренняя ошибка сервера. Попробуйте позже.';
            }
            return error.message;
          });
          throw new Error(errorMessages.join('\n'));
        }

        if (!response.data?.createStudent) {
          throw new Error('Не удалось создать студента');
        }

        const newStudent = response.data.createStudent;

        if (resumePDF) {
          await this.uploadResume(resumePDF, newStudent.id);
        }

        await this.fetchTeams();
        return newStudent;
      } else {
        const offlineStudent = {
          id: `offline-${Date.now()}`,
          ...studentData,
        };

        await this.syncService.addApolloMutation(CREATE_STUDENT_MUTATION, {
          ...studentData,
          resumePdf: '',
        });

        if (resumePDF) {
          await this.uploadResume(resumePDF, offlineStudent.id);
        }

        const undecidedTeam = this.teams.find(team => team.id === this.undecidedTeamId);
        if (undecidedTeam) {
          undecidedTeam.students.push(offlineStudent);
        }

        toast.info('Студент будет создан при восстановлении соединения');
        return offlineStudent;
      }
    } catch (error) {
      console.error('Student creation error:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  };

  setCurrentPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= this.currentTeamsPagesCount) {
      this.currentTeamPageIndex = newPage;
    }
  };

  fetchTeams = async (): Promise<void> => {
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
      this.isTeamsFetched = true;
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
    this.pageSize = size;
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

  deleteTeam = async (id: string) => {
    try {
      this.loading = true;

      if (this.syncService.isSyncOnline) {
        await apolloClient.mutate({
          mutation: DELETE_TEAM_MUTATION,
          variables: { id },
        });

        await this.getTeam(this.undecidedTeamId);
        this.teams = this.teams.filter(team => team.id !== id);
        toast.success('Команда успешно расформирована');
      } else {
        const teamToDelete = this.teams.find(team => team.id === id);
        if (teamToDelete) {
          const undecidedTeam = this.teams.find(team => team.id === this.undecidedTeamId);
          if (undecidedTeam) {
            undecidedTeam.students.push(...teamToDelete.students);
          }

          this.teams = this.teams.filter(team => team.id !== id);

          await this.syncService.addApolloMutation(DELETE_TEAM_MUTATION, { id });

          toast.info('Команда будет расформирована при восстановлении соединения');
        }
      }
    } catch (error) {
      console.error('ERROR while delete team', error);
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
  };

  deleteStudent = async (id: string): Promise<void> => {
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

      if (this.syncService.isSyncOnline) {
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
      } else {
        if (teamWithStudent) {
          teamWithStudent.students = teamWithStudent.students.filter(
            student => student.id !== id,
          );
        }
        await this.syncService.addApolloMutation(DELETE_STUDENT_MUTATION, { id });

        if (studentToDelete.resumePdf) {
          await this.syncService.addAxiosRequest({
            url: `${RESUME_API}/${studentToDelete.resumePdf}`,
            method: 'DELETE',
          });
        }

        toast.info('Студент будет удален при восстановлении соединения');
      }
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
  };

  deleteAllTeams = async (): Promise<void> => {
    try {
      this.loading = true;
      await apolloClient.mutate({
        mutation: DELETE_ALL_TEAMS_MUTATION,
      });
      await this.fetchTeams();
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
  };

  deleteAllStudents = async () => {
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
  };

  deleteAllResume = async () => {
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
  };

  getTeams = () => {
    return this.teams;
  };

  getCurrentTeam = (id: string) => {
    return this.teams.find(team => team.id === id);
  };

  private deleteStudentResume = async (resumePdf?: string): Promise<void> => {
    try {
      this.loading = true;
      await axiosInstance.delete(`${RESUME_API}/${resumePdf}`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };
}

export const useTeamsStore = new TeamStore();

import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable, toJS, reaction } from 'mobx';

import { GET_FAVORITE_PROJECT_QUERY, GET_PROJECTS_QUERY } from '@/api/queries';
import type {
  FavoriteProject,
  GetFavoriteProjectResponse,
  GetProjectResponse,
  Project,
} from '@/api/dto';
import {
  ARCHIVE_ALL_PROJECTS_MUTATION,
  ARCHIVE_PROJECT_MUTATION,
  CREATE_PROJECT,
  DELETE_ALL_PROJECTS_MUTATION,
  DELETE_PROJECT_MUTATION,
  SER_FAVORITE_MUTATION,
  SER_UNFAVORITE_MUTATION,
  UNARCHIVE_PROJECT_MUTATION,
} from '@/api/mutations';
import { toast } from 'sonner';
import { IndexedDBService } from '@/lib/index-db/index-db-service';
import { axiosInstance } from '@/lib/axios';
import {
  PRESENTATION_API,
  PRESENTATION_URL,
  TECHNICAL_SPECIFICATION_API,
  TECHNICAL_SPECIFICATION_URL,
} from '@/lib/constant';
import { isApolloError } from '@apollo/client/errors';

class ProjectStore {
  private projects: Project[] = [];
  public loading = false;
  public currentProjects: Project[] = [];
  public stackItems: Set<string> = new Set();
  public selectedStackItems: Set<string> = new Set();
  public favoriteProject: FavoriteProject[] = [];
  public currentPage = 1;
  public pageSize = 10;
  public paginatedProjects: Project[] = [];
  private dbService: IndexedDBService | null;
  private isCacheLoaded: boolean = false;
  private isProjectsFetched: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.dbService = null;

    reaction(
      () => this.projects.slice(),
      async () => {
        if (this.isProjectsFetched) {
          await this.saveToCache();
        }
      },
    );
  }

  private preLoad = async (): Promise<void> => {
    if (this.isCacheLoaded) return;
    try {
      this.dbService = new IndexedDBService('ProjectsDB', 'projects');
      await this.loadFromCache();
    } catch (error) {
      console.error('Problem with preload projects from cache', error);
    } finally {
      this.isCacheLoaded = true;
    }
  };

  getProjects = () => {
    return this.projects;
  };

  getIsCacheLoaded = (): boolean => {
    return this.isCacheLoaded;
  };

  fetchProjects = async (): Promise<void> => {
    try {
      await this.preLoad();
      this.loading = true;
      const response: GetProjectResponse = await apolloClient.query({
        query: GET_PROJECTS_QUERY,
      });

      this.setProjects(response.data.projects);
      this.saveToCache();
    } catch (error) {
      console.error('ERROR while fetching teams', error);
    } finally {
      this.loading = false;
      this.isProjectsFetched = true;
    }
  };

  private setProjects = (projects: Project[]) => {
    this.projects = projects;
    this.currentProjects = this.projects.filter(project => !!project.active);

    this.getStackItems();
    this.updatePaginatedProjects();
  };

  uploadPresentation = async (id: string, presentation?: Blob) => {
    if (!presentation) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('projectId', id);
      formData.append('file', presentation);
      axiosInstance.post(PRESENTATION_URL, formData);
    } catch (error) {
      console.error(error);
    }
  };

  uploadTechnicalSpecification = async (id: string, technicalSpecification?: Blob) => {
    if (!technicalSpecification) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('projectId', id);
      formData.append('file', technicalSpecification);
      axiosInstance.post(TECHNICAL_SPECIFICATION_URL, formData);
    } catch (error) {
      console.error(error);
    }
  };

  createProject = async (
    project: Omit<Project, 'id' | 'active' | 'companyName'>,
  ): Promise<Project> => {
    try {
      const response = await apolloClient.mutate({
        mutation: CREATE_PROJECT,
        variables: {
          ...project,
          teamsAmount: Number(project.teamsAmount),
        },
      });

      if (response.errors) {
        response.errors.forEach(error => {
          if (error.extensions?.code === 'BAD_USER_INPUT') {
            toast.error(
              'Ошибка ввода данных. Пожалуйста, проверьте правильность заполнения всех полей.',
            );
          } else if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
            toast.error(
              'Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
            );
          } else {
            toast.error(
              'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.',
            );
          }
        });
        throw new Error();
      }

      toast.success('Проект успешно создан');

      const {
        data: { createProject: newProject },
      } = response;

      this.setProjects([...this.projects, newProject]);
      return newProject;
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка при создании проекта');
      throw error;
    }
  };

  getFavoriteProjects = async (id: string): Promise<void> => {
    try {
      this.loading = true;
      const response: GetFavoriteProjectResponse = await apolloClient.query({
        query: GET_FAVORITE_PROJECT_QUERY,
        variables: { id },
      });
      this.favoriteProject = response.data.favoriteProjects;
    } catch (error) {
      console.error('ERROR while fetching favorite projects', error);
    } finally {
      this.loading = false;
    }
  };

  isFavoriteProject = (projectId: string): boolean => {
    return !!this.favoriteProject.find(project => project.projectId === projectId);
  };

  setFavoriteProject = async (projectId: string, studentId: string): Promise<void> => {
    try {
      if (!projectId || !studentId) return;

      await apolloClient.mutate({
        mutation: SER_FAVORITE_MUTATION,
        variables: {
          input: {
            studentId,
            projectId,
          },
        },
      });
      this.favoriteProject.push({ projectId });
    } catch (error) {
      console.error(
        `ERROR while setting project with id=${projectId} by student with id=${studentId}`,
        error,
      );
      toast.error(
        'Произошла ошибка при добавлении проект в избранные, повторите ещё раз',
      );
    }
  };

  setUnfavoriteProject = async (projectId: string, studentId: string): Promise<void> => {
    try {
      await apolloClient.mutate({
        mutation: SER_UNFAVORITE_MUTATION,
        variables: { studentId, projectId },
      });
      this.favoriteProject = this.favoriteProject.filter(
        project => project.projectId !== projectId,
      );
    } catch (error) {
      console.error(
        `ERROR while deleting project with id=${projectId} by student with id=${studentId} from favorites`,
        error,
      );
      toast.error(
        'Произошла ошибка при удаления проекта из избранных, повторите ещё раз',
      );
    }
  };

  getStackItems = (): void => {
    try {
      this.stackItems.clear();
      for (const project of this.projects) {
        if (!project.stack) {
          continue;
        }
        project.stack.split(', ').forEach(stackItem => {
          this.stackItems.add(stackItem.toLowerCase());
        });
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  findByName = (name: string): void => {
    this.currentProjects = this.projects.filter(project =>
      project.name.toLocaleLowerCase().startsWith(name.toLocaleLowerCase()),
    );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  filterByPresentation = (isFiltered: boolean): void => {
    if (isFiltered) this.currentProjects = this.projects;
    else
      this.currentProjects = this.currentProjects.filter(
        project =>
          project.presentation &&
          project.presentation !== '' &&
          project.presentation !== undefined,
      );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  filterByFavorite = (isFiltered: boolean): void => {
    if (isFiltered) this.currentProjects = this.projects;
    else
      this.currentProjects = this.currentProjects.filter(project =>
        this.isFavoriteProject(project.id),
      );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  filterByCompany = (isFiltered: boolean): void => {
    if (isFiltered) this.currentProjects = this.projects;
    else
      this.currentProjects = this.currentProjects.filter(
        project => !project.studentProject,
      );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  filterByActive = (isFiltered: boolean): void => {
    if (isFiltered) {
      this.currentProjects = this.projects.filter(project => !!project.active);
    } else {
      this.currentProjects = this.projects;
    }
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  filterByTechnicalSpecifications = (isFiltered: boolean): void => {
    if (isFiltered) this.currentProjects = this.projects;
    else
      this.currentProjects = this.currentProjects.filter(
        project =>
          project.technicalSpecifications &&
          project.technicalSpecifications !== '' &&
          project.technicalSpecifications !== undefined,
      );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  resetFilters = () => {
    this.selectedStackItems = new Set();
    this.currentProjects = this.projects;
    this.currentPage = 1;
    this.updatePaginatedProjects();
    this.filterByActive(true);
  };

  toggleStackItem = (item: string): void => {
    if (this.selectedStackItems.size !== 0 && this.selectedStackItems.has(item)) {
      this.selectedStackItems.delete(item);
    } else {
      this.selectedStackItems.add(item);
    }
    this.filterProjects();
  };

  filterProjects = (): void => {
    if (this.selectedStackItems.size === 0) {
      this.currentProjects = this.projects;
    } else {
      this.currentProjects = this.projects.filter(project => {
        if (!project.stack) return false;

        const projectStackItems = project.stack.toLowerCase().split(', ');

        return Array.from(this.selectedStackItems).some(selectedItem =>
          projectStackItems.includes(selectedItem),
        );
      });
    }
    this.currentPage = 1;
    this.updatePaginatedProjects();
  };

  get totalPages(): number {
    return Math.ceil(this.currentProjects.length / this.pageSize);
  }

  updatePaginatedProjects = (): void => {
    if (this.pageSize === Infinity) {
      this.paginatedProjects = this.currentProjects;
    } else {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedProjects = this.currentProjects.slice(startIndex, endIndex);
    }
  };

  nextPage = (): void => {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProjects();
    }
  };

  prevPage = (): void => {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProjects();
    }
  };

  goToPage = (page: number): void => {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProjects();
    }
  };

  setPageSize = (size: number | typeof Infinity): void => {
    this.pageSize = size;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    this.updatePaginatedProjects();
  };

  deleteProject = async (id: string): Promise<void> => {
    try {
      this.loading = true;

      const projectToDelete = this.projects.find(project => project.id === id);

      if (!projectToDelete) {
        throw new Error("Project doesn't exist");
      }

      await apolloClient.mutate({
        mutation: DELETE_PROJECT_MUTATION,
        variables: { id },
      });

      this.deleteProjectFiles(projectToDelete);

      this.projects = this.projects.filter(project => project.id !== id);
      toast.success('Проект успешно удален');
    } catch (error) {
      console.error('ERROR while deleting project', error);
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
          toast.error('У вас нет прав для удаления этого проекта');
        } else {
          toast.error('Произошла ошибка при удалении проекта');
        }
      }
    } finally {
      this.loading = false;
    }
  };

  deleteAllProjects = async () => {
    try {
      this.loading = true;

      await apolloClient.mutate({
        mutation: DELETE_ALL_PROJECTS_MUTATION,
      });

      await this.deleteAllProjectFiles();

      this.projects = [];

      toast.success('Все проекты успешно удалены');
    } catch (error) {
      console.error('ERROR while deleting all projects', error);
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
          toast.error('У вас нет прав для удаления этого проекта');
        } else {
          toast.error('Произошла ошибка при удалении проекта');
        }
      }
    } finally {
      this.loading = false;
    }
  };

  archiveProject = async (id: string): Promise<void> => {
    try {
      this.loading = true;
      const projectToArchive = this.projects.find(project => project.id === id);

      if (!projectToArchive) {
        throw new Error("Project doesn't exist");
      }

      await apolloClient.mutate({
        mutation: ARCHIVE_PROJECT_MUTATION,
        variables: { id },
      });

      const projectToArchiveIndex = this.projects.indexOf(projectToArchive);

      this.projects[projectToArchiveIndex] = {
        ...projectToArchive,
        active: false,
      };
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  unarchiveProject = async (id: string): Promise<void> => {
    try {
      this.loading = true;
      const projectToUnArchive = this.projects.find(project => project.id === id);

      if (!projectToUnArchive) {
        throw new Error("Project doesn't exist");
      }

      await apolloClient.mutate({
        mutation: UNARCHIVE_PROJECT_MUTATION,
        variables: { id },
      });

      const projectToUnArchiveIndex = this.projects.indexOf(projectToUnArchive);

      this.projects[projectToUnArchiveIndex] = {
        ...projectToUnArchive,
        active: true,
      };
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  archiveAllProject = async (): Promise<void> => {
    try {
      this.loading = true;
      await apolloClient.mutate({ mutation: ARCHIVE_ALL_PROJECTS_MUTATION });
      this.projects = this.projects.map(project => {
        return { ...project, active: false };
      });
    } catch (error) {
      console.error(error);
      toast.error('Venom');
    } finally {
      this.loading = false;
    }
  };

  private deleteProjectFiles = async (project: Project) => {
    try {
      this.loading = true;
      await axiosInstance.delete(
        `${TECHNICAL_SPECIFICATION_API}/${project.technicalSpecifications}`,
      );
      await axiosInstance.delete(`${PRESENTATION_API}/${project.presentation}`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  deleteAllTechnicalSpecification = async () => {
    try {
      this.loading = true;
      axiosInstance.delete(`${TECHNICAL_SPECIFICATION_API}/clear-bucket`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  deleteAllPresentations = async () => {
    try {
      this.loading = true;
      axiosInstance.delete(`${PRESENTATION_API}/clear-bucket`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  private deleteAllProjectFiles = async () => {
    try {
      this.loading = true;
      await this.deleteAllTechnicalSpecification();
      await this.deleteAllPresentations();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  private loadFromCache = async (): Promise<void> => {
    if (!this.dbService) return;
    const cachedProjects = await this.dbService.getAll<Project>();
    if (cachedProjects.length > 0) {
      this.setProjects(cachedProjects);
    }
  };

  private saveToCache = async (): Promise<void> => {
    if (!this.dbService) return;
    await this.dbService.saveAll(toJS(this.projects.filter(project => !!project.active)));
  };
}

export const useProjectStore = new ProjectStore();

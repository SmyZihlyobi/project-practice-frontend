import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable, toJS } from 'mobx';

import { GET_FAVORITE_PROJECT_QUERY, GET_PROJECTS_QUERY } from '../api/queries';
import type {
  FavoriteProject,
  GetFavoriteProjectResponse,
  GetProjectResponse,
  Project,
} from '../api/dto';
import { SER_FAVORITE_MUTATION, SER_UNFAVORITE_MUTATION } from '../api/mutations';
import { toast } from 'sonner';
import { IndexedDBService } from '@/lib/index-db/index-db-service';

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

  constructor() {
    makeAutoObservable(this);
    this.dbService = null;
  }

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

  preLoad = async (): Promise<void> => {
    if (this.isCacheLoaded) return;
    this.dbService = new IndexedDBService('ProjectsDB', 'projects');
    await this.loadFromCache();
    this.isCacheLoaded = true;
  };

  getIsCacheLoaded = (): boolean => {
    return this.isCacheLoaded;
  };

  getProjects = async (): Promise<void> => {
    try {
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
    }
  };

  private setProjects = (projects: Project[]) => {
    this.projects = projects;
    this.currentProjects = this.projects.filter(project => !!project.active);

    this.getStackItems();
    this.updatePaginatedProjects();
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
}

export const useProjectStore = new ProjectStore();

import { apolloClient } from '@/lib/Apollo';
import { makeAutoObservable } from 'mobx';

import { GET_PROJECTS_QUERY } from '../api/queries/get-projects';
import type { GetProjectResponse, Project } from '../dto/project';

class ProjectStore {
  private projects: Project[] = [];
  public loading = false;
  public currentProjects: Project[] = [];
  public stackItems: Set<string> = new Set();
  public selectedStackItems: Set<string> = new Set();

  public currentPage = 1;
  public pageSize = 10;
  public paginatedProjects: Project[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getProjects(): Promise<void> {
    try {
      this.loading = true;
      const response: GetProjectResponse = await apolloClient.query({
        query: GET_PROJECTS_QUERY,
      });
      const companiesStudents = response.data.projects.filter(
        project => !project.studentProject,
      );
      this.projects = companiesStudents;
      this.currentProjects = companiesStudents;

      this.getStackItems();
      this.updatePaginatedProjects();
    } catch (error) {
      console.error('ERROR while fetching teams', error);
    } finally {
      this.loading = false;
    }
  }

  getStackItems(): void {
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
  }

  findByName(name: string): void {
    this.currentProjects = this.projects.filter(project =>
      project.name.toLocaleLowerCase().startsWith(name.toLocaleLowerCase()),
    );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }

  filterByPresentation(isFiltered: boolean): void {
    if (isFiltered) return;
    else
      this.currentProjects = this.currentProjects.filter(
        project =>
          project.presentation &&
          project.presentation !== '' &&
          project.presentation !== undefined,
      );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }

  filterByTechnicalSpecifications(isFiltered: boolean): void {
    if (isFiltered) return;
    else
      this.currentProjects = this.currentProjects.filter(
        project =>
          project.technicalSpecifications &&
          project.technicalSpecifications !== '' &&
          project.technicalSpecifications !== undefined,
      );
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }

  resetFilters() {
    this.selectedStackItems = new Set();
    this.currentProjects = this.projects;
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }

  toggleStackItem(item: string): void {
    if (this.selectedStackItems.size !== 0 && this.selectedStackItems.has(item)) {
      this.selectedStackItems.delete(item);
    } else {
      this.selectedStackItems.add(item);
    }
    this.filterProjects();
  }

  filterProjects(): void {
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
  }

  get totalPages(): number {
    return Math.ceil(this.currentProjects.length / this.pageSize);
  }

  updatePaginatedProjects(): void {
    if (this.pageSize === Infinity) {
      this.paginatedProjects = this.currentProjects;
    } else {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedProjects = this.currentProjects.slice(startIndex, endIndex);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProjects();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProjects();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProjects();
    }
  }

  setPageSize(size: number | typeof Infinity): void {
    this.pageSize = size;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    this.updatePaginatedProjects();
  }
}

export const useProjectStore = new ProjectStore();

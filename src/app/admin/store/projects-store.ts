import { makeAutoObservable } from 'mobx';
import { GetProjectResponse, GetProjectsResponse, Project } from '../api/dto';
import { toast } from 'sonner';
import { GET_PROJECT_QUERY, GET_PROJECTS_QUERY } from '../api/queries';
import { isApolloError } from '@apollo/client';
import {
  ARCHIVE_PROJECT_MUTATION,
  DELETE_ALL_PROJECTS_MUTATION,
  DELETE_PROJECT_MUTATION,
  UNARCHIVE_PROJECT_MUTATION,
  VENOM_MUTATION,
} from '../api/mutations';
import { PRESENTATION_API, TECHNICAL_SPECIFICATION_API } from '../lib/constant';
import { apolloClient } from '@/lib/Apollo';
import { axiosInstance } from '@/lib/axios';

export class ProjectStore {
  public projects: Project[] = [];
  public loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  private async deleteProjectFiles(project: Project) {
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
  }

  private async deleteAllProjectFiles() {
    try {
      this.loading = true;
      await this.deleteAllTechnicalSpecification();
      await this.deleteAllPresentations();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async getProjects(): Promise<void> {
    try {
      this.loading = true;
      const response: GetProjectsResponse = await apolloClient.query({
        query: GET_PROJECTS_QUERY,
      });

      this.projects = response.data.projects;
    } catch (error) {
      console.error('ERROR while fetching projects', error);
      toast.error('Ошибка при получении списка проектов, перезагрузите страницу');
    } finally {
      this.loading = false;
    }
  }

  async getProject(id: string): Promise<void> {
    try {
      this.loading = true;
      const projectIndex = this.projects.findIndex(project => project.id === id);

      if (projectIndex === -1) {
        throw new Error('Project not found');
      }

      const response: GetProjectResponse = await apolloClient.query({
        query: GET_PROJECT_QUERY,
        variables: { id },
      });

      this.projects[projectIndex] = response.data.project;
    } catch (error) {
      console.error(`ERROR while fetching project with id: ${id}`, error);
      toast.error('Ошибка при получении проекта, перезагрузите страницу');
    } finally {
      this.loading = false;
    }
  }

  async deleteProject(id: string): Promise<void> {
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
  }

  async deleteAllProjects() {
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
  }

  async deleteAllPresentations() {
    try {
      this.loading = true;
      axiosInstance.delete(`${PRESENTATION_API}/clear-bucket`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async deleteAllTechnicalSpecification() {
    try {
      this.loading = true;
      axiosInstance.delete(`${TECHNICAL_SPECIFICATION_API}/clear-bucket`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async archiveProject(id: string): Promise<void> {
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
  }

  async unarchiveProject(id: string): Promise<void> {
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
  }

  async archiveAllProject(): Promise<void> {
    try {
      this.loading = true;
      await apolloClient.mutate({ mutation: VENOM_MUTATION });
      this.projects = this.projects.map(project => {
        return { ...project, active: false };
      });
    } catch (error) {
      console.error(error);
      toast.error('Venom');
    } finally {
      this.loading = false;
    }
  }
}

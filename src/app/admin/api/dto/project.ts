import { ApolloQueryResult } from '@apollo/client';

export interface Project {
  id: string;
  name: string;
  studentProject: boolean;
  presentation?: string;
  stack?: string;
  teamsAmount?: number;
  technicalSpecifications?: string;
  description?: string;
}

interface GetProjects {
  projects: Project[];
}

interface GetProject {
  project: Project;
}

export type GetProjectResponse = ApolloQueryResult<GetProject>;
export type GetProjectsResponse = ApolloQueryResult<GetProjects>;

import { ApolloQueryResult } from '@apollo/client';

export interface Project {
  description: string;
  name: string;
  presentation?: string;
  stack: string;
  studentProject: boolean;
  teamsAmount: number;
  technicalSpecifications?: string;
  id: string;
}

interface ProjectQueryResponse {
  projects: Project[];
}

export type GetProjectResponse = ApolloQueryResult<ProjectQueryResponse>;

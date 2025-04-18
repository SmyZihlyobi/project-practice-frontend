import { ApolloQueryResult } from '@apollo/client';

export interface Project {
  description: string;
  name: string;
  presentation?: string;
  stack: string;
  studentProject: boolean;
  teamsAmount: number;
  technicalSpecifications?: string;
  active: boolean;
  id: string;
  companyName: string;
}

interface ProjectQueryResponse {
  projects: Project[];
}

export type GetProjectResponse = ApolloQueryResult<ProjectQueryResponse>;

import { FetchResult } from '@apollo/client';

export interface Student {
  id: string;
  groupId?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  telegram?: string;
  resumePdf?: string;
  year: number;
  firstPriority?: number;
  secondPriority?: number;
  thirdPriority?: number;
  otherPriorities?: string;
  resumeLink?: string;
  desiredRole?: string;
}

interface DeleteStudent {
  deleteStudent: Student;
}

export type DeleteStudentResponse = FetchResult<DeleteStudent>;

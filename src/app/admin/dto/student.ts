export interface Student {
  id: string;
  groupId?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  telegram?: string;
  year: number;
  firstPriority?: number;
  secondPriority?: number;
  thirdPriority?: number;
  otherPriorities?: string;
}

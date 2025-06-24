import { Project } from '@/api/dto';

export interface ProjectWithRecommendation extends Project {
  matchPercentage: number;
}

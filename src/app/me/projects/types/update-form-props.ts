import { Project } from '@/api/dto';

export interface UpdateProjectFormProps {
  project: Project;
  onSuccess?: () => void;
}

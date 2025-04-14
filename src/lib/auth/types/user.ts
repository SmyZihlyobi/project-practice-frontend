import { Roles } from '@/lib/constant/roles';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: Roles[];
  username?: string;
  is_student_company?: boolean;
}

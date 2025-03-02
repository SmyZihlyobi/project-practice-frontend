export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string[];
  is_student_company?: boolean;
}

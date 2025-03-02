export interface JwtPayload {
  sub: string;
  iss: string;
  roles: string[];
  name: string;
  is_student_company: boolean;
  id: number;
  email: string;
  iat: number;
  exp: number;
}

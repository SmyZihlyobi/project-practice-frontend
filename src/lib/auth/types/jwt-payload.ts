import { User } from './user';

export interface JwtPayload extends User {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

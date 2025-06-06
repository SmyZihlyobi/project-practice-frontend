'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useContext,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '../constant';
import { AuthContextType, JwtPayload, User } from './types';
import { Roles } from '../constant/roles';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    Cookies.remove(JWT_COOKIE_NAME);
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get(JWT_COOKIE_NAME);
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          Cookies.remove(JWT_COOKIE_NAME);
          setUser(null);
        } else {
          setUser({
            id: String(decoded.id),
            email: decoded.email,
            name: decoded.name,
            username: decoded.username,
            roles: decoded.roles as Roles[],
            is_student_company: decoded.is_student_company,
            userExpire: decoded.exp,
            companyName: decoded.companyName,
          });
        }
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
        Cookies.remove(JWT_COOKIE_NAME);
      }
    }
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

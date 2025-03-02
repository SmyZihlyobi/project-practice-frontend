import { ReactNode } from 'react';

export interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string | string[];
}

import { Roles } from '@/lib/constant/roles';
import { ReactNode } from 'react';

export interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole: Roles | Roles[];
}

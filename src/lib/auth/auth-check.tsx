'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from './use-auth';

interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string | string[];
}

export function AuthCheck({ children, fallback, requiredRole }: AuthCheckProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!requiredRole) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push(`/companies/login`);
      return;
    }

    if (!isLoading && isAuthenticated && user?.role) {
      const userRoles = user.role;

      const hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.some(role => userRoles.includes(role))
        : userRoles.includes(requiredRole);

      if (!hasRequiredRole) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, router, requiredRole, user]);

  if (isLoading) {
    return fallback ? <>{fallback}</> : <div>Загрузка...</div>;
  }

  if (!requiredRole) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role) {
    const userRoles = user.role;

    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.some(role => userRoles.includes(role))
      : userRoles.includes(requiredRole);

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}

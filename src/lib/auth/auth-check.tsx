'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { LOGIN_PATH } from '../constant';
import { useAuth } from './use-auth';
import { AuthCheckProps } from './types';

export function AuthCheck({ children, fallback, requiredRole }: AuthCheckProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const hasRequiredRole = useCallback(() => {
    if (!requiredRole || !user?.role) return true;

    const userRoles = user.role;
    return Array.isArray(requiredRole)
      ? requiredRole.some(role => userRoles.includes(role))
      : userRoles.includes(requiredRole);
  }, [requiredRole, user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(LOGIN_PATH);
    } else if (!isLoading && isAuthenticated && !hasRequiredRole()) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router, hasRequiredRole]);

  if (isLoading) {
    return fallback ? <>{fallback}</> : <div>Загрузка...</div>;
  }

  if (!isAuthenticated || !hasRequiredRole()) {
    return null;
  }

  return <>{children}</>;
}

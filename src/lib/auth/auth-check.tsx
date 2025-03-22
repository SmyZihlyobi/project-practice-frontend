'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { LOGIN_PATH } from '../constant';
import { useAuth } from './use-auth';
import { AuthCheckProps } from './types';
import { DefaultAuthFallback } from './default-auth-fallback';

export function AuthCheck({ children, fallback, requiredRole }: AuthCheckProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const resolvedFallback = useMemo(() => {
    return fallback || <DefaultAuthFallback requiredRole={requiredRole} />;
  }, [fallback, requiredRole]);

  const hasRequiredRole = useCallback(() => {
    if (!requiredRole || !user?.roles) return true;

    const userRoles = user.roles;
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

  if (isLoading || !isAuthenticated || !hasRequiredRole()) {
    return <>{resolvedFallback}</>;
  }

  return <>{children}</>;
}

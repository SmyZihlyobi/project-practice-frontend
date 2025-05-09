'use client';
import { useAuth } from '@/lib/auth/use-auth';
import { CompanySettings } from './companies';
import { Roles } from '@/lib/constant/roles';

export function Settings() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите для доступа к настройкам</div>;
  }

  const isCompany = user?.roles.includes(Roles.Company || Roles.Admin);

  return <>{isCompany && <CompanySettings />}</>;
}

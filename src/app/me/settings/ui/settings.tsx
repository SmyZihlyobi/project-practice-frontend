'use client';
import { useAuth } from '@/lib/auth/use-auth';
import { StudentSettings } from './student';
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

  const isStudent = user?.roles.includes(Roles.Student);
  const isCompany = user?.roles.includes(Roles.Company || Roles.Admin);

  return (
    <>
      {isStudent && <StudentSettings />}
      {isCompany && <CompanySettings />}
    </>
  );
}

'use client';
import { CompanyProjects } from './ui';
import { AuthCheck } from '@/lib/auth/auth-check';
import { Roles } from '@/lib/constant/roles';

export default function Page() {
  return (
    <AuthCheck requiredRole={Roles.Company}>
      <div>
        <div className="w-full max-w-7xl mx-auto p-4">
          <CompanyProjects />
        </div>
      </div>
    </AuthCheck>
  );
}

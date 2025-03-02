'use client';

import { AuthCheck } from '@/lib/auth/auth-check';
import { ReactNode } from 'react';

export default function JoinProjectLayout({ children }: { children: ReactNode }) {
  return (
    <AuthCheck
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
            <p>Для доступа к этой странице необходимо авторизоваться как студент</p>
          </div>
        </div>
      }
    >
      {children}
    </AuthCheck>
  );
}

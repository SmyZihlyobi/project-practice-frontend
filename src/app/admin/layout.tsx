import { AuthCheck } from '@/lib/auth/auth-check';
import Head from 'next/head';
import { ReactNode } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Panel</title>
      </Head>
      <AuthCheck
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Доступ запрещен</h2>
              <p>Для доступа к этой странице необходимо авторизоваться как студент</p>
            </div>
          </div>
        }
        requiredRole={'ROLE_ADMIN'}
      >
        {' '}
        {children}{' '}
      </AuthCheck>
    </>
  );
}

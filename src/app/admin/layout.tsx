import { AuthCheck } from '@/lib/auth/auth-check';
import { Roles } from '@/lib/constant/roles';
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
      <AuthCheck requiredRole={Roles.ROLE_ADMIN}>{children}</AuthCheck>
    </>
  );
}

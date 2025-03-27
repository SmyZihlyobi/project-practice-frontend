import { ReactNode } from 'react';

import { AuthCheck } from '@/lib/auth/auth-check';
import { Roles } from '@/lib/constant/roles';
import Head from 'next/head';

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
      <AuthCheck requiredRole={Roles.Admin}>{children}</AuthCheck>
    </>
  );
}

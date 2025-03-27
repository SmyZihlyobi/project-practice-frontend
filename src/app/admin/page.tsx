'use client';

import dynamic from 'next/dynamic';

const AdminProtectedPage = dynamic(() => import('./admin'), { ssr: false });

export default function Page() {
  return <AdminProtectedPage />;
}

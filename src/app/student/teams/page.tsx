'use client';

import dynamic from 'next/dynamic';

const TeamsProtectedPage = dynamic(() => import('./teams'), { ssr: false });

export default function Page() {
  return <TeamsProtectedPage />;
}

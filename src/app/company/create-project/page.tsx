'use client';

import dynamic from 'next/dynamic';

const CreateProjectPage = dynamic(() => import('./create-project'), { ssr: false });

export default function Page() {
  return <CreateProjectPage />;
}

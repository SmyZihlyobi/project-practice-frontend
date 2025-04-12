'use client';

import dynamic from 'next/dynamic';

const JoinProjectProtectedPage = dynamic(() => import('./join-project'), { ssr: false });

export default function Page() {
  return <JoinProjectProtectedPage />;
}

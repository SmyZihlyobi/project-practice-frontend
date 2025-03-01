'use client';
import * as React from 'react';

import Header from '@/components/ui/header';
export default function Home() {
  return (
    <div>
      <Header></Header>
      <div className="w-full md:w-1/2 mx-auto mt-5 mb-3 px-4">
        <h1 className="p-4">Я мейн страница</h1>
      </div>
    </div>
  );
}

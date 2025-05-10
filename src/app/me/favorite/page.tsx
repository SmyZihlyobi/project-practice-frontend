'use client';
import { FavoriteProjects } from '@/app/me/favorite/ui/favorites';

export default function Page() {
  return (
    <div>
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="md:col-span-4">
          <h2 className="text-xl pt-2 pb-3">Избранные проекты</h2>
          <FavoriteProjects />
        </div>
      </div>
    </div>
  );
}

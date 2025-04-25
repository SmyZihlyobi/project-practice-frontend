'use client';

import { Card } from '@/components/ui/card';
import Filter from '@/app/project/ui/filter';
import { FavoritesPage } from '@/app/me/favorite/ui/favorites';

export default function Page() {
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4">
              <Filter></Filter>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="p-4">
              <h2 className="text-xl pt-2 pb-3">Избранные проекты</h2>
              <FavoritesPage />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

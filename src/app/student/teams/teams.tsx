import { Card } from '@/components/ui/card';

import { Filter, Search, Teams, TeamsPagination } from './ui';

export default function TeamsPage() {
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4">
              <Filter />
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="p-4">
              <Search />
              <Teams />
            </Card>
            <Card className="p-4 mt-3">
              <TeamsPagination />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

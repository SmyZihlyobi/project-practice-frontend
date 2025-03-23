import { Card } from '@/components/ui/card';

import { AdminTabs } from './ui';
import { AllDeleteButton } from './ui/all-delete-button';
import { ExportButton } from './ui/export-button';

export default function AdminPage() {
  return (
    <div className="mt-4 w-full max-w-7xl mx-auto p-4">
      <Card className="p-4">
        <div className="flex justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold mb-4">Страница администратора</h2>
          <div className="flex flex-wrap gap-3">
            <ExportButton />
            <AllDeleteButton />
          </div>
        </div>

        <AdminTabs />
      </Card>
    </div>
  );
}

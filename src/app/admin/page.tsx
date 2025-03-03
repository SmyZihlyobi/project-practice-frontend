import { Card } from '@/components/ui/card';
import { AdminTabs } from './ui';
import { AuthCheck } from '@/lib/auth/auth-check';
import { AllDeleteButton } from './ui/all-delete-button';
import { ExportButton } from './ui/export-button';

export default function Page() {
  return (
    <AuthCheck
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Доступ запрещен</h2>
            <p>Для доступа к этой странице необходимо авторизоваться как студент</p>
          </div>
        </div>
      }
      requiredRole={'ROLE_ADMIN'}
    >
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
    </AuthCheck>
  );
}

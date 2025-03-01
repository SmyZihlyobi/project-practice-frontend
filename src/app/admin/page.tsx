import { Card } from '@/components/ui/card';
import { AdminTabs } from './ui';
import { Button } from '@/components/ui/button';
import { AuthCheck } from '@/lib/auth/auth-check';

export default function Page() {
  return (
    <AuthCheck
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
            <p>Для доступа к этой странице необходимо авторизоваться как студент</p>
          </div>
        </div>
      }
    >
      <div className="mt-4 w-full max-w-7xl mx-auto p-4">
        <Card className="p-4">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-4">Страница администратора</h2>
            <Button variant="destructive">Очистить</Button>
          </div>

          <AdminTabs />
        </Card>
      </div>
    </AuthCheck>
  );
}

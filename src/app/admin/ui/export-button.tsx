'use client';

import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store';
import { toast } from 'sonner';

export const ExportButton = () => {
  const { isLoading } = useAdminStore;

  const handleDownload = async () => {
    try {
      const fileBlob = await useAdminStore.loadExelFile();

      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;

      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const fileName = `students_export_${day}_${month}_${year}.xlsx`;

      a.download = fileName;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Файл успешно скачан');
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      toast.error('Не удалось скачать файл');
    }
  };

  return (
    <Button variant="positive" onClick={handleDownload} disabled={isLoading}>
      {isLoading ? 'Скачивание...' : 'Скачать данные студентов'}
    </Button>
  );
};

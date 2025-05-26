'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCompaniesStore, useProjectStore, useTeamsStore } from '@/store';
import { useState } from 'react';
import { Bomb } from 'lucide-react';

export const AllDeleteButton = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const projectStore = useProjectStore;
  const teamsStore = useTeamsStore;
  const companiesStore = useCompaniesStore;

  const { deleteAllStudents, deleteAllTeams, deleteAllResume } = teamsStore;
  const { deleteAllCompanies } = companiesStore;
  const {
    deleteAllProjects,
    deleteAllPresentations,
    deleteAllTechnicalSpecification,
    archiveAllProject,
  } = projectStore;

  const handleDeleteClick = (action: string) => {
    setSelectedAction(action);
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedAction) return;

    switch (selectedAction) {
      case 'студентов':
        deleteAllStudents();
        break;
      case 'компаний':
        deleteAllCompanies();
        break;
      case 'проектов':
        deleteAllProjects();
        break;
      case 'команд':
        deleteAllTeams();
        break;
      case 'презентаций':
        deleteAllPresentations();
        break;
      case 'резюме':
        deleteAllResume();
        break;
      case 'тех. спецификаций':
        deleteAllTechnicalSpecification();
        break;
      case 'архив':
        archiveAllProject();
        break;
      default:
        console.error('Не выбрано действие');
        break;
    }

    setIsConfirmationOpen(false);
    setSelectedAction(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="max-md:mb-1">
          Очистить
          <Bomb />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Что будем очищать</DialogTitle>
          <DialogDescription>Эти данные будут удалены!</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button variant="destructive" onClick={() => handleDeleteClick('студентов')}>
            Удаление студентов
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteClick('компаний')}>
            Удаление компаний
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteClick('проектов')}>
            Удаление проектов
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteClick('команд')}>
            Удаление команд
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteClick('презентаций')}>
            Удаление презентаций
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteClick('резюме')}>
            Удаление резюме
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteClick('тех. спецификаций')}
          >
            Удаление тех. спецификаций
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteClick('архив')}>
            Архивировать все проекты
          </Button>
        </div>
      </DialogContent>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Вы уверены?</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить {selectedAction}? Это действие нельзя
              отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

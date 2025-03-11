'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../store';
import { DeleteProject } from './delete-project';
import { Markdown } from '@/components/ui/markdown';
import { PRESENTATION_API, TECHNICAL_SPECIFICATION_API } from '../../../lib/constant';

export const Project = observer(({ id }: { id: string }) => {
  const { projectStore } = useAdminStore;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setIsLoading(true);
      projectStore.getProject(id).finally(() => setIsLoading(false));
    }
  }, [id, projectStore, isExpanded]);

  const currentProject = projectStore.projects.find(project => project.id === id);
  if (!currentProject) {
    return null;
  }

  const renderSkeletonRow = (rowsCount: number, columnsCount: number) => {
    return Array.from({ length: rowsCount }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columnsCount }).map((_, colIndex) => (
          <TableCell key={colIndex} className="w-1/4">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <AccordionItem
      key={currentProject.id}
      value={currentProject.id}
      onClick={() => setIsExpanded(true)}
    >
      <AccordionTrigger>
        <div className="w-full flex justify-between mr-4">
          {isLoading ? (
            <Skeleton className="h-6 w-1/4" />
          ) : (
            <span className="font-medium">{currentProject.name}</span>
          )}
          {currentProject.studentProject && (
            <span className="text-sm text-muted-foreground">Студенческий проект</span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Презентация</TableHead>
              <TableHead className="w-1/4">Количество мест</TableHead>
              <TableHead className="w-1/4">ТЗ</TableHead>
              <TableHead className="w-1/4">Стек</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRow(1, 4)
            ) : (
              <TableRow>
                <TableCell>
                  {currentProject.presentation ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${PRESENTATION_API}/${currentProject.presentation}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Скачать
                    </a>
                  ) : (
                    'Не прикреплено'
                  )}
                </TableCell>
                <TableCell>{currentProject.teamsAmount}</TableCell>
                <TableCell>
                  {currentProject.technicalSpecifications ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${TECHNICAL_SPECIFICATION_API}/${currentProject.technicalSpecifications}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Скачать
                    </a>
                  ) : (
                    'Не прикреплено'
                  )}
                </TableCell>
                <TableCell>{currentProject.stack}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {isLoading ? (
          <Skeleton className="h-20 w-full mt-4" />
        ) : (
          <Markdown text={currentProject.description || ''} />
        )}
        {!isLoading && (
          <div className="w-full flex gap-2 mt-4">
            <DeleteProject id={currentProject.id} />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
});

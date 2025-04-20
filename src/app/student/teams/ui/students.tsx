'use client';

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StudentsProps } from '../types';
import { useTeamsStore } from '@/store';

export const Students = observer((props: StudentsProps) => {
  const { id } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const teamStore = useTeamsStore;
  const { getTeam } = teamStore;

  useEffect(() => {
    if (isExpanded) {
      getTeam(id);
    }
  }, [isExpanded, id, getTeam]);

  const currentTeam = teamStore.currentTeams.find(team => team.id === id);
  if (!currentTeam) {
    return null;
  }

  const { name, students } = currentTeam;

  const renderSkeleton = () => <Skeleton className="h-4 w-full mt-3" />;

  return (
    <AccordionItem value={id}>
      <AccordionTrigger onClick={() => setIsExpanded(!isExpanded)}>
        <span className="font-medium">{name}</span>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/6">ФИО</TableHead>
              <TableHead className="w-1/12">Курс</TableHead>
              <TableHead className="w-1/6">Телеграм</TableHead>
              <TableHead className="w-1/6">Резюме PDF</TableHead>
              <TableHead className="w-1/6">Резюме HH.ru</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell className="w-2/6">
                  {student.firstName && student.lastName
                    ? `${student.firstName} ${student.lastName}`
                    : renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/12">
                  {student.year ? student.year : renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/6">
                  {student.telegram ? (
                    <a href={student.telegram} target="_blank" rel="noopener noreferrer">
                      Перейти
                    </a>
                  ) : (
                    renderSkeleton()
                  )}
                </TableCell>
                <TableCell className="w-1/6">
                  {student.resumePdf ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/resume/${student.resumePdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Скачать
                    </a>
                  ) : (
                    'Не прикреплено'
                  )}
                </TableCell>
                <TableCell className="w-1/6">
                  {student.resumeLink ? (
                    <a
                      href={student.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Просмотреть
                    </a>
                  ) : (
                    'Не прикреплено'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );
});

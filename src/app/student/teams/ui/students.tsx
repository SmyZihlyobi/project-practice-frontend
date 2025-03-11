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
import { StudentsProps } from '../types';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTeamStore } from '../store/team-store';

export const Students = observer((props: StudentsProps) => {
  const { id } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const teamStore = useTeamStore;

  useEffect(() => {
    if (isExpanded) {
      setIsLoading(true);
      teamStore.getTeam(id).finally(() => setIsLoading(false));
    }
  }, [isExpanded, id, teamStore]);

  const currentTeam = teamStore.currentTeams.find(team => team.id === id);
  if (!currentTeam) {
    return null;
  }

  const { name, students } = currentTeam;

  const renderSkeletonRow = (rowsCount: number, columnsCount: number) => {
    return Array.from({ length: rowsCount }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columnsCount }).map((_, colIndex) => (
          <TableCell
            key={colIndex}
            className={colIndex === 0 ? 'w-2/6' : colIndex === 1 ? 'w-1/12' : 'w-1/6'}
          >
            <Skeleton className="h-4 w-full mt-3" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

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
            {isLoading
              ? renderSkeletonRow(5, 5)
              : students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="w-2/6">{`${student.firstName} ${student.lastName}`}</TableCell>
                    <TableCell className="w-1/12">{student.year}</TableCell>
                    <TableCell className="w-1/6">
                      <a
                        href={student.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Перейти
                      </a>
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

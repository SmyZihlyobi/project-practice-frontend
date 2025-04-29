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
import { StudentsProps } from '../../../types';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeleteStudent } from './delete-student';
import { DeleteTeam } from './delete-team';
import { useTeamsStore } from '@/store';

export const Students = observer((props: StudentsProps) => {
  const { id } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const teamStore = useTeamsStore;
  const { getCurrentTeam, getTeam } = teamStore;

  useEffect(() => {
    if (isExpanded) {
      getTeam(id);
    }
  }, [isExpanded, id, getTeam]);

  const currentTeam = getCurrentTeam(id);
  if (!currentTeam) {
    return null;
  }

  const { name, students } = currentTeam;

  const fio = (firstName?: string, lastName?: string, patronymic?: string): string => {
    return [firstName, lastName, patronymic].filter(Boolean).join(' ') || '';
  };

  const renderSkeleton = () => <Skeleton className="h-4 w-full" />;

  const renderLinkSkeleton = () => <Skeleton className="h-4 w-16" />;

  return (
    <AccordionItem value={id}>
      <AccordionTrigger onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-full flex justify-between mr-4">
          {name ? (
            <span className="font-medium">{name}</span>
          ) : (
            <Skeleton className="h-6 w-1/4" />
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="w-2/6 border-r">
                ФИО
              </TableHead>
              <TableHead rowSpan={2} className="w-1/12 border-r">
                Курс
              </TableHead>
              <TableHead rowSpan={2} className="w-1/6 border-r">
                Группа
              </TableHead>
              <TableHead rowSpan={2} className="w-1/6 border-r">
                Телеграм
              </TableHead>
              <TableHead colSpan={4} className="w-1/3 text-center border-b">
                Приоритеты
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-1/12 border-r">1</TableHead>
              <TableHead className="w-1/12 border-r">2</TableHead>
              <TableHead className="w-1/12 border-r">3</TableHead>
              <TableHead className="w-1/12">Остальные</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell className="w-2/6 border-r">
                  {fio(student.firstName, student.lastName, student.patronymic) ||
                    renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/12 border-r">
                  {student.year ?? renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/6 border-r">
                  {student.groupId ?? renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/6 border-r">
                  {student.telegram ? (
                    <a href={student.telegram} target="_blank" rel="noopener noreferrer">
                      Перейти
                    </a>
                  ) : (
                    renderLinkSkeleton()
                  )}
                </TableCell>
                <TableCell className="w-1/12 border-r">
                  {student.firstPriority ?? renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/12 border-r">
                  {student.secondPriority ?? renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/12 border-r">
                  {student.thirdPriority ?? renderSkeleton()}
                </TableCell>
                <TableCell className="w-1/12">{student.otherPriorities}</TableCell>
                <TableCell className="w-1/12">
                  <DeleteStudent
                    fio={fio(student.firstName, student.lastName, student.patronymic)}
                    id={student.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DeleteTeam id={id} />
      </AccordionContent>
    </AccordionItem>
  );
});

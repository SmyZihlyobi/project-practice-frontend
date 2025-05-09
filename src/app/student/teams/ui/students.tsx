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
import { CircleOff } from 'lucide-react';

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
    <AccordionItem value={id} className="border rounded-lg overflow-hidden mb-4">
      <AccordionTrigger
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 hover:no-underline transition-colors"
      >
        <span className="font-medium ">{name}</span>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <div>
          <Table className="border-collapse">
            <TableHeader className="bg-accent">
              <TableRow className="border-b border-t-0">
                <TableHead className="w-2/6 border-r px-4 py-3 font-medium">
                  ФИО
                </TableHead>
                <TableHead className="w-[6%] border-r px-4 py-3  font-medium">
                  Курс
                </TableHead>
                <TableHead className="w-[10%] border-r px-4 py-3  font-medium">
                  Телеграм
                </TableHead>
                <TableHead className="w-1/12 border-r px-4 py-3 text-center font-medium">
                  Роль
                </TableHead>
                <TableHead className="w-1/6 border-r px-4 py-3  font-medium">
                  Резюме PDF
                </TableHead>
                <TableHead className="w-1/6 px-4 py-3  font-medium">
                  Резюме HH.ru
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id} className="border-b transition-colors">
                  <TableCell className="w-2/6 border-r px-4 py-3">
                    {student.firstName && student.lastName
                      ? `${student.firstName} ${student.lastName}`
                      : renderSkeleton()}
                  </TableCell>
                  <TableCell className="w-[6%] border-r px-4 py-3">
                    {student.year ? student.year : renderSkeleton()}
                  </TableCell>
                  <TableCell className="w-[10%] border-r px-4 py-3">
                    {student.telegram ? (
                      <a
                        href={student.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Перейти
                      </a>
                    ) : (
                      renderSkeleton()
                    )}
                  </TableCell>
                  <TableCell className="w-1/12 border-r px-4 py-3 text-center">
                    {student.desiredRole ? (
                      <span className="px-2 py-1 rounded-md text-sm">
                        {student.desiredRole}
                      </span>
                    ) : (
                      <div className="flex justify-center">
                        <CircleOff className="text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="w-1/6 border-r px-4 py-3">
                    {student.resumePdf ? (
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/resume/${student.resumePdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Скачать
                      </a>
                    ) : (
                      <div className="flex items-center justify-center lg:justify-start">
                        <CircleOff className="lg:hidden text-muted-foreground" />
                        <p className="hidden lg:block text-muted-foreground">
                          Не прикреплено
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="w-1/6 px-4 py-3">
                    {student.resumeLink ? (
                      <a
                        href={student.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Просмотреть
                      </a>
                    ) : (
                      <div className="flex items-center justify-center lg:justify-start">
                        <CircleOff className="lg:hidden text-muted-foreground" />
                        <p className="hidden lg:block text-muted-foreground">
                          Не прикреплено
                        </p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

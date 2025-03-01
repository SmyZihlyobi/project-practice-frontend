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
import { StudentsProps } from '../../../types';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../store';
import { DeleteStudent } from './delete-student';
import { DeleteTeam } from './delete-team';

export const Students = observer((props: StudentsProps) => {
  const { id } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const { teamStore } = useAdminStore;

  useEffect(() => {
    if (isExpanded) {
      teamStore.getTeam(id);
    }
  }, [isExpanded, id, teamStore]);

  const currentTeam = teamStore.teams.find(team => team.id === id);
  if (!currentTeam) {
    return null;
  }

  const { name, students } = currentTeam;

  const fio = (firstName?: string, lastName?: string, patronymic?: string): string => {
    return [firstName, lastName, patronymic].join(' ');
  };

  return (
    <AccordionItem value={id}>
      <AccordionTrigger onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-full flex justify-between mr-4">
          <span className="font-medium">{name}</span>
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
                  {fio(student.firstName, student.lastName, student.patronymic)}
                </TableCell>
                <TableCell className="w-1/12 border-r">{student.year}</TableCell>
                <TableCell className="w-1/6 border-r">{student.groupId}</TableCell>
                <TableCell className="w-1/6 border-r">
                  <a href={student.telegram} target="_blank" rel="noopener noreferrer">
                    Перейти
                  </a>
                </TableCell>
                <TableCell className="w-1/12 border-r">{student.firstPriority}</TableCell>
                <TableCell className="w-1/12 border-r">
                  {student.secondPriority}
                </TableCell>
                <TableCell className="w-1/12 border-r">{student.thirdPriority}</TableCell>
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

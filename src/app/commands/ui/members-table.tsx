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

const members = [
  {
    id: 123,
    name: 'Малков Иван',
    course: 2,
    telegram: '@tme/IvanMalkS',
    resumePDF: 'link',
    resumeLink: 'link',
  },
  {
    id: 122133,
    name: 'Дранков Александр',
    course: 2,
    telegram: '@tme/demorganbtw',
    resumePDF: 'link',
    resumeLink: 'link',
  },
  {
    id: 12133,
    name: 'Коновалов Владимер',
    course: 2,
    telegram: '@tme/aero327',
  },
];

export const CommandItem = ({ id, commandName }: { id: number; commandName: string }) => {
  return (
    <AccordionItem value={String(id)}>
      <AccordionTrigger>{commandName}</AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>Курс</TableHead>
              <TableHead>Телеграм</TableHead>
              <TableHead>Резюме PDF</TableHead>
              <TableHead>Резюме HH.ru</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.course}</TableCell>
                <TableCell>{member.telegram}</TableCell>
                <TableCell>
                  {member.resumePDF ? (
                    <a href={member.resumePDF} target="_blank" rel="noopener noreferrer">
                      Скачать
                    </a>
                  ) : (
                    'Не прикреплено'
                  )}
                </TableCell>
                <TableCell>
                  {member.resumeLink ? (
                    <a href={member.resumeLink} target="_blank" rel="noopener noreferrer">
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
};

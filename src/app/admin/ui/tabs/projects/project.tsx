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
import { observer } from 'mobx-react-lite';
import { Markdown } from '@/components/ui/markdown';
import { PRESENTATION_API, TECHNICAL_SPECIFICATION_API } from '@/lib/constant';
import { useProjectStore } from '@/store';
import { DeleteProjectButton } from '@/components/ui/delete-project-button';
import { ToggleArchiveProject } from '@/components/ui/toggle-archive-project';

export const Project = observer(({ id }: { id: string }) => {
  const projectStore = useProjectStore;
  const { getProjects } = projectStore;
  const projects = getProjects();

  const currentProject = projects.find(project => project.id === id);

  if (!currentProject) {
    return null;
  }

  return (
    <AccordionItem key={currentProject.id} value={currentProject.id}>
      <AccordionTrigger>
        <div className="w-full flex justify-between mr-4">
          <span className="font-medium">{currentProject.name}</span>
          {!currentProject.active && (
            <span className="text-sm text-muted-foreground">Архивный</span>
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
          </TableBody>
        </Table>
        <Markdown text={currentProject.description || ''} />
        <div className="w-full flex gap-2 mt-4">
          <DeleteProjectButton id={currentProject.id} />
          <ToggleArchiveProject id={currentProject.id} active={currentProject.active} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

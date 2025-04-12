'use client';

import React, { useEffect, useState } from 'react';

import { PRESENTATION_API, TECHNICAL_SPECIFICATION_API } from '@/app/admin/lib/constant';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Markdown } from '@/components/ui/markdown';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { observer } from 'mobx-react-lite';

import { useProjectStore } from '../store/project-store';
import { ProjectPagination } from './project-pagination';
import { Search } from './search';

export const Projects = observer(() => {
  const { paginatedProjects, getProjects } = useProjectStore;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    useProjectStore.getProjects().finally(() => {
      useProjectStore.getStackItems();
      setIsLoading(false);
    });
  }, [getProjects]);
  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className="gap-3 flex-col flex">
      <Search></Search>
      {paginatedProjects.map(project => (
        <Card key={project.id}>
          <CardHeader className="flex flex-row w-full items-center justify-between">
            <h2 className="text-lg  font-semibold">{project.name}</h2>
            <h2 className="text-m !m-0 text-muted">
              {!project.active && 'Архивный проект'}
            </h2>
            <h2 className="text-m !m-0">
              {project.studentProject ? 'Студенческий' : `От компании id=${project.id}`}
            </h2>
          </CardHeader>
          <CardContent className="gap-2 flex flex-col">
            <span>{'Количество команд: ' + project.teamsAmount}</span>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="text">
                <AccordionTrigger>Описание проекта ↓</AccordionTrigger>
                <AccordionContent className="mt-3">
                  <Markdown text={project.description || ' '}></Markdown>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <span className="w-full">
              {'Технический стек: ' + project.stack.toLowerCase()}
            </span>
            <div className="w-full flex flex-col gap-2 sm:flex-row justify-between border-dashed border-2 p-3 rounded-xl l">
              <Button className="sm:w-5/12 w-full sm:text-m">
                {project.technicalSpecifications ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${TECHNICAL_SPECIFICATION_API}/${project.technicalSpecifications}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Скачать тех. задание
                  </a>
                ) : (
                  'Не прикреплено'
                )}
              </Button>
              <Button className="sm:w-5/12 w-full sm:text-m">
                {project.technicalSpecifications ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${PRESENTATION_API}/${project.presentation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Скачать презентацию
                  </a>
                ) : (
                  'Не прикреплено'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <ProjectPagination></ProjectPagination>
    </div>
  );
});

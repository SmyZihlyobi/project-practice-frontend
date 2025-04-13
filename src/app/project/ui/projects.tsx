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
import { useAuth } from '@/lib/auth/use-auth';
import { FavoriteToggle } from './favorite-toggle';
import { Skeleton } from '@/components/ui/skeleton';

export const Projects = observer(() => {
  const {
    paginatedProjects,
    getProjects,
    getFavoriteProjects,
    currentProjects,
    preLoad,
    getStackItems,
  } = useProjectStore;

  const { user, isAuthenticated } = useAuth();

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    setIsLoadingProjects(true);
    preLoad();
    getProjects().finally(() => {
      getStackItems();
      setIsLoadingProjects(false);
    });
  }, [getProjects, preLoad, getStackItems]);

  useEffect(() => {
    if (isAuthenticated && user) {
      getFavoriteProjects(user.id);
    }
  }, [getFavoriteProjects, isAuthenticated, user]);

  if (isLoadingProjects || currentProjects.length === 0) {
    return (
      <div className="gap-3 flex-col flex">
        <Search />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-[282px] w-[890px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="gap-3 flex-col flex">
      <Search></Search>
      {paginatedProjects.map(project => (
        <Card key={project.id}>
          <CardHeader className="flex flex-row w-full items-center justify-between">
            <h2 className="text-lg w-1/3  font-semibold">{project.name}</h2>
            <h2 className="text-m !m-0 text-muted">
              {!project.active && 'Архивный проект'}
            </h2>
            <h2 className="text-m !m-0 flex items-center gap-1">
              {project.studentProject ? (
                'Студенческий'
              ) : (
                <div className="flex flex-col">
                  <p>От компании: {project.companyName}</p>{' '}
                  <p>ID проекта: {project.id}</p>
                </div>
              )}
              <FavoriteToggle projectId={project.id} />
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

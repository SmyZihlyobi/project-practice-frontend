'use client';

import { useEffect } from 'react';
import { PRESENTATION_API, TECHNICAL_SPECIFICATION_API } from '@/lib/constant';
import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Markdown } from '@/components/ui/markdown';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { observer } from 'mobx-react-lite';

import { ProjectPagination } from './project-pagination';
import { Search } from './search';
import { useAuth } from '@/lib/auth/use-auth';
import { FavoriteToggle } from './favorite-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import classNames from 'classnames';
import { useProjectStore } from '@/store';

export const Projects = observer(() => {
  const {
    paginatedProjects,
    fetchProjects,
    getFavoriteProjects,
    getStackItems,
    getIsCacheLoaded,
    currentProjects,
  } = useProjectStore;

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProjects().finally(() => {
      getStackItems();
    });
  }, [fetchProjects, getStackItems]);

  useEffect(() => {
    if (isAuthenticated && user) {
      getFavoriteProjects(user.id);
    }
  }, [getFavoriteProjects, isAuthenticated, user]);

  if (!getIsCacheLoaded) {
    return (
      <div className="gap-3 flex-col flex">
        <Search />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-[282px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (currentProjects.length < 1) {
    return (
      <div className="h-[182px] w-full rounded-xl flex items-center justify-center text-lg">
        <div className="w-max"> Нет проектов по заданному запросу</div>
      </div>
    );
  }

  return (
    <div className="gap-2 md:gap-3 flex-col flex">
      <Search></Search>
      {paginatedProjects.map(project => (
        <Card
          key={project.id}
          className={classNames(
            'relative overflow-hidden',
            !project.active &&
              'before:absolute before:inset-0 before:bg-gradient-to-b before:from-red-500/10 before:to-transparent before:z-0',
          )}
        >
          <CardHeader className="flex flex-col md:flex-row w-full items-center justify-between">
            <h2 className="text-lg w-full text-center md:text-left md:w-1/3  font-semibold">
              {project.name}
            </h2>
            <h2 className="text-m !m-0">{!project.active && 'Архивный проект'}</h2>
            <h2 className="text-m w-full md:w-1/3 text-center  !m-0 flex items-center gap-1 justify-center md:justify-end">
              {project.studentProject ? (
                'Студенческий'
              ) : (
                <div className="flex  flex-col ">
                  <p>От компании: {project.companyName}</p>{' '}
                  {project.active && <p>ID проекта: {project.id}</p>}
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
            {project.technicalSpecifications || project.presentation ? (
              <div className="w-full flex flex-col gap-2 text-center sm:flex-row justify-between border-dashed border-2 p-3 rounded-xl l">
                {project.technicalSpecifications ? (
                  <a
                    className='class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 sm:w-5/12 w-full sm:text-m"'
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${TECHNICAL_SPECIFICATION_API}/${project.technicalSpecifications}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Скачать тех. задание
                  </a>
                ) : null}
                {project.presentation ? (
                  <a
                    className='class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 sm:w-5/12 w-full sm:text-m"'
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${PRESENTATION_API}/${project.presentation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Скачать презентацию
                  </a>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
      <ProjectPagination></ProjectPagination>
    </div>
  );
});

'use client';

import { useEffect, useState } from 'react';
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

import { Search } from './search';
import { useAuth } from '@/lib/auth/use-auth';
import { FavoriteToggle } from './favorite-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import classNames from 'classnames';
import { useProjectStore } from '@/store';
import { Compass, FileText, Presentation, Users } from 'lucide-react';
import { Roles } from '@/lib/constant/roles';
import { ProjectWithRecommendation } from '@/app/project/types';

export const Projects = observer(() => {
  const {
    paginatedProjects,
    fetchProjects,
    getFavoriteProjects,
    getStackItems,
    getIsCacheLoaded,
    currentProjects,
    isFilteredByAIRecommendation,
  } = useProjectStore;

  const { user, isAuthenticated } = useAuth();
  const [aiRecommendedProjects, setAiRecommendedProjects] = useState<
    ProjectWithRecommendation[]
  >([]);
  const [aiRecommendationsInitialized, setAiRecommendationsInitialized] = useState(false);

  const displayProjects = isFilteredByAIRecommendation
    ? aiRecommendedProjects
    : paginatedProjects;

  const getBorderColor = (percentage: number) => {
    const hue = 30 + (120 - 30) * (percentage / 100);
    return `hsl(${hue}, 70%, 50%)`;
  };

  useEffect(() => {
    fetchProjects().finally(() => {
      getStackItems();
    });
  }, [fetchProjects, getStackItems]);

  useEffect(() => {
    if (isAuthenticated && user && user.roles.includes(Roles.Student)) {
      getFavoriteProjects(user.id);
    }
  }, [getFavoriteProjects, isAuthenticated, user]);

  useEffect(() => {
    if (!aiRecommendationsInitialized && currentProjects.length > 0) {
      const storageKey = user?.id
        ? `aiRecommendations_${user.id}`
        : 'aiRecommendations_anonymous';
      const savedRecommendations = localStorage.getItem(storageKey);

      if (savedRecommendations) {
        try {
          setAiRecommendedProjects(JSON.parse(savedRecommendations));
        } catch (e) {
          console.error('Ошибка при загрузке рекомендаций из localStorage', e);
          generateAndSaveRecommendations(storageKey);
        }
      } else {
        generateAndSaveRecommendations(storageKey);
      }

      setAiRecommendationsInitialized(true);
    }
  }, [currentProjects, user, aiRecommendationsInitialized]);

  const generateAndSaveRecommendations = (storageKey: string) => {
    if (currentProjects.length === 0) return;

    const shuffledProjects = [...currentProjects].sort(() => 0.5 - Math.random());
    const selectedProjects = shuffledProjects.slice(0, 5);

    const projectsWithRecommendations = selectedProjects.map(project => ({
      ...project,
      matchPercentage: Math.floor(Math.random() * 51) + 50,
    }));

    projectsWithRecommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    setAiRecommendedProjects(projectsWithRecommendations);
    localStorage.setItem(storageKey, JSON.stringify(projectsWithRecommendations));
  };

  let content = null;

  if (!getIsCacheLoaded) {
    content = (
      <>
        <Search />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-[282px] w-full rounded-xl" />
        ))}
      </>
    );
  } else if (currentProjects.length < 1) {
    content = (
      <div className="h-[182px] w-full rounded-xl flex items-center justify-center text-lg">
        <div className="w-max">Нет проектов по заданному запросу</div>
      </div>
    );
  } else {
    content = (
      <>
        {displayProjects.map(project => {
          const matchPercentage =
            'matchPercentage' in project
              ? (project as ProjectWithRecommendation).matchPercentage
              : null;

          return (
            <Card
              key={project.id}
              className={classNames(
                'relative overflow-hidden border border-muted bg-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]',
                !project.active && 'bg-gradient-to-b from-red-500/10 to-transparent',
              )}
              style={{
                borderWidth: matchPercentage ? '2px' : '1px',

                borderColor: matchPercentage
                  ? getBorderColor(matchPercentage)
                  : 'hsl(var(--border))',
                boxShadow: matchPercentage ? `0px 0px 100px ${getBorderColor}` : `none`,
              }}
            >
              <CardHeader className="flex flex-col text-center md:flex-row w-full items-start justify-between">
                <h2 className="text-lg w-full md:text-left md:w-1/3 font-semibold">
                  {project.name}
                </h2>
                <h2 className="text-m">{!project.active && 'Архивный проект'}</h2>
                <h2 className="text-m w-full md:w-1/3 !m-0 flex items-start gap-1 justify-center md:justify-end md:items-center">
                  {project.studentProject ? (
                    'Студенческий'
                  ) : (
                    <div className="flex items-center flex-col">
                      {project.companyLink ? (
                        <a
                          href={project.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="text-blue-700">
                            От компании: {project.companyName}
                          </p>
                        </a>
                      ) : (
                        <p>От компании: {project.companyName}</p>
                      )}
                      {project.active && <p>ID проекта: {project.id}</p>}
                    </div>
                  )}
                  <FavoriteToggle projectId={project.id} />
                </h2>
              </CardHeader>
              <CardContent className="gap-2 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Количество мест:</span>
                      <span>{project.teamsAmount}</span>
                    </div>

                    {project.direction && (
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Направление:</span>
                        <span>{project.direction}</span>
                      </div>
                    )}
                  </div>

                  {project.requiredRoles && (
                    <div className="flex gap-2">
                      <span className="font-medium">Ищем:</span>
                      <div className="flex flex-wrap gap-1">
                        {project.requiredRoles.split(',').map((role, index) => (
                          <span
                            key={index}
                            className="inline-flex h-max items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          >
                            {role.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="text">
                    <AccordionTrigger>Описание проекта ↓</AccordionTrigger>
                    <AccordionContent className="mt-3 text-muted-foreground text-sm leading-relaxed">
                      <Markdown text={project.description || ' '}></Markdown>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <span className="w-full">
                  {'Технический стек: ' + project.stack.toLowerCase()}
                </span>
                <span className="font-medium text-xs">
                  {matchPercentage && (
                    <div className="bg-background rounded-md text-base z-10">
                      Подходит вам на: {matchPercentage}%
                    </div>
                  )}
                </span>
                {project.technicalSpecifications || project.presentation ? (
                  <div className="w-full flex flex-col gap-2 text-center sm:flex-row justify-between border-dashed border-2 p-3 rounded-xl">
                    {project.technicalSpecifications ? (
                      <a
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 sm:w-5/12 w-full"
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${TECHNICAL_SPECIFICATION_API}/${project.technicalSpecifications}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Скачать тех. задание</span>
                      </a>
                    ) : null}
                    {project.presentation ? (
                      <a
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 sm:w-5/12 w-full"
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${PRESENTATION_API}/${project.presentation}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Presentation className="h-4 w-4" />
                        <span>Скачать презентацию</span>
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </>
    );
  }

  return <div className="gap-2 md:gap-3 flex-col flex">{content}</div>;
});

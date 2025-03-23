'use client';

import { Accordion } from '@/components/ui/accordion';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../store';
import { Project } from './project';
import { Skeleton } from '@/components/ui/skeleton';

export const Projects = observer(() => {
  const { projectStore } = useAdminStore;
  const { projects } = projectStore;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    projectStore.getProjects().finally(() => setIsLoading(false));
  }, [projectStore]);

  const renderSkeletonRow = (rowsCount: number, columnsCount: number) => {
    return Array.from({ length: rowsCount }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex flex-col space-y-2 mb-4">
        {Array.from({ length: columnsCount }).map((_, colIndex) => (
          <Skeleton key={colIndex} className={'h-10 w-full'} />
        ))}
      </div>
    ));
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Список проектов</h2>
      {isLoading ? (
        renderSkeletonRow(5, 1)
      ) : projects.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {projects.map(project => (
            <Project key={project.id} id={project.id} />
          ))}
        </Accordion>
      )}
    </>
  );
});

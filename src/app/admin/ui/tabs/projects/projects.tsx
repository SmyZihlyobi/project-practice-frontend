'use client';

import { Accordion } from '@/components/ui/accordion';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useAdminStore } from '../../../store';
import { Project } from './project';

export const Projects = observer(() => {
  const { projectStore } = useAdminStore;
  const { projects } = projectStore;

  useEffect(() => {
    projectStore.getProjects();
  }, [projectStore]);

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Список компаний</h2>
      {projects.length === 0 ? (
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

import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store';
import { ArchiveRestore, ArchiveX } from 'lucide-react';
import { observer } from 'mobx-react-lite';

export interface ToggleArchiveProps {
  id: string;
  active: boolean;
}

export const ToggleArchiveProject = observer((props: ToggleArchiveProps) => {
  const { id } = props;
  const projectStore = useProjectStore;
  const projects = projectStore.getProjects();
  const currentProject = projects.find(project => project.id === id);
  if (!currentProject) {
    return null;
  }

  const active = currentProject.active;

  const toggleHandler = (): void => {
    if (active) {
      projectStore.archiveProject(id);
      return;
    }
    projectStore.unarchiveProject(id);
  };

  return (
    <Button
      variant={active ? 'destructive' : 'positive'}
      onClick={toggleHandler}
      className="w-full mt-6"
    >
      {active ? (
        <p className="flex gap-1 items-center">
          <ArchiveX /> Архивировать
        </p>
      ) : (
        <p className="flex gap-1 items-center">
          <ArchiveRestore /> Вернуть
        </p>
      )}
    </Button>
  );
});

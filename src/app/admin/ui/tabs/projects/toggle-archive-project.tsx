import { ToggleArchiveProps } from '@/app/admin/types';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store';
import { observer } from 'mobx-react-lite';

export const ToggleArchiveProject = observer((props: ToggleArchiveProps) => {
  const { id, active } = props;
  const projectStore = useProjectStore;

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
      {active ? 'Архивировать' : 'Вернуть'}
    </Button>
  );
});

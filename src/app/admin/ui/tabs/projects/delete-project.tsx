'use client';

import { observer } from 'mobx-react-lite';
import { useAdminStore } from '../../../store';
import { Button } from '@/components/ui/button';
import { DeleteProjectProps } from '../../../types';

export const DeleteProject = observer((props: DeleteProjectProps) => {
  const { id } = props;
  const { projectStore } = useAdminStore;

  return (
    <Button
      variant="destructive"
      onClick={() => projectStore.deleteProject(id)}
      className="w-full mt-6"
    >
      Удалить
    </Button>
  );
});

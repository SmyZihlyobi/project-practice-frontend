'use client';

import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { DeleteProjectProps } from '../../../types';
import { useProjectStore } from '@/store';

export const DeleteProject = observer((props: DeleteProjectProps) => {
  const { id } = props;
  const projectStore = useProjectStore;

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

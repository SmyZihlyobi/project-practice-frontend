'use client';

export interface DeleteProjectProps {
  id: string;
}

import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store';
import { Trash } from 'lucide-react';

export const DeleteProjectButton = observer((props: DeleteProjectProps) => {
  const { id } = props;
  const projectStore = useProjectStore;

  return (
    <Button
      variant="destructive"
      onClick={() => projectStore.deleteProject(id)}
      className="w-full mt-6"
    >
      <Trash />
      Удалить
    </Button>
  );
});

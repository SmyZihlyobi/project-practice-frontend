'use client';

import { observer } from 'mobx-react-lite';
import { DeleteButton } from '../../delete-button';
import { useAdminStore } from '../../../store';

export const DeleteStudent = observer(({ fio, id }: { fio: string; id: string }) => {
  const { teamStore } = useAdminStore;

  return (
    <DeleteButton
      tooltip={`Удалить студента: ${fio} ?`}
      onClick={() => teamStore.deleteStudent(id)}
      className="w-6 h-6"
    />
  );
});

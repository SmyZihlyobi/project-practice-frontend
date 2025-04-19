'use client';

import { observer } from 'mobx-react-lite';
import { DeleteButton } from '../../delete-button';
import { DeleteStudentProps } from '@/app/admin/types';
import { useTeamsStore } from '@/store';

export const DeleteStudent = observer((props: DeleteStudentProps) => {
  const { fio, id } = props;
  const teamStore = useTeamsStore;
  const { deleteStudent } = teamStore;

  return (
    <DeleteButton
      tooltip={`Удалить студента: ${fio} ?`}
      onClick={() => deleteStudent(id)}
      className="w-6 h-6"
    />
  );
});

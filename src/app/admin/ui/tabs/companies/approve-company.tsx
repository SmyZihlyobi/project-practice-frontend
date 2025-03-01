'use client';

import { observer } from 'mobx-react-lite';
import { DeleteButton } from '../../delete-button';
import { useAdminStore } from '../../../store';
import { DeleteStudentProps } from '@/app/admin/types';

export const ApproveCompony = observer((props: DeleteStudentProps) => {
  const { fio, id } = props;
  const { teamStore } = useAdminStore;

  return (
    <DeleteButton
      tooltip={`Удалить студента: ${fio} ?`}
      onClick={() => teamStore.deleteStudent(id)}
      className="w-6 h-6"
    />
  );
});

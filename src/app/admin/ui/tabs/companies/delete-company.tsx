'use client';

import { observer } from 'mobx-react-lite';
import { useAdminStore } from '../../../store';
import { Button } from '@/components/ui/button';
import { DeleteTeamProps } from '@/app/admin/types';

export const DeleteCompany = observer((props: DeleteTeamProps) => {
  const { id } = props;
  const { teamStore } = useAdminStore;
  const { undecidedTeamId } = teamStore;

  return (
    <Button
      variant="destructive"
      onClick={() => teamStore.deleteTeam(id)}
      className="w-full mt-6"
      disabled={id === undecidedTeamId}
    >
      Расформировать
    </Button>
  );
});

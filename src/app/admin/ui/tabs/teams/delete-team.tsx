'use client';

import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { DeleteTeamProps } from '@/app/admin/types';
import { useTeamsStore } from '@/store';

export const DeleteTeam = observer((props: DeleteTeamProps) => {
  const { id } = props;
  const teamStore = useTeamsStore;
  const { getUndecidedTeamId, deleteTeam } = teamStore;
  const undecidedTeamId = getUndecidedTeamId();
  return (
    <Button
      variant="destructive"
      onClick={() => deleteTeam(id)}
      className="w-full mt-6"
      disabled={id === undecidedTeamId}
    >
      Расформировать
    </Button>
  );
});

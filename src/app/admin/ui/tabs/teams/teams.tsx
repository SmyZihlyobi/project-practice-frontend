'use client';

import { Accordion } from '@/components/ui/accordion';
import { Students } from './students';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useAdminStore } from '../../../store';

export const Teams = observer(() => {
  const { teamStore } = useAdminStore;
  const { teams } = teamStore;

  useEffect(() => {
    teamStore.getTeams();
  }, [teamStore]);

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Список команд</h2>
      {teams.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {teams.map(team => (
            <Students key={team.id} id={team.id} />
          ))}
        </Accordion>
      )}
    </>
  );
});

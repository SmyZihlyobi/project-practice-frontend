'use client';

import { Accordion } from '@/components/ui/accordion';
import { Students } from './students';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTeamStore } from '../store/team-store';
import { Card } from '@/components/ui/card';

export const Teams = observer(() => {
  const { getTeams, currentTeams } = useTeamStore;

  useEffect(() => {
    useTeamStore.getTeams();
  }, [getTeams]);

  return (
    <Card className="p-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">Список команд</h2>
      {currentTeams.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {currentTeams.map(team => (
            <Students key={team.id} id={team.id} />
          ))}
        </Accordion>
      )}
    </Card>
  );
});

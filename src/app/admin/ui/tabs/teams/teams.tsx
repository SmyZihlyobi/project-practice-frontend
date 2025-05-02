'use client';

import { Accordion } from '@/components/ui/accordion';
import { Students } from './students';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeamsStore } from '@/store';

export const Teams = observer(() => {
  const teamsStore = useTeamsStore;
  const { getTeams, fetchTeams, getIsCachedLoaded } = teamsStore;

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const isCachedLoaded = getIsCachedLoaded();
  const teams = getTeams();

  const renderSkeletonRow = (rowsCount: number, columnsCount: number) => {
    return Array.from({ length: rowsCount }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex flex-col space-y-2 mb-4">
        {Array.from({ length: columnsCount }).map((_, colIndex) => (
          <Skeleton key={colIndex} className={'h-10 w-full'} />
        ))}
      </div>
    ));
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Список команд</h2>
      {!isCachedLoaded ? (
        renderSkeletonRow(5, 1)
      ) : teams.length === 0 ? (
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

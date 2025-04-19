'use client';

import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Students } from './students';
import { useTeamsStore } from '@/store';

export const Teams = observer(() => {
  const { fetchTeams, currentTeamsPage, getIsCachedLoaded } = useTeamsStore;

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const isCachedLoaded = getIsCachedLoaded();

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
    <Card className="p-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">Список команд</h2>
      {isCachedLoaded ? (
        renderSkeletonRow(5, 1)
      ) : currentTeamsPage.length === 0 ? (
        <div className="text-center py-6">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {currentTeamsPage.map(team => (
            <Students key={team.id} id={team.id} />
          ))}
        </Accordion>
      )}
    </Card>
  );
});

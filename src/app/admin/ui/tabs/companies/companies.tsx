'use client';

import { Accordion } from '@/components/ui/accordion';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Company } from './company';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompaniesStore } from '@/store';

export const Companies = observer(() => {
  const companiesStore = useCompaniesStore;
  const { getCompanies, fetchCompanies, getIsCacheLoaded } = companiesStore;

  const companies = getCompanies();
  const isCachedLoaded = getIsCacheLoaded();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
      <h2 className="text-lg font-semibold mb-4">Список компаний</h2>
      {isCachedLoaded ? (
        renderSkeletonRow(5, 1)
      ) : companies.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {companies.map(company => (
            <Company key={company.id} id={company.id} />
          ))}
        </Accordion>
      )}
    </>
  );
});

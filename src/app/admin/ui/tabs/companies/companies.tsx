'use client';

import { Accordion } from '@/components/ui/accordion';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useAdminStore } from '../../../store';
import { Company } from './company';

export const Companies = observer(() => {
  const { companiesStore } = useAdminStore;
  const { companies } = companiesStore;

  useEffect(() => {
    companiesStore.getCompanies();
  }, [companiesStore]);

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Список компаний</h2>
      {companies.length === 0 ? (
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

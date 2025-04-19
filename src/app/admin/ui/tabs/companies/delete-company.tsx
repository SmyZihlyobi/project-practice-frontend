'use client';

import { observer } from 'mobx-react-lite';

import { Button } from '@/components/ui/button';
import { DeleteCompanyProps } from '../../../types';
import { useCompaniesStore } from '@/store';

export const DeleteCompany = observer((props: DeleteCompanyProps) => {
  const { id } = props;
  const companiesStore = useCompaniesStore;
  const { getCurrentAdminId } = companiesStore;
  const currentAdminId = getCurrentAdminId();

  return (
    <Button
      variant="destructive"
      onClick={() => companiesStore.deleteCompany(id)}
      className="w-full mt-6"
      disabled={id === currentAdminId}
    >
      Удалить
    </Button>
  );
});

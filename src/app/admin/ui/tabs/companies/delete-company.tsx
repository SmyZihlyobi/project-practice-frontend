'use client';

import { observer } from 'mobx-react-lite';
import { useAdminStore } from '../../../store';
import { Button } from '@/components/ui/button';
import { DeleteCompanyProps } from '../../../types';

export const DeleteCompany = observer((props: DeleteCompanyProps) => {
  const { id } = props;
  const { companiesStore } = useAdminStore;
  const { currentAdminId } = companiesStore;

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

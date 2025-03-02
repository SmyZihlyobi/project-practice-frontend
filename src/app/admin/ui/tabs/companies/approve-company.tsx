'use client';

import { observer } from 'mobx-react-lite';
import { useAdminStore } from '../../../store';
import { DeleteCompanyProps } from '../../../types';
import { Button } from '@/components/ui/button';

export const ApproveCompony = observer((props: DeleteCompanyProps) => {
  const { id } = props;
  const { companiesStore } = useAdminStore;

  return (
    <Button
      variant="positive"
      onClick={() => companiesStore.approveCompany(id)}
      className="w-full mt-6"
    >
      Одобрить
    </Button>
  );
});

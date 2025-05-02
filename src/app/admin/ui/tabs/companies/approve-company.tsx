'use client';

import { observer } from 'mobx-react-lite';
import { DeleteCompanyProps } from '../../../types';
import { Button } from '@/components/ui/button';
import { useCompaniesStore } from '@/store';

export const ApproveCompany = observer((props: DeleteCompanyProps) => {
  const { id } = props;
  const companiesStore = useCompaniesStore;
  const { approveCompany } = companiesStore;
  return (
    <Button variant="positive" onClick={() => approveCompany(id)} className="w-full mt-6">
      Одобрить
    </Button>
  );
});

'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../store';
import { ApproveCompony } from './approve-company';
import { DeleteCompany } from './delete-company';

export const Company = observer(({ id }: { id: string }) => {
  const { companiesStore } = useAdminStore;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      companiesStore.getCompany(id);
    }
  }, [id, companiesStore, isExpanded]);

  const currentCompany = companiesStore.companies.find(company => company.id === id);
  console.log(currentCompany);
  if (!currentCompany) {
    return null;
  }

  return (
    <AccordionItem
      key={currentCompany.id}
      value={currentCompany.id}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <AccordionTrigger>
        <div className="w-full flex justify-between mr-4">
          <span className="font-medium">{currentCompany.name}</span>
          {currentCompany.studentCompany && (
            <span className="text-sm text-muted-foreground">Студенческая компания</span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Название</TableHead>
              <TableHead className="w-1/3">Email</TableHead>
              <TableHead className="w-1/3">Представитель</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{currentCompany.name}</TableCell>
              <TableCell>{currentCompany.email || 'Не указан'}</TableCell>
              <TableCell>{currentCompany.representative || 'Не указан'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="w-full flex gap-2 mt-4">
          <DeleteCompany id={currentCompany.id} />
          {!currentCompany.isApproved && <ApproveCompony id={currentCompany.id} />}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

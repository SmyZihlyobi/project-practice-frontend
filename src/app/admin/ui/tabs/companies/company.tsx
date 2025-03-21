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
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../store';
import { ApproveCompony } from './approve-company';
import { DeleteCompany } from './delete-company';

export const Company = observer(({ id }: { id: string }) => {
  const { companiesStore } = useAdminStore;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setIsLoading(true);
      companiesStore.getCompany(id).finally(() => setIsLoading(false));
    }
  }, [id, companiesStore, isExpanded]);

  const currentCompany = companiesStore.companies.find(company => company.id === id);
  if (!currentCompany) {
    return null;
  }
  const renderSkeletonRow = (rowsCount: number, columnsCount: number) => {
    return Array.from({ length: rowsCount }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columnsCount }).map((_, colIndex) => (
          <TableCell key={colIndex} className="w-1/3">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <AccordionItem
      key={currentCompany.id}
      value={currentCompany.id}
      onClick={() => setIsExpanded(true)}
    >
      <AccordionTrigger>
        <div className="w-full flex justify-between mr-4">
          {isLoading ? (
            <Skeleton className="h-6 w-1/4" />
          ) : (
            <span className="font-medium">{currentCompany.name}</span>
          )}
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
              <TableHead className="w-1/3">Контакты</TableHead>
              <TableHead className="w-1/3">Представитель</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRow(1, 3)
            ) : (
              <TableRow>
                <TableCell>{currentCompany.name}</TableCell>
                <TableCell>{currentCompany.contacts}</TableCell>
                <TableCell>{currentCompany.representative}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading && (
          <div className="w-full flex gap-2 mt-4">
            <DeleteCompany id={currentCompany.id} />
            {!currentCompany.isApproved && <ApproveCompony id={currentCompany.id} />}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
});

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
import { DeleteCompany } from './delete-company';
import { useCompaniesStore } from '@/store';
import { ApproveCompany } from './approve-company';

export const Company = observer(({ id }: { id: string }) => {
  const companiesStore = useCompaniesStore;
  const [isExpanded, setIsExpanded] = useState(false);

  const { fetchCompany, getCurrentCompany } = companiesStore;

  useEffect(() => {
    if (isExpanded) {
      fetchCompany(id);
    }
  }, [id, fetchCompany, isExpanded]);

  const currentCompany = getCurrentCompany(id);
  if (!currentCompany) {
    return null;
  }

  const renderSkeleton = () => <Skeleton className="h-4 w-full" />;

  return (
    <AccordionItem
      key={currentCompany.id}
      value={currentCompany.id}
      onClick={() => setIsExpanded(true)}
    >
      <AccordionTrigger>
        <div className="w-full flex justify-between mr-4">
          {currentCompany.name ? (
            <>
              <span className="font-medium">{currentCompany.name}</span>
              {currentCompany.studentCompany && (
                <span className="text-sm text-muted-foreground">
                  Студенческая компания
                </span>
              )}
            </>
          ) : (
            <Skeleton className="h-6 w-1/4" />
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
            <TableRow>
              <TableCell className="w-1/3">
                {currentCompany.name || renderSkeleton()}
              </TableCell>
              <TableCell className="w-1/3">
                {currentCompany.contacts || renderSkeleton()}
              </TableCell>
              <TableCell className="w-1/3">
                {currentCompany.representative || renderSkeleton()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="w-full flex gap-2 mt-4">
          <DeleteCompany id={currentCompany.id} />
          {!currentCompany.isApproved && <ApproveCompany id={currentCompany.id} />}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

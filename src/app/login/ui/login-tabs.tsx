'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentsForm } from '@/app/login/ui/tabs/students/students-form';
import { CompaniesForm } from '@/app/login/ui/tabs/companies/companies-form';

export const LoginTabs = () => {
  return (
    <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <Tabs
          defaultValue="student"
          className="flex flex-col items-center justify-center"
        >
          <TabsList className="w-full ">
            <TabsTrigger value="student" className="w-1/2 text-base">
              Студент
            </TabsTrigger>
            <TabsTrigger value="company" className="w-1/2 text-base">
              Компания
            </TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <h2 className="mb-2 text-xl">Вход</h2>
            <StudentsForm />
          </TabsContent>
          <TabsContent value="company">
            <h2 className="mb-2 text-xl">Вход для компаний</h2>
            <CompaniesForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

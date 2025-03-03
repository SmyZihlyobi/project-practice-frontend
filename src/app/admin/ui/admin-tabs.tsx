'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamsTab, CompaniesTab, ProjectsTab } from './tabs';
import { useEffect, useState } from 'react';
import { LOCALSTORAGE_NAME } from '../lib/constant';

export const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(LOCALSTORAGE_NAME) || 'teams';
  });

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_NAME, activeTab);
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex">
        <TabsTrigger value="teams">Команды</TabsTrigger>
        <TabsTrigger value="companies">Компании</TabsTrigger>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
      </TabsList>
      <TabsContent value="teams">
        <TeamsTab />
      </TabsContent>
      <TabsContent value="companies">
        <CompaniesTab />
      </TabsContent>
      <TabsContent value="projects">
        <ProjectsTab />
      </TabsContent>
    </Tabs>
  );
};

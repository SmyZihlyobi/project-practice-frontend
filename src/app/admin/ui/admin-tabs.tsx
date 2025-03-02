import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamsTab, CompaniesTab, ProjectsTab } from './tabs';

export const AdminTabs = () => {
  return (
    <Tabs defaultValue="teams" className="w-full">
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

'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useState } from 'react';
import { LoginStudentForm } from './tabs/students';
import { LoginCompanyForm } from './tabs/companies';

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'company'>('student');

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Tabs
              defaultValue="student"
              className="w-full"
              onValueChange={value => setActiveTab(value as 'student' | 'company')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Студент</TabsTrigger>
                <TabsTrigger value="company">Компания</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <LoginStudentForm className="mt-4" />
              </TabsContent>
              <TabsContent value="company">
                <LoginCompanyForm className="mt-4" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          width={400}
          height={400}
          src={
            activeTab === 'student'
              ? '/images/login/students.jpg'
              : '/images/login/companies.jpg'
          }
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

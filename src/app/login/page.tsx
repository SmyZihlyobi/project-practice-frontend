'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_FORM_VALUES_COMPANY,
  LOCALSTORAGE_NAME_COMPANY,
} from './lib/constant_company';
import { useEffect, useState } from 'react';
import { COMPANY_LOGIN_FORM_SCHEMA } from '@/app/login/lib/constant_company/company-login-form-schema';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useAxios } from '@/lib';
import { JwtResponse } from './dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  DEFAULT_FORM_VALUES_STUDENT,
  LOCALSTORAGE_NAME_STUDENT,
} from './lib/constant_student';
import { STUDENT_LOGIN_FORM_SCHEMA } from '@/app/login/lib/constant_student/student-login-form-schema';

export default function Page() {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const form_company = useForm<z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(COMPANY_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES_COMPANY,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME_COMPANY);
    if (savedData) {
      form_company.reset(JSON.parse(savedData));
    }
  }, [form_company]);

  useEffect(() => {
    const subscription = form_company.watch(value => {
      const { ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME_COMPANY, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [form_company]);

  const onFormSubmitCOM = async (
    data: z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await api.post<JwtResponse>('/company/login', data);

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      console.log(response);
      localStorage.removeItem(LOCALSTORAGE_NAME_COMPANY);
      form_company.reset(DEFAULT_FORM_VALUES_COMPANY);
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  //student
  const form_student = useForm<z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(STUDENT_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES_STUDENT,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME_STUDENT);
    if (savedData) {
      form_student.reset(JSON.parse(savedData));
    }
  }, [form_student]);

  useEffect(() => {
    const subscription = form_student.watch(value => {
      const { ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME_STUDENT, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [form_student]);

  const onFormSubmitST = async (
    data: z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      // to-do переписать на запрос под бек
      console.log(data);
      localStorage.removeItem(LOCALSTORAGE_NAME_STUDENT);
      form_student.reset(DEFAULT_FORM_VALUES_STUDENT);
    } catch (error) {
      console.error(error);
      // to-do обработать ошибки
    } finally {
      setIsLoading(false);
    }
  };

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
            <Form {...form_student}>
              <form
                onSubmit={form_student.handleSubmit(onFormSubmitST)}
                className="flex flex-col gap-4 w-full"
              >
                <div className="space-y-4">
                  <FormField
                    control={form_student.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Логин</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_student.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  Войти
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="company">
            <h2 className="mb-2 text-xl">Вход для компаний</h2>
            <Form {...form_company}>
              <form
                onSubmit={form_company.handleSubmit(onFormSubmitCOM)}
                className="flex flex-col gap-4 w-full"
              >
                <div className="space-y-4">
                  <FormField
                    control={form_company.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>e-mail</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_company.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  Войти
                </Button>
                <Link
                  href={{
                    pathname: '/company/registration-project',
                  }}
                  className="mt-4 w-full flex justify-center"
                >
                  Регистрация
                </Link>
                <Link
                  href={{
                    pathname: '/company/reset-password',
                  }}
                  className="mt-4 w-full flex justify-center"
                >
                  Забыли пароль?
                </Link>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

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
  COMPANY_LOGIN_FORM_SCHEMA,
} from './lib/constant/company';
import { useEffect, useState } from 'react';
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
  STUDENT_LOGIN_FORM_SCHEMA,
} from './lib/constant/student';
import { Recaptcha } from '@/components/ui/recaptсha';
import { toast } from 'sonner';

export default function Page() {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompanyRecaptchaConfirmed, setIsCompanyRecaptchaConfirmed] =
    useState<boolean>(false);
  const [isStudentRecaptchaConfirmed, setIsStudentRecaptchaConfirmed] =
    useState<boolean>(false);

  const formCompany = useForm<z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(COMPANY_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES_COMPANY,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME_COMPANY);
    if (savedData) {
      formCompany.reset(JSON.parse(savedData));
    }
  }, [formCompany]);

  useEffect(() => {
    const subscription = formCompany.watch(value => {
      const { ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME_COMPANY, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [formCompany]);

  const onFormSubmitCOM = async (
    data: z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await api.post<JwtResponse>('/company/login', data);

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      console.log(response);
      localStorage.removeItem(LOCALSTORAGE_NAME_COMPANY);
      formCompany.reset(DEFAULT_FORM_VALUES_COMPANY);
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
      toast.success('Вы успешно вошли как компания');
    }
  };

  //student
  const formStudent = useForm<z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(STUDENT_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES_STUDENT,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME_STUDENT);
    if (savedData) {
      formStudent.reset(JSON.parse(savedData));
    }
  }, [formStudent]);

  useEffect(() => {
    const subscription = formStudent.watch(value => {
      const { ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME_STUDENT, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [formStudent]);

  const onFormSubmitST = async (
    data: z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      // to-do переписать на запрос под бек
      console.log(data);
      localStorage.removeItem(LOCALSTORAGE_NAME_STUDENT);
      formStudent.reset(DEFAULT_FORM_VALUES_STUDENT);
    } catch (error) {
      console.error(error);
      // to-do обработать ошибки
    } finally {
      setIsLoading(false);
      toast.success('Вы успешно вошли как студент');
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
            <Form {...formStudent}>
              <form
                onSubmit={formStudent.handleSubmit(onFormSubmitST)}
                className="flex flex-col gap-4 w-full"
              >
                <div className="space-y-4">
                  <FormField
                    control={formStudent.control}
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
                    control={formStudent.control}
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
                <Recaptcha
                  onChange={isVerified => setIsStudentRecaptchaConfirmed(isVerified)}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !isStudentRecaptchaConfirmed}
                  className="w-full md:w-auto"
                >
                  Войти
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="company">
            <h2 className="mb-2 text-xl">Вход для компаний</h2>
            <Form {...formCompany}>
              <form
                onSubmit={formCompany.handleSubmit(onFormSubmitCOM)}
                className="flex flex-col gap-4 w-full"
              >
                <div className="space-y-4">
                  <FormField
                    control={formCompany.control}
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
                    control={formCompany.control}
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
                <Recaptcha
                  onChange={isVerified => setIsCompanyRecaptchaConfirmed(isVerified)}
                />

                <Button
                  type="submit"
                  disabled={isLoading || !isCompanyRecaptchaConfirmed}
                  className="w-full md:w-auto"
                >
                  Войти
                </Button>
                <Link
                  href={{
                    pathname: '/company/registration-company',
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

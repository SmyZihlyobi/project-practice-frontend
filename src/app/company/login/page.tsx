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
import { DEFAULT_FORM_VALUES, LOCALSTORAGE_NAME } from './lib/constant';
import { useEffect, useState } from 'react';
import { COMPANY_LOGIN_FORM_SCHEMA } from '@/app/company/login/lib/constant/company-login-form-schema';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useAxios } from '@/lib';
import { JwtResponse } from './dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';

export default function Page() {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(COMPANY_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME);
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(value => {
      const { ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onFormSubmit = async (
    data: z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await api.post<JwtResponse>('/company/login', data);

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      console.log(response);
      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <h2 className="mb-2 text-xl">Вход для компаний</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                pathname: '/student/login',
              }}
              className="mt-12 w-1/4
                    border border-bg-primary hover:border-primary rounded
                   pl-2 pr-2 pt-2 pb-2"
            >
              Вход для студентов
            </Link>
            <Link
              href={{
                pathname: '/',
              }}
              className="mt-4 w-full flex justify-center"
            >
              На главную
            </Link>
          </form>
        </Form>
      </Card>
      <Link
        href={{
          pathname: '/company/reset-password',
        }}
        className="mt-4 w-1/2 flex justify-center"
      >
        Забыли пароль?
      </Link>
    </div>
  );
}

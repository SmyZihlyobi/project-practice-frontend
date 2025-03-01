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
import { useEffect, useState, useRef } from 'react';
import { COMPANY_LOGIN_FORM_SCHEMA } from '@/app/company/login/lib/constant/company-login-form-schema';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const response = await fetch('/company/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;

        localStorage.setItem('authToken', token);

        console.log('Login successful, token:', token);
      } else {
        console.error('Login failed');
      }

      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <h2 className="mb-2 text-xl">Смена пароля</h2>
        <h2 className="mb-2">На вашу почту придет новый пароль</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="login"
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
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              Отправить
            </Button>
            <div className="inline-flex">
              <Link
                href={{
                  pathname: '/company/login',
                }}
                className="mt-4 w-1/2 flex justify-center"
              >
                Назад
              </Link>
              <Link
                href={{
                  pathname: '/',
                }}
                className="mt-4 w-1/2 flex justify-center"
              >
                На главную
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

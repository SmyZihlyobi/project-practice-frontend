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
  DEFAULT_FORM_VALUES,
  LOCALSTORAGE_NAME,
} from '../registration-company/lib/constant';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { REGISTRATION_COMPANY_FORM_SCHEMA } from '@/app/company/registration-company/lib/constant/registration-company-form-schema';
import { Recaptcha } from '@/components/ui/recaptсha';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompanyRecaptchaConfirmed, setIsCompanyRecaptchaConfirmed] =
    useState<boolean>(false);
  const form = useForm<z.infer<typeof REGISTRATION_COMPANY_FORM_SCHEMA>>({
    resolver: zodResolver(REGISTRATION_COMPANY_FORM_SCHEMA),
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
    data: z.infer<typeof REGISTRATION_COMPANY_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      // to-do переписать на запрос под бек
      console.log(data);
      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);
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
        <h2 className="mb-2 text-xl">Заявка на регистрацию компании</h2>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название компании</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="representative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Представитель</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contacts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контакты (tg, vk, gmail)</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentProject"
                render={({}) => (
                  <FormItem>
                    <Checkbox></Checkbox>
                    <FormLabel className="ml-4">Студенческий проект</FormLabel>
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
              Зарегистрировать
            </Button>

            <Link
              href={{
                pathname: '/login',
              }}
              className="mt-4 w-full flex justify-center"
            >
              Назад
            </Link>
          </form>
        </Form>
      </Card>
    </div>
  );
}

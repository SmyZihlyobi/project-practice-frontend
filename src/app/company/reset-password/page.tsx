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
import { useEffect, useState } from 'react';
import { RESET_PASSWORD_FORM_SCHEMA } from '@/app/company/reset-password/lib/constant/reset-password-form-schema';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  DEFAULT_FORM_VALUES,
  LOCALSTORAGE_NAME,
} from '@/app/company/reset-password/lib/constant';
import { useAxios } from '@/lib';
import { JwtResponse } from './dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import { Recaptcha } from '@/components/ui/recaptсha';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecaptchaConfirmed, setIsRecaptchaConfirmed] = useState<boolean>(false);

  const api = useAxios();

  const form = useForm<z.infer<typeof RESET_PASSWORD_FORM_SCHEMA>>({
    resolver: zodResolver(RESET_PASSWORD_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME);
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  const onFormSubmit = async (
    data: z.infer<typeof RESET_PASSWORD_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await api.post<JwtResponse>('/company/change-password', data);

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      console.log(response);
      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);
    } catch (error) {
      console.error('Error during change password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /* еще логика*/
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
            </div>
            <Recaptcha onChange={isVerified => setIsRecaptchaConfirmed(isVerified)} />
            <Button
              type="submit"
              disabled={isLoading || !isRecaptchaConfirmed}
              className="w-full md:w-auto"
            >
              Отправить
            </Button>
            <div className="inline-flex">
              <Link
                href={{
                  pathname: '/login',
                }}
                className="mt-4 w-1/2 flex justify-center"
              >
                Назад
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

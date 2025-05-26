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
import { axiosInstance } from '@/lib/axios';
import { JwtResponse } from './api/dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import { Recaptcha } from '@/components/ui/recaptcha';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecaptchaConfirmed, setIsRecaptchaConfirmed] = useState(false);

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
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(data));

      const response = await axiosInstance.post<JwtResponse>(
        `/company/change-password?email=${data.email}`,
      );

      toast.success('Письмо отправлено!', {
        description: 'Новый пароль был отправлен на вашу электронную почту',
      });

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);
    } catch (error) {
      console.error('Error during change password:', error);
      toast.error('Ошибка отправки', {
        description: 'Проверьте правильность email и попробуйте снова',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-md mx-auto pt-20 px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/login" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Вернуться к входу
          </Link>
        </Button>

        <Card className="p-8 shadow-lg rounded-2xl">
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto w-fit p-4 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Сброс пароля</h1>
            <p className="text-muted-foreground">
              Введите email, связанный с вашим аккаунтом
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Рабочий email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="example@company.com"
                        className="h-12"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Recaptcha onChange={isVerified => setIsRecaptchaConfirmed(isVerified)} />

              <Button
                type="submit"
                disabled={isLoading || !isRecaptchaConfirmed}
                className="w-full h-12 bd-accent text-accent"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Отправить новый пароль'
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

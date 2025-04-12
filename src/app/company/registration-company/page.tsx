'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Recaptcha } from '@/components/ui/recaptсha';
import { ApolloError } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  DEFAULT_FORM_VALUES,
  ERROR_TOAST_DELAY,
  LOCALSTORAGE_NAME,
  REDIRECT_DELAY,
  REGISTRATION_COMPANY_FORM_SCHEMA,
} from '../registration-company/lib/constant';
import { CREATE_COMPANY_MUTATION } from './api/mutations';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompanyRecaptchaConfirmed, setIsCompanyRecaptchaConfirmed] =
    useState<boolean>(false);
  const [createCompany] = useMutation(CREATE_COMPANY_MUTATION);
  const router = useRouter();

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

      const result = await createCompany({
        variables: {
          name: data.name,
          representative: data.representative,
          email: data.email,
          contacts: data.contacts,
          studentProject: data.studentProject,
        },
      });

      if (result.errors) {
        throw new ApolloError({ graphQLErrors: result.errors });
      }

      form.reset(DEFAULT_FORM_VALUES);
      localStorage.removeItem(LOCALSTORAGE_NAME);

      toast.success('Заявка успешно отправлена. Дождитесь одобрения администратора');
      setTimeout(() => {
        router.push('/');
      }, REDIRECT_DELAY);
    } catch (error) {
      let errorMessage = 'Произошла ошибка при отправке формы';

      if (error instanceof ApolloError) {
        errorMessage =
          error.graphQLErrors?.[0]?.message ||
          error.message ||
          'Ошибка сервера при обработке запроса';

        if (error.graphQLErrors.some(e => e.message === 'Email already exist')) {
          errorMessage = 'Компания с таким email уже зарегистрирована';
        } else if (error.graphQLErrors.some(e => e.message === 'Validation error')) {
          errorMessage = 'Проверьте правильность введенных данных';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage, {
        duration: ERROR_TOAST_DELAY,
        action: {
          label: 'Повторить',
          onClick: () => onFormSubmit(data),
        },
      });
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
                render={({ field }) => (
                  <FormItem>
                    <Checkbox
                      className="mt-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
              {isLoading ? 'Отправка...' : 'Зарегистрировать'}
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

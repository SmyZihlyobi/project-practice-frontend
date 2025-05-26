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
import { Recaptcha } from '@/components/ui/recaptcha';
import { ApolloError } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { Building2, ArrowLeft, Loader2 } from 'lucide-react';
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

      toast.success('Заявка успешно отправлена', {
        description: 'Дождитесь одобрения администратора',
      });

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
    <div className="min-h-screen ">
      <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/login" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Вернуться к входу
          </Link>
        </Button>

        <Card className="p-8 shadow-lg rounded-2xl">
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto  w-fit p-4 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Заявка на регистрацию компании
            </h1>
            <p className="text-muted-foreground">Заполните данные для подачи заявки</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Рабочий email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="contact@company.com"
                          className="h-12"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
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
                        <Input
                          {...field}
                          placeholder="ООО «Рога и копыта»"
                          className="h-12"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
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
                        <Input
                          {...field}
                          placeholder="Иванов Иван Иванович"
                          className="h-12"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Контакты</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Telegram, Vkontakte или gmail"
                          className="h-12"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сайт компании</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://company.com"
                          className="h-12"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentProject"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-muted/50 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Студенческий проект</FormLabel>
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
                className="w-full h-12 "
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Подать заявку'
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

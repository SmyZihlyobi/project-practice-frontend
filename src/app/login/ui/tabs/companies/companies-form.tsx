'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Recaptcha } from '@/components/ui/recaptсha';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  COMPANY_LOGIN_FORM_SCHEMA,
  DEFAULT_FORM_VALUES_COMPANY,
  LOCALSTORAGE_NAME_COMPANY,
} from '@/app/login/lib/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAxios } from '@/lib';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { JwtResponse } from '@/app/login/dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';

export const CompaniesForm = () => {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const [isCompanyRecaptchaConfirmed, setIsCompanyRecaptchaConfirmed] =
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
      toast.success('Вы успешно вошли как компания');

      const response = await api.post<JwtResponse>('/company/login', data);

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      console.log(response);
      localStorage.removeItem(LOCALSTORAGE_NAME_COMPANY);
      formCompany.reset(DEFAULT_FORM_VALUES_COMPANY);

      setTimeout(() => {
        window.location.href = '/company/create-project';
      }, 500);
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <div className="relative">
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label="Password"
                      type={isVisible ? 'text' : 'password'}
                      className="w-full"
                    />
                  </FormControl>

                  <button
                    className="absolute top-8 end-0 flex items-center z-20 px-2.5 cursor-pointer rounded-e-md focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <Eye size={20} aria-hidden="true" />
                    ) : (
                      <EyeOff size={20} aria-hidden="true" />
                    )}
                  </button>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
        </div>
        <Recaptcha onChange={isVerified => setIsCompanyRecaptchaConfirmed(isVerified)} />

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
  );
};

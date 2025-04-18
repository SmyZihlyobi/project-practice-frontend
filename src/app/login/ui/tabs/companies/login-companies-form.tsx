import { Input } from '@/components/ui/input';
import cn from 'classnames';
import { Recaptcha } from '@/components/ui/recaptcha';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '@/lib/axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  COMPANY_LOGIN_FORM_SCHEMA,
  DEFAULT_FORM_VALUES_COMPANY,
} from '@/app/login/lib/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { JwtResponse } from '@/app/login/api/dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { AxiosError } from 'axios';

export function LoginCompanyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const [isCompanyRecaptchaConfirmed, setIsCompanyRecaptchaConfirmed] =
    useState<boolean>(false);

  const formCompany = useForm<z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(COMPANY_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES_COMPANY,
  });

  const onFormSubmitCOM = async (
    data: z.infer<typeof COMPANY_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post<JwtResponse>('/company/login', data);

      if (!response.data.token) {
        throw new Error('Неверный ответ сервера: отсутствует токен');
      }

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      formCompany.reset(DEFAULT_FORM_VALUES_COMPANY);
      toast.success('Вы успешно вошли!');

      setTimeout(() => {
        window.location.href = '/company/create-project';
      }, 500);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            'Произошла ошибка при входе';

          if (error.response.status === 401) {
            toast.error('Неверный email или пароль');
          } else if (error.response.status === 400) {
            toast.error('Некорректные данные');
          } else if (error.response.status >= 500) {
            toast.error('Ошибка сервера. Пожалуйста, попробуйте позже');
          } else {
            toast.error(errorMessage);
          }
        } else if (error.request) {
          toast.error('Не удалось подключиться к серверу. Проверьте интернет-соединение');
        } else {
          toast.error('Произошла ошибка при отправке запроса');
        }
      } else if (error instanceof Error) {
        toast.error(error.message || 'Произошла непредвиденная ошибка');
      } else {
        toast.error('Произошла неизвестная ошибка');
      }

      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (isVerified: boolean) => {
    setIsCompanyRecaptchaConfirmed(isVerified);
  };

  return (
    <Form {...formCompany}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={formCompany.handleSubmit(onFormSubmitCOM)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Вход для компаний</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Введите свои данные для входа
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={formCompany.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      {...field}
                      placeholder="m@example.com"
                      required
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={formCompany.control}
              name="password"
              render={({ field }) => (
                <div className="relative">
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Пароль</FormLabel>
                      <a
                        href="/company/reset-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Забыли пароль?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        aria-label="Password"
                        id="password"
                        type={isVisible ? 'text' : 'password'}
                        required
                        disabled={isLoading}
                      />
                    </FormControl>
                    <button
                      className="absolute top-7 end-0 flex items-center z-20 px-2.5 cursor-pointer rounded-e-md focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? 'Hide password' : 'Show password'}
                      aria-pressed={isVisible}
                      aria-controls="password"
                      disabled={isLoading}
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
          <div>
            <Recaptcha onChange={handleRecaptchaChange} />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !isCompanyRecaptchaConfirmed}
            className="w-full"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
          <div className="text-center text-sm">
            Нет аккаунта?{' '}
            <a
              href="/company/registration-company"
              className="underline underline-offset-4"
            >
              Зарегистрироваться
            </a>
          </div>
        </div>
      </form>
    </Form>
  );
}

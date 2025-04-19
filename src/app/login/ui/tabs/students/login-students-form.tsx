'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  DEFAULT_FORM_VALUES_STUDENT,
  STUDENT_LOGIN_FORM_SCHEMA,
} from '@/app/login/lib/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Recaptcha } from '@/components/ui/recaptcha';
import { Button } from '@/components/ui/button';
import cn from 'classnames';
import { axiosInstance } from '@/lib/axios';
import { JwtResponse } from '@/app/login/api/dto';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import { AxiosError } from 'axios';
import { Checkbox } from '@/components/ui/checkbox';

export function LoginStudentForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);
  const [isStudentRecaptchaConfirmed, setIsStudentRecaptchaConfirmed] =
    useState<boolean>(false);

  const formStudent = useForm<z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(STUDENT_LOGIN_FORM_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES_STUDENT,
  });

  const onFormSubmitST = async (
    data: z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const student = {
        username: data.login,
        password: data.password,
        rememberMe: data.rememberMe,
      };

      const response = await axiosInstance.post<JwtResponse>(
        '/student/register',
        student,
      );

      if (!response.data.token) {
        throw new Error('Неверный ответ сервера: отсутствует токен');
      }

      toast.success('Вы успешно вошли как студент');

      Cookies.set(JWT_COOKIE_NAME, response.data.token);
      formStudent.reset(DEFAULT_FORM_VALUES_STUDENT);

      // to-do , оно пока что будет кидать в личный кабинет ибо нет данных с онлайн псу
      setTimeout(() => {
        window.location.href = '/student/join-project';
      }, 500);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            'Произошла ошибка при входе';

          if (error.response.status === 400) {
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

  return (
    <Form {...formStudent}>
      <form
        className={cn('flex flex-col gap-6 pb-12', className)}
        onSubmit={formStudent.handleSubmit(onFormSubmitST)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Вход для студентов</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Введите свои данные для входа от{' '}
            <b className="text-primary-background">
              <a href="https://test.psu.ru/">test.psu.ru</a>
            </b>
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={formStudent.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="login">Логин</FormLabel>
                  <FormControl>
                    <Input id="login" placeholder="malki3" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={formStudent.control}
              name="password"
              render={({ field }) => (
                <div className="relative">
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Пароль</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        aria-label="Password"
                        type={isVisible ? 'text' : 'password'}
                        id="password"
                        required
                      />
                    </FormControl>
                    <button
                      className="absolute top-5 end-0 flex items-center z-20 px-2.5 cursor-pointer rounded-e-md focus:outline-none"
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
          <div className="grid gap-2">
            <FormField
              control={formStudent.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel htmlFor="remember-me" className="cursor-pointer">
                    Запомнить меня
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <Recaptcha
            onChange={isVerified => setIsStudentRecaptchaConfirmed(isVerified)}
          />
          <Button
            disabled={isLoading || !isStudentRecaptchaConfirmed}
            type="submit"
            className="w-full"
          >
            Войти
          </Button>
        </div>
      </form>
    </Form>
  );
}

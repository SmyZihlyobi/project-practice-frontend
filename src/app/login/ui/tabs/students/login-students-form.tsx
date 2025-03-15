'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  DEFAULT_FORM_VALUES_STUDENT,
  LOCALSTORAGE_NAME_STUDENT,
  STUDENT_LOGIN_FORM_SCHEMA,
} from '@/app/login/lib/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
import { Recaptcha } from '@/components/ui/recaptсha';
import { Button } from '@/components/ui/button';
import cn from 'classnames';

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

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_NAME_STUDENT);
    if (savedData) {
      formStudent.reset(JSON.parse(savedData));
    }
  }, [formStudent]);

  useEffect(() => {
    const subscription = formStudent.watch(value => {
      const { ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME_STUDENT, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [formStudent]);

  const onFormSubmitST = async (
    data: z.infer<typeof STUDENT_LOGIN_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      toast.success('Вы успешно вошли как студент');

      console.log(data);
      localStorage.removeItem(LOCALSTORAGE_NAME_STUDENT);
      formStudent.reset(DEFAULT_FORM_VALUES_STUDENT);

      // to-do , оно пока что будет кидать в личный кабинет ибо нет данных с онлайн псу
      setTimeout(() => {
        window.location.href = '/student/join-project';
      }, 500);
    } catch (error) {
      console.error(error);
      // to-do обработать ошибки
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...formStudent}>
      <form
        className={cn('flex flex-col gap-6', className)}
        onSubmit={formStudent.handleSubmit(onFormSubmitST)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Вход для студентов</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Введите свои данные для входа
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
                    <Input
                      id="login"
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                      required
                    />
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

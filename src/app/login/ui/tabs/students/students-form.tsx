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

export const StudentsForm = () => {
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
        onSubmit={formStudent.handleSubmit(onFormSubmitST)}
        className="flex flex-col gap-4 w-full"
      >
        <div className="space-y-4">
          <FormField
            control={formStudent.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логин</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formStudent.control}
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
        <Recaptcha onChange={isVerified => setIsStudentRecaptchaConfirmed(isVerified)} />
        <Button
          type="submit"
          disabled={isLoading || !isStudentRecaptchaConfirmed}
          className="w-full md:w-auto"
        >
          Войти
        </Button>
      </form>
    </Form>
  );
};

'use client';

import {
  Form,
  FormControl,
  FormDescription,
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
  REGISTER_FORM_SCHEMA,
  DEFAULT_FORM_VALUES,
  LOCALSTORAGE_NAME,
  SUCCESS_RESUME_DELAY,
  RESUME_UPLOAD_URL,
} from './lib/constant';
import { useEffect, useState, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CREATE_STUDENT } from './api/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useAxios } from '@/lib';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createStudent] = useMutation(CREATE_STUDENT);
  const api = useAxios();

  const form = useForm<z.infer<typeof REGISTER_FORM_SCHEMA>>({
    resolver: zodResolver(REGISTER_FORM_SCHEMA),
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
      // eslint-disable-next-line
      const { resumePDF, ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onFormSubmit = async (
    data: z.infer<typeof REGISTER_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const { resumePDF, ...student } = data;

      const variables = {
        teamName: student.commandName,
        groupId: student.studentGroupId,
        year: student.course,
        lastName: student.lastName,
        firstName: student.firstName,
        patronymic: student.patronymic || '',
        firstPriority: student.firstPriority,
        secondPriority: student.middlePriority,
        thirdPriority: student.lastPriority,
        resumeLink: student.resumeLink || '',
        resumePdf: '', // Это поле будет передаваться по id в хранилище
        telegram: student.telegram,
        otherPriorities: student.otherPriority || '',
      };

      const response = await createStudent({ variables });

      if (response.errors) {
        response.errors.forEach(error => {
          if (error.extensions?.code === 'BAD_USER_INPUT') {
            toast.error(
              'Ошибка ввода данных. Пожалуйста, проверьте правильность заполнения всех полей.',
            );
          } else if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
            toast.error(
              'Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
            );
          } else {
            toast.error(
              'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.',
            );
          }
        });
        return;
      }

      const {
        data: { createStudent: newStudent },
      } = response;

      if (resumePDF) {
        const formData = new FormData();
        formData.append('userId', String(newStudent.id));
        formData.append('file', resumePDF);

        toast.success('Вы успешно прикреплены');
        try {
          await api.post(RESUME_UPLOAD_URL, formData);
          setTimeout(() => {
            toast.success('Ваше резюме успешно доставлено');
          }, SUCCESS_RESUME_DELAY);
        } catch (error) {
          console.error(error);
          setTimeout(() => {
            toast.error('Произошла ошибка при загрузке файла...');
          }, SUCCESS_RESUME_DELAY);
        }
      }

      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
      toast.error(
        'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-2/3 lg:w-1/2 mx-auto mt-5 mb-3 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Регистрация на проект</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="commandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название команды</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormDescription className="text-red-500">
                    Название команды должно полностью совпадать у всех членов команды
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер студенческого билета</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Группа (из ЕТИС)</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patronymic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отчество</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>Опционально</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Курс</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={e => field.onChange(Number(e))}
                      defaultValue={String(field.value)}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">1 курс</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">2 курс</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstPriority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID проекта с первым приоритетом</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={
                        field.value !== DEFAULT_FORM_VALUES.firstPriority
                          ? field.value
                          : ''
                      }
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>Высший приоритет</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middlePriority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID проекта с вторым приоритетом</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={
                        field.value !== DEFAULT_FORM_VALUES.middlePriority
                          ? field.value
                          : ''
                      }
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastPriority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID проекта с третьим приоритетом</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={
                        field.value !== DEFAULT_FORM_VALUES.lastPriority
                          ? field.value
                          : ''
                      }
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherPriority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Остальные приоритеты по желанию (4, 5, 6)</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>В формате: ID, ID, ID</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на телеграмм для связи</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="resumeLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ссылка на ваше резюме c hh.ru</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resumePDF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Загрузите ваше резюме (PDF)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        className="w-full"
                        ref={fileInputRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto font-bold py-2 px-4 rounded-lg transition-all duration-200"
          >
            {isLoading ? 'Отправка...' : 'Присоединиться'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

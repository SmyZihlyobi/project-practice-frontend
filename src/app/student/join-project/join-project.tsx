'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { CREATE_STUDENT } from './api/mutations';
import {
  DEFAULT_FORM_VALUES,
  LOCALSTORAGE_NAME,
  REDIRECT_DELAY,
  REGISTER_FORM_SCHEMA,
  RESUME_UPLOAD_URL,
  UPLOAD_RESUME_DELAY,
} from './lib/constant';
import { TeamsSelect } from './ui';

export default function JoinProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createStudent] = useMutation(CREATE_STUDENT);

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

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

  const delayedToast = (
    toastMessage: string,
    delay: number,
    type: 'error' | 'success',
  ) => {
    setTimeout(() => {
      toast[type](toastMessage);
    }, delay);
  };

  const uploadResume = async (resumePDF: File, id: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('userId', String(id));
      formData.append('file', resumePDF);

      await axiosInstance.post(RESUME_UPLOAD_URL, formData);
      await delayedToast(
        'Ваше резюме успешно доставлено',
        UPLOAD_RESUME_DELAY,
        'success',
      );
    } catch (error) {
      console.error(error);
      await delayedToast(
        'Произошла ошибка при загрузке резюме',
        UPLOAD_RESUME_DELAY,
        'error',
      );
    }
  };

  const onFormSubmit = async (
    data: z.infer<typeof REGISTER_FORM_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const { resumePDF, ...student } = data;

      let telegram = student.telegram;

      if (telegram.startsWith('@')) {
        telegram = `https://t.me/${telegram.slice(1)}`;
      }

      let teamName: null | string | undefined = student.commandName;

      // Нам необходимо передать на бекенд именно null
      if (!teamName?.trim() || !teamName) {
        teamName = null;
      }

      const variables = {
        teamName: teamName,
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
        telegram: telegram,
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

      toast.success('Вы успешно прикреплены');
      setIsSuccess(true);

      if (resumePDF) {
        await uploadResume(resumePDF, newStudent.id);
      }

      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        window.location.href = '/student/teams';
      }, REDIRECT_DELAY);
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
    <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
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
                render={() => (
                  <FormItem>
                    <FormLabel>Режим команды</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue="select"
                        onValueChange={value => setIsCreatingTeam(value === 'create')}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="select" />
                          </FormControl>
                          <FormLabel className="font-normal">Выбрать команду</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="create" />
                          </FormControl>
                          <FormLabel className="font-normal">Создать команду</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Если вашей команды нет в списке обновите страницу или создайте
                      команду с идентичным названием
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCreatingTeam ? (
                <FormField
                  control={form.control}
                  name="commandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название новой команды</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="commandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выберите команду</FormLabel>
                      <FormControl>
                        <TeamsSelect value={field.value} onValueChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
              className={cn(
                'w-full md:w-auto font-bold py-2 px-4 rounded-lg transition-all duration-200',
                {
                  'bg-green-500 hover:bg-green-600': isSuccess,
                },
              )}
            >
              {isLoading
                ? 'Отправка...'
                : isSuccess
                  ? 'Успешно отправлено!'
                  : 'Присоединиться'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}

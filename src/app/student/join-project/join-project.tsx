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
import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  DEFAULT_FORM_VALUES,
  LOCALSTORAGE_NAME,
  REDIRECT_DELAY,
  REGISTER_FORM_SCHEMA,
} from './lib/constant';
import { GroupSelect, TeamsSelect } from './ui';
import { useAuth } from '@/lib/auth/use-auth';
import { useTeamsStore } from '@/store';
import { BadgePlus, Crosshair, FileText, IdCard, Send, User, Users } from 'lucide-react';

export default function JoinProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedFields, setCompletedFields] = useState(0);
  const totalFields = 14;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const teamStore = useTeamsStore;
  const { createStudent } = teamStore;
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const { user } = useAuth();

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { resumePDF, ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(rest));
      const filled = Object.values(rest).filter(
        v => v !== '' && v !== null && v !== undefined,
      ).length;
      setCompletedFields(filled);
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
      const teamName: string | null = student.commandName?.trim() || null;
      const studentData = {
        teamName,
        groupId: student.studentGroupId,
        year: student.course,
        lastName: student.lastName,
        firstName: student.firstName,
        patronymic: student.patronymic || undefined,
        firstPriority: student.firstPriority,
        secondPriority: student.middlePriority,
        thirdPriority: student.lastPriority,
        resumeLink: student.resumeLink || undefined,
        telegram,
        otherPriorities: student.otherPriority || undefined,
        username: user?.username,
        desiredRole: student?.desiredRole,
      };
      await createStudent(studentData, resumePDF);
      toast.success('Вы успешно прикреплены');
      setIsSuccess(true);
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
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.',
      );
      const firstErrorField = Object.keys(form.formState.errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-5/6 lg:w-2/3 mx-auto mt-5 mb-3 px-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Регистрация на проект</h2>
        <div className="w-full mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Прогресс заполнения</span>
            <span>
              {Math.min(100, Math.round((completedFields / totalFields) * 100))}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="flex flex-col gap-8 w-full"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Команда</h3>
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
                      Если вашей команды нет в списке, обновите страницу или создайте
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
                        <Input {...field} />
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
            </div>

            <hr className=" border-t border-gray-300" />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Личная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фамилия</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input {...field} className="pl-9" />
                        </div>
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
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input {...field} className="pl-9" />
                        </div>
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
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormDescription>Опционально</FormDescription>
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
                        <div className="relative">
                          <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input {...field} className="pl-9" />
                        </div>
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
                      <FormLabel>Группа</FormLabel>
                      <FormControl>
                        <GroupSelect value={field.value} onChange={field.onChange} />
                      </FormControl>
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
                          className="flex gap-4 flex-wrap"
                        >
                          {[1, 2, 3, 4].map(val => (
                            <FormItem
                              key={val}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={val.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">{val}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-t border-gray-300" />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Приоритеты</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['firstPriority', 'middlePriority', 'lastPriority'].map((name, idx) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as never}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {['Первый', 'Второй', 'Третий'][idx]} приоритет
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Crosshair className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="number"
                              className="pl-9"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="otherPriority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дополнительные приоритеты</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BadgePlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Опционально</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-t border-gray-300" />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Контактные данные</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на телеграм</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Send className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desiredRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Желаемая роль</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormDescription>Опционально</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className=" border-t border-gray-300" />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Резюме</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="resumeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на резюме</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Опционально</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resumePDF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Загрузите резюме (PDF)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(file);
                            }}
                            className="pl-9"
                            ref={fileInputRef}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <hr className=" border-t border-gray-300" />
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

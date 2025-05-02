'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Markdown } from '@/components/ui/markdown';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  CREATE_PROJECT_SCHEMA,
  DEFAULT_FORM_VALUES,
  LOCALSTORAGE_NAME,
  REDIRECT_DELAY,
} from './lib/constant';
import { useProjectStore } from '@/store';
import { Project } from '@/api/dto';

export default function CreateProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const presentationInputRef = useRef<HTMLInputElement>(null);
  const technicalSpecificationsInputRef = useRef<HTMLInputElement>(null);
  const projectStore = useProjectStore;
  const { createProject, uploadPresentation, uploadTechnicalSpecification } =
    projectStore;

  const form = useForm<z.infer<typeof CREATE_PROJECT_SCHEMA>>({
    resolver: zodResolver(CREATE_PROJECT_SCHEMA),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const description = useWatch({
    control: form.control,
    name: 'description',
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
      const { technicalSpecifications, presentation, ...rest } = value;
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(rest));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onFormSubmit = async (
    data: z.infer<typeof CREATE_PROJECT_SCHEMA>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const { presentation, technicalSpecifications, ...project } = data;

      const newProject: Project = await createProject(project);

      toast.success('Проект успешно создан');
      setIsSuccess(true);

      if (!newProject?.id) {
        throw new Error('Project creation failed - no ID returned');
      }

      await Promise.all([
        uploadPresentation(newProject.id, presentation),
        uploadTechnicalSpecification(newProject.id, technicalSpecifications),
      ]);

      localStorage.removeItem(LOCALSTORAGE_NAME);
      form.reset(DEFAULT_FORM_VALUES);

      if (presentationInputRef.current) {
        presentationInputRef.current.value = '';
      }
      if (technicalSpecificationsInputRef.current) {
        technicalSpecificationsInputRef.current.value = '';
      }

      setTimeout(() => {
        window.location.href = '/project';
      }, REDIRECT_DELAY);
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка при создании проекта');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-2/3 lg:w-1/2 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Создание проекта</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название проекта</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание проекта</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>Поддерживается md форматирование</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {description && <Markdown text={description} />}

              <FormField
                control={form.control}
                name="stack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стек технологий</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Укажите технологии через запятую, например: reactjs, npm, nodejs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiredRoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Необходимые роли</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Укажите необходимые роли через запятую, например: frontend, backend,
                      designer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Направление проекта</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Укажите направление проекта, например: веб-разработка, мобильные
                      приложения
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamsAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество команд</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
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
                name="studentProject"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="mt-2"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Студенческий проект</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Презентация (PPTX)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pptx"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        className="w-full"
                        ref={presentationInputRef}
                      />
                    </FormControl>
                    <FormDescription>Максимальный размер файла: 10 МБ</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicalSpecifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Техническое задание (PDF)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        className="w-full"
                        ref={technicalSpecificationsInputRef}
                      />
                    </FormControl>
                    <FormDescription>Максимальный размер файла: 10 МБ</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                ? 'Создание...'
                : isSuccess
                  ? 'Проект создан!'
                  : 'Создать проект'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}

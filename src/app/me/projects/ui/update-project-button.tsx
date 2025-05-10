import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store';
import { UpdateProjectProps } from '@/app/me/projects/types';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { UPDATE_PROJECT_SCHEMA } from '../lib/constant';
import cn from 'classnames';

export const UpdateProjectButton = observer(({ id }: UpdateProjectProps) => {
  const projectStore = useProjectStore;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const presentationInputRef = useRef<HTMLInputElement>(null);
  const technicalSpecificationsInputRef = useRef<HTMLInputElement>(null);

  const currentProject = projectStore.getProjectById(id);

  const form = useForm<z.infer<typeof UPDATE_PROJECT_SCHEMA>>({
    resolver: zodResolver(UPDATE_PROJECT_SCHEMA),
    defaultValues: {
      name: currentProject?.name || '',
      description: currentProject?.description || '',
      stack: currentProject?.stack || '',
      requiredRoles: currentProject?.requiredRoles || '',
      direction: currentProject?.direction || '',
      teamsAmount: currentProject?.teamsAmount || 1,
      studentProject: currentProject?.studentProject || false,
      presentation: undefined,
      technicalSpecifications: undefined,
    },
  });

  useEffect(() => {
    if (currentProject && isEditing) {
      form.reset({
        ...currentProject,
        teamsAmount: Number(currentProject.teamsAmount),
        presentation: undefined,
        technicalSpecifications: undefined,
      });
    }
  }, [currentProject, isEditing, form]);

  const handleSubmit = async (values: z.infer<typeof UPDATE_PROJECT_SCHEMA>) => {
    try {
      setIsLoading(true);
      const { presentation, technicalSpecifications, ...updates } = values;
      await projectStore.updateProject(
        id,
        {
          ...updates,
          teamsAmount: Number(updates.teamsAmount),
        },
        presentation instanceof File ? presentation : undefined,
      );
      if (technicalSpecifications instanceof File) {
        await projectStore.uploadTechnicalSpecification(id, technicalSpecifications);
      }

      toast.success('Проект успешно обновлён');
      setIsSuccess(true);
      setTimeout(() => setIsEditing(false), 1500);
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      toast.error('Ошибка при обновлении проекта');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentProject) return null;

  return (
    <>
      <Button className="w-full mt-6 bg-primary" onClick={() => setIsEditing(true)}>
        Редактировать
      </Button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование проекта</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название проекта</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea
                          {...field}
                          className="min-h-[150px]"
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Стек технологий</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Укажите технологии через запятую: reactjs, npm, nodejs
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Укажите роли через запятую: frontend, backend, designer
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Например: веб-разработка, мобильные приложения
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
                            field.onChange(file);
                          }}
                          ref={presentationInputRef}
                        />
                      </FormControl>
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
                            field.onChange(file);
                          }}
                          ref={technicalSpecificationsInputRef}
                        />
                      </FormControl>
                      {currentProject.technicalSpecifications && (
                        <a
                          href={currentProject.technicalSpecifications}
                          className="text-blue-500 underline block mt-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Текущее ТЗ
                        </a>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 justify-end max-sm:w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="max-sm:w-full"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'max-sm:w-full py-2 px-4 rounded-lg transition-all duration-200',
                    {
                      'bg-green-500 hover:bg-green-600': isSuccess,
                    },
                  )}
                >
                  {isLoading
                    ? 'Сохранение...'
                    : isSuccess
                      ? 'Обновлено!'
                      : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
});

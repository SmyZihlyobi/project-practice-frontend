'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_COMPANY_QUERY } from '@/api/queries';
import { UPDATE_COMPANY_MUTATION } from '@/api/mutations';
import { useAuth } from '@/lib/auth/use-auth';
import { toast } from 'sonner';
import { Company } from '@/api/dto';
import { useCompaniesStore } from '@/store';

export function CompanySettings() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_COMPANY_QUERY, {
    variables: { id: user?.id },
    skip: !user?.id,
  });

  const companiesStore = useCompaniesStore;
  const { getIsCacheLoaded } = companiesStore;
  const isCachedLoaded = getIsCacheLoaded();

  const form = useForm<Company>({
    defaultValues: {
      name: '',
      representative: '',
      website: '',
      contacts: '',
    },
  });

  const [updateCompany, { loading: isSubmitting }] = useMutation(
    UPDATE_COMPANY_MUTATION,
    {
      onCompleted: () => {
        toast.success('Данные успешно обновлены');
        refetch();
      },
      onError: error => toast.error(`Ошибка обновления: ${error.message}`),
    },
  );

  useEffect(() => {
    if (data?.company) {
      form.reset({
        name: data.company.name,
        representative: data.company.representative,
        website: data.company.website || '',
        contacts: data.company.contacts,
      });
    }
  }, [data, form]);

  const renderSkeletonRow = (rowsCount: number, columnsCount: number) => {
    return Array.from({ length: rowsCount }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex flex-col space-y-6 mb-6">
        {Array.from({ length: columnsCount }).map((_, colIndex) => (
          <Skeleton key={colIndex} className={'h-10 w-full'} />
        ))}
      </div>
    ));
  };

  const onSubmit = (input: Company) => {
    if (!user?.id) return;

    updateCompany({
      variables: {
        id: user.id,
        input: {
          ...input,
          email: user.email,
          studentCompany: user.is_student_company,
        },
      },
    });
  };

  if (!user) {
    return <div className="text-center p-4">Пользователь не авторизован</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">Ошибка загрузки: {error.message}</div>
    );
  }

  return (
    <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Настройки компании</h2>
        {loading && !isCachedLoaded ? (
          renderSkeletonRow(5, 1)
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название компании</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите название компании" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="representative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Представитель</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ФИО представителя" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Веб-сайт</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://company.com"
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contacts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контакты</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}

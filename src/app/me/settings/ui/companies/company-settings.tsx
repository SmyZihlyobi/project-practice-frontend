'use client';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function CompanySettings() {
  const form = useForm();

  return (
    <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Настройки профиля</h2>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
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
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сайт</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
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
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>
    </div>
  );
}

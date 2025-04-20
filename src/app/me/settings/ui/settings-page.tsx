'use client';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/use-auth';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsPage() {
  const { user, isLoading } = useAuth();
  const form = useForm();

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        name: user.name,
      });
    }
  }, [user, form]);

  if (isLoading) {
    return (
      <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
        <Card className="p-4 space-y-4">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 lg:w-1/3 mx-auto mt-5 mb-3 px-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Настройки профиля</h2>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное имя</FormLabel>
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

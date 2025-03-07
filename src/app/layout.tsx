import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/lib';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Header from '@/components/ui/header';
import { AuthProvider } from '@/lib/auth/use-auth';
import { ReactNode } from 'react';

const firaCode = Fira_Code({
  variable: '--font-fira-code-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Проектная практика',
  description:
    'Сайт созданный для управления проектами и командами по проектной деятельности ПГНИУ ИКНТ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${firaCode.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <ApolloWrapper>{children}</ApolloWrapper>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/lib';
import { Toaster } from '@/components/ui/sonner';

const firaCode = Fira_Code({
  variable: '--font-fira-code-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Проектная практика',
  description:
    'Сайт созданный для упровления проектами и командами по проектной деятельности ПГНИУ ИКНТ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${firaCode.variable} antialiased`}>
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
      </body>
    </html>
  );
}

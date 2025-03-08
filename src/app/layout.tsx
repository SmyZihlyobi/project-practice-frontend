import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/lib';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Header from '@/components/ui/header';
import { AuthProvider } from '@/lib/auth/use-auth';
import { ReactNode } from 'react';
import Head from 'next/head';

const firaCode = Fira_Code({
  variable: '--font-fira-code-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Проектная практика ИКНТ | Управление проектами и командами',
  description:
    'Сайт для управления проектами и командами по проектной деятельности ПГНИУ ИКНТ. Участвуйте в проектах, создавайте команды и развивайте навыки.',
  keywords: [
    'проектная практика',
    'ИКНТ',
    'ПГНИУ',
    'управление проектами',
    'студенческие команды',
    'икнт',
    'пгниу',
    'проекты',
  ],
  openGraph: {
    title: 'Проектная практика ИКНТ',
    description:
      'Сайт для управления проектами и командами по проектной деятельности ПГНИУ ИКНТ.',
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
    siteName: 'Проектная практика ИКНТ',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/og-images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Проектная практика ИКНТ',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Проектная практика ИКНТ',
    description:
      'Сайт для управления проектами и командами по проектной деятельности ПГНИУ ИКНТ.',
    images: [`${process.env.NEXT_PUBLIC_FRONTEND_URL}/og-images/og-image.jpg`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'yandex-verification': `${process.env.NEXT_PUBLIC_YANDEX_VERIFICATION}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <Head>
        <meta name="apple-mobile-web-app-title" content="PP IKNT" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
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

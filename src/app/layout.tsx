import { ReactNode } from 'react';

import { Footer } from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ApolloWrapper } from '@/lib/Apollo';
import { AuthProvider } from '@/lib/auth/use-auth';
import type { Metadata } from 'next';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { Fira_Code } from 'next/font/google';
import { FeedbackDialog } from '@/components/ui/feedback';
import Head from 'next/head';
import './globals.css';
import { ServiceWorkerRegistration } from '@/components/ui/service-worker-registration';

const firaCode = Fira_Code({
  variable: '--font-fira-code-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Проектная практика ИКНТ | Управление проектами и командами',
  description:
    'Сайт для управления проектами и командами по проектной деятельности ПГНИУ ИКНТ. Участвуйте в проектах, создавайте команды и развивайте навыки. пгниу. икнт.',
  keywords: [
    'проектная практика',
    'ИКНТ',
    'ПГНИУ',
    'управление проектами',
    'студенческие команды',
    'икнт',
    'пгниу',
    'проекты',
    'проектная деятельность',
    'студенческие проекты',
    'управление командами',
    'развитие навыков',
    'проекты ПГНИУ',
    'ИКНТ проекты',
    'платформа для проектов',
    'студенческая практика',
    'проектная работа',
    'командная работа',
    'навыки управления',
    'проекты для студентов',
    'проекты для преподавателей',
    'проектная платформа',
    'учебные проекты',
    'проекты ИКНТ ПГНИУ',
    'студенческие инициативы',
    'проекты для развития',
    'проекты для карьеры',
    'проекты для образования',
    'проекты для науки',
    'проекты для инноваций',
    'проекты для технологий',
    'проекты для бизнеса',
    'проекты для общества',
    'проекты для культуры',
    'проекты для экологии',
    'проекты для инженерии',
    'проекты для IT',
    'проекты для программирования',
    'проекты для экологии',
    'проекты для устойчивого развития',
    'проекты для волонтерства',
    'проекты для благотворительности',
    'проекты для лидерства',
    'проекты для креативности',
    'проекты для инноваций',
    'проекты для стартапов',
    'проекты для предпринимательства',
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
    icon: '/icons/favicons/favicon.ico',
    shortcut: '/icons/favicons/favicon.png',
    apple: '/icons/favicons/apple-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icons/favicons/web-app-manifest-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icons/favicons/web-app-manifest-512x512.png',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/icons/favicons/favicon.svg',
      },
    ],
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
    <html className="dark" lang="ru" suppressHydrationWarning>
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
            <ApolloWrapper>
              <Header />
              <ReCaptchaProvider>
                <main>
                  {children}
                  <FeedbackDialog />
                  <Toaster />
                </main>
              </ReCaptchaProvider>
              <Footer />
            </ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

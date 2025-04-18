import { ReactNode } from 'react';

import { AuthCheck } from '@/lib/auth/auth-check';
import { Roles } from '@/lib/constant/roles';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Создание проекта',
  description: 'Выложите свой проект, чтобы он был реализован студентами ИКНТ ПГНИУ',
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
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AuthCheck requiredRole={Roles.Company}>{children}</AuthCheck>;
}

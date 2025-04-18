import { ReactNode } from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Регистрация компании',
  description:
    'Зарегистрируйте свою компанию чтобы потом выложить проект для проектной практики ИКНТ ПГНИУ',
  keywords: [
    'проектная практика',
    'ИКНТ',
    'ПГНИУ',
    'управление проектами',
    'студенческие команды',
    'икнт',
    'пгниу',
    'проекты',
    'регистрация компании',
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
  return <>{children}</>;
}

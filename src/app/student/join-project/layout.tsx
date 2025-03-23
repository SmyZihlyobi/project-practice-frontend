import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Присоединится к проекту | команде',
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
    'присоединиться',
    'присоединиться к проекту',
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
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}

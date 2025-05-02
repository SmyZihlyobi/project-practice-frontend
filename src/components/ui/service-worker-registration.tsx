'use client';

import { useEffect } from 'react';

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.info('[SW] Service Worker API доступен');

      const registerSW = async () => {
        try {
          console.info('[SW] Попытка регистрации Service Worker...');

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          console.info('[SW] Service Worker успешно зарегистрирован:', registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.info('[SW] Обнаружено обновление Service Worker:', newWorker);

            newWorker?.addEventListener('statechange', () => {
              console.info(`[SW] Состояние нового Worker: ${newWorker.state}`);
              if (newWorker.state === 'activated') {
                console.info('[SW] Новый Service Worker активирован');
              }
            });
          });

          if (registration.active) {
            console.info('[SW] Активный Worker:', registration.active);
          }
          if (registration.waiting) {
            console.info('[SW] Ожидающий Worker:', registration.waiting);
          }
          if (registration.installing) {
            console.info('[SW] Устанавливающийся Worker:', registration.installing);
          }

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.info('[SW] Контроллер Service Worker изменился');
          });
        } catch (error) {
          console.warn('[SW] Ошибка регистрации:', error);

          if (error instanceof Error) {
            if (error.message.includes('MIME type')) {
              console.warn('[SW] Ошибка: Неправильный MIME type для sw.js');
            } else if (error.message.includes('script')) {
              console.warn('[SW] Ошибка: Проблема с загрузкой скрипта SW');
            } else if (error.message.includes('security')) {
              console.warn('[SW] Ошибка: Проблема безопасности (требуется HTTPS)');
            }
          }
        }
      };

      if (document.readyState === 'complete') {
        console.info('[SW] Страница уже загружена, регистрируем немедленно');
        registerSW();
      } else {
        console.log('[SW] Ожидаем загрузки страницы для регистрации');
        window.addEventListener('load', registerSW);
      }

      return () => {
        window.removeEventListener('load', registerSW);
      };
    } else {
      console.warn('[SW] Service Worker не поддерживается или режим разработки');
    }
  }, []);

  return null;
};

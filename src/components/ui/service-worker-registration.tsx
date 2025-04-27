'use client';

import { useEffect } from 'react';

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.log('[SW] Service Worker API доступен');

      const registerSW = async () => {
        try {
          console.log('[SW] Попытка регистрации Service Worker...');

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          console.log('[SW] Service Worker успешно зарегистрирован:', registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW] Обнаружено обновление Service Worker:', newWorker);

            newWorker?.addEventListener('statechange', () => {
              console.log(`[SW] Состояние нового Worker: ${newWorker.state}`);
              if (newWorker.state === 'activated') {
                console.log('[SW] Новый Service Worker активирован');
              }
            });
          });

          if (registration.active) {
            console.log('[SW] Активный Worker:', registration.active);
          }
          if (registration.waiting) {
            console.log('[SW] Ожидающий Worker:', registration.waiting);
          }
          if (registration.installing) {
            console.log('[SW] Устанавливающийся Worker:', registration.installing);
          }

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] Контроллер Service Worker изменился');
          });
        } catch (error) {
          console.error('[SW] Ошибка регистрации:', error);

          if (error instanceof Error) {
            if (error.message.includes('MIME type')) {
              console.error('[SW] Ошибка: Неправильный MIME type для sw.js');
            } else if (error.message.includes('script')) {
              console.error('[SW] Ошибка: Проблема с загрузкой скрипта SW');
            } else if (error.message.includes('security')) {
              console.error('[SW] Ошибка: Проблема безопасности (требуется HTTPS)');
            }
          }
        }
      };

      if (document.readyState === 'complete') {
        console.log('[SW] Страница уже загружена, регистрируем немедленно');
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

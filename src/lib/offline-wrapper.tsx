'use client';

import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance, processAxiosQueue, setAxiosIndexDb } from './axios/axios';
import { processApolloQueue } from './Apollo';
import { IndexedDBService } from './index-db/index-db-service';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth/use-auth';
import { setApolloIndexDb } from './Apollo/apollo-client';

export const OfflineWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const indexedAxiosDbRef = useRef<IndexedDBService | null>(null);
  const indexedApolloDbRef = useRef<IndexedDBService | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setNetworkError(false);
      processAxiosQueue();
      processApolloQueue();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleNetworkError = (event: Event) => {
      if (event instanceof ErrorEvent && event.message.includes('NetworkError')) {
        setNetworkError(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('error', handleNetworkError);

    const interceptor = axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.message.includes('NetworkError')) {
          setNetworkError(true);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('error', handleNetworkError);
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const axiosIndexedDB = new IndexedDBService('AxiosDB', 'axios');
      indexedAxiosDbRef.current = axiosIndexedDB;
      setAxiosIndexDb(axiosIndexedDB);
      const apolloIndexedDB = new IndexedDBService('ApolloDB', 'graphql-requests');
      indexedApolloDbRef.current = apolloIndexedDB;
      setApolloIndexDb(apolloIndexedDB);
    }
  }, [user]);

  const handleCancelRequests = async () => {
    if (indexedAxiosDbRef.current && indexedApolloDbRef.current) {
      await indexedAxiosDbRef.current.clearStore();
      await indexedApolloDbRef.current.clearStore();
      setIsOffline(false);
      setNetworkError(false);
    }
  };

  const handleRetry = () => {
    setNetworkError(false);
    processAxiosQueue();
    processApolloQueue();
  };

  if (isOffline === null) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isOffline && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 flex justify-between items-center z-50">
          <span>Нет подключения, все действия будут выполнены после подключения</span>
          <div className="flex gap-2">
            <Button
              onClick={handleCancelRequests}
              className="bg-white text-red-500 border-none p-2 cursor-pointer"
            >
              Отменить запросы
            </Button>
          </div>
        </div>
      )}

      {networkError && !isOffline && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black p-4 flex justify-between items-center z-50">
          <span>Ошибка сети. Проверьте подключение и попробуйте снова</span>
          <div className="flex gap-2">
            <Button
              onClick={handleRetry}
              className="bg-white text-yellow-700 border-none p-2 cursor-pointer"
            >
              Повторить
            </Button>
            <Button
              onClick={handleCancelRequests}
              className="bg-white text-yellow-700 border-none p-2 cursor-pointer"
            >
              Отменить
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '../constant';
import { toast } from 'sonner';
import { IndexedDBService } from '../index-db/index-db-service';
import { nanoid } from 'nanoid';
import { QueuedAxiosRequest } from './types';

let indexedDb: IndexedDBService | null = null;
let userExpire: number = 0;

export const setAxiosIndexDb = (indexDb: IndexedDBService) => {
  indexedDb = indexDb;
};

export const setAxiosUserExpire = (expire: number) => {
  userExpire = expire;
};

const generateRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method}:${config.url}`;
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = Cookies.get(JWT_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      toast.error('У тебя здесь нет власти! 😈');
    }

    if (typeof window !== undefined && !navigator.onLine) {
      const { config } = error;

      if (indexedDb) {
        if (
          ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() ?? '')
        ) {
          const requestKey = generateRequestKey(config);

          const existingRequest = await indexedDb.getItemByField<QueuedAxiosRequest>(
            'requestKey',
            requestKey,
          );

          if (existingRequest) {
            await indexedDb.updateItem(existingRequest.id, {
              ...existingRequest,
              timestamp: Date.now(),
              priority: existingRequest.priority + 1,
            });
          } else {
            const requestToSave: QueuedAxiosRequest = {
              id: nanoid(),
              config,
              timestamp: Date.now(),
              expiresAt: userExpire,
              requestKey,
              priority: 1,
            };
            await indexedDb.addItem(requestToSave);
          }

          return Promise.resolve({ data: { message: 'Request queued offline' } });
        }
      }

      return Promise.reject(new Error('No internet connection'));
    }

    return Promise.reject(error);
  },
);

export const processAxiosQueue = async () => {
  if (navigator.onLine && indexedDb) {
    const requests = await indexedDb.getAll<QueuedAxiosRequest>();

    requests.sort((a, b) => b.priority - a.priority || b.timestamp - a.timestamp);

    for (const request of requests) {
      try {
        await axiosInstance(request.config);
        await indexedDb.deleteItem(request.id);
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }
  }
};

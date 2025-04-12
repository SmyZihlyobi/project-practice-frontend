import axios from 'axios';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from './constant';
import { toast } from 'sonner';

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
  error => {
    if (error.response && error.response.status === 401) {
      toast.error('У тебя здесь нет власти! 😈');
    }
    return Promise.reject(error);
  },
);

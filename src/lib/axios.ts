import axios from 'axios';

export const useAxios = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });
};

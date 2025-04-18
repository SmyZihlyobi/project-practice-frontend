import { AxiosRequestConfig } from 'axios';

export interface QueuedAxiosRequest {
  id: string;
  config: AxiosRequestConfig;
  timestamp: number;
  expiresAt: number;
  requestKey: string;
  priority: number;
}

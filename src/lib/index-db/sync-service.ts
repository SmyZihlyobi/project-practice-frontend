/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexedDBService } from './index-db-service';
import { axiosInstance } from '../axios/axios';
import { apolloClient } from '../Apollo/apollo-client';
import { DocumentNode } from '@apollo/client';

interface SyncItem {
  id: string;
  type: 'axios' | 'apollo';
  config: {
    url?: string;
    method?: string;
    data?: any;
    mutation?: {
      query: DocumentNode;
      variables: Record<string, unknown>;
    };
  };
  timestamp: number;
}

export class SyncService {
  private static instance: SyncService;
  private syncDB: IndexedDBService | null = null;
  private isOnline: boolean;

  private constructor() {
    this.isOnline = false;
    if (typeof window !== 'undefined') {
      this.syncDB = new IndexedDBService('sync-queue', 'sync-items');
      this.setupEventListeners();
    }
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async init(): Promise<void> {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.setupEventListeners();
      if (this.syncDB) {
        await this.syncDB.init();
      }
    }
    if (this.isOnline) {
      await this.processQueue();
    }
  }

  get isSyncOnline(): boolean {
    return this.isOnline;
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async addAxiosRequest(config: {
    url: string;
    method: string;
    data?: any;
  }): Promise<void> {
    if (!this.syncDB) return;
    const item: SyncItem = {
      id: Date.now().toString(),
      type: 'axios',
      config,
      timestamp: Date.now(),
    };

    await this.syncDB.addItem(item);
  }

  async addApolloMutation(
    query: DocumentNode,
    variables: Record<string, unknown>,
  ): Promise<void> {
    if (!this.syncDB) return;
    const item: SyncItem = {
      id: Date.now().toString(),
      type: 'apollo',
      config: {
        mutation: {
          query,
          variables,
        },
      },
      timestamp: Date.now(),
    };

    await this.syncDB.addItem(item);
  }

  private async processQueue(): Promise<void> {
    if (!this.syncDB) return;
    const items = await this.syncDB.getAll<SyncItem>();

    for (const item of items) {
      try {
        if (item.type === 'axios' && item.config.url && item.config.method) {
          const response = await axiosInstance({
            url: item.config.url,
            method: item.config.method,
            data: item.config.data,
          });

          if (response.status >= 200 && response.status < 300) {
            await this.syncDB.deleteItem(item.id);
          }
        } else if (item.type === 'apollo' && item.config.mutation) {
          await apolloClient.mutate({
            mutation: item.config.mutation.query,
            variables: item.config.mutation.variables,
          });
          await this.syncDB.deleteItem(item.id);
        }
      } catch (error) {
        console.error('Failed to sync item:', error);
        // Оставляем элемент в очереди для следующей попытки
      }
    }
  }

  async getQueueLength(): Promise<number> {
    if (!this.syncDB) return 0;
    const items = await this.syncDB.getAll<SyncItem>();
    return items.length;
  }

  async clearQueue(): Promise<void> {
    if (!this.syncDB) return;
    await this.syncDB.clearStore();
  }
}

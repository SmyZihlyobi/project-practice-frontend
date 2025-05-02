import { useEffect, useState } from 'react';
import { SyncService } from '../lib/index-db/sync-service';
import { Operation } from '@apollo/client';

export function useSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    const syncService = SyncService.getInstance();

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateQueueLength = async () => {
      const length = await syncService.getQueueLength();
      setQueueLength(length);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const interval = setInterval(updateQueueLength, 5000);

    updateQueueLength();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const addAxiosRequest = async (config: {
    url: string;
    method: string;
    data?: never;
  }) => {
    const syncService = SyncService.getInstance();
    await syncService.addAxiosRequest(config);
    const length = await syncService.getQueueLength();
    setQueueLength(length);
  };

  const addApolloOperation = async (operation: Operation) => {
    const syncService = SyncService.getInstance();
    await syncService.addApolloMutation(operation.query, operation.variables);
    const length = await syncService.getQueueLength();
    setQueueLength(length);
  };

  return {
    isOnline,
    queueLength,
    addAxiosRequest,
    addApolloOperation,
  };
}

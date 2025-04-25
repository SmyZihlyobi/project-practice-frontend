import { IndexedDBService } from './index-db-service';

export class CacheService {
  private static instance: CacheService;
  private cacheDB: IndexedDBService;

  private constructor() {
    this.cacheDB = new IndexedDBService('request-cache', 'requests');
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async init(): Promise<void> {
    await this.cacheDB.init();
  }

  async getCachedResponse(url: string): Promise<Response | null> {
    const cached = await this.cacheDB.getById<{
      url: string;
      response: string;
      timestamp: number;
    }>(url);

    if (!cached) return null;

    // Проверяем срок годности кэша (5 минут)
    if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
      await this.cacheDB.deleteItem(url);
      return null;
    }

    return new Response(cached.response);
  }

  async cacheResponse(url: string, response: Response): Promise<void> {
    const responseClone = response.clone();
    const responseText = await responseClone.text();

    await this.cacheDB.addItem({
      id: url,
      url,
      response: responseText,
      timestamp: Date.now(),
    });
  }

  async clearCache(): Promise<void> {
    await this.cacheDB.clearStore();
  }
}

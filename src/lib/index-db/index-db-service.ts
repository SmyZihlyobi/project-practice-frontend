export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private isBrowser: boolean;

  constructor(
    private dbName: string,
    private storeName: string,
    private version = 1,
  ) {
    this.isBrowser = typeof window !== 'undefined';
  }

  async init(): Promise<IDBDatabase> {
    if (!this.isBrowser) {
      throw new Error('IndexedDB is only available in browser environments');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(`IndexedDB error: ${request.error}`);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('by_field', 'field', { unique: false });
        }
      };
    });
  }

  async getAll<T>(): Promise<T[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(id: string): Promise<T | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAll<T extends { id: string }>(items: T[]): Promise<void> {
    if (!this.db) await this.init();
    const plainItems = items.map(item => this.sanitizeForIndexedDB(item));
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      // Очищаем перед сохранением
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        plainItems.forEach(item => store.put(item));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async addItem<T extends { id: string }>(item: T): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteItem(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearStore(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateItem<T extends { id: string }>(
    id: string,
    updates: Partial<T>,
  ): Promise<void> {
    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      try {
        const currentItem = await this.getById<T>(id);

        if (!currentItem) {
          throw new Error(`Item with id ${id} not found`);
        }

        const updatedItem = { ...currentItem, ...updates, id };

        const transaction = this.db!.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(updatedItem);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateByField<T extends { id: string }>(
    fieldName: string,
    fieldValue: never,
    updates: Partial<T>,
  ): Promise<void> {
    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      try {
        const item = await this.getItemByField<T>(fieldName, fieldValue);

        if (!item) {
          throw new Error(`Item with ${fieldName}=${fieldValue} not found`);
        }

        await this.updateItem(item.id, updates);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllByField<T>(fieldName: string, value: never): Promise<T[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index(`by_${fieldName}`);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getItemByField<T>(fieldName: string, value: string): Promise<T | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index(`by_${fieldName}`);
      const request = index.get(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Для удобства использования MobX
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitizeForIndexedDB(data: any): any {
    if (data === null || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeForIndexedDB(item));
    }

    if (Object.prototype.toString.call(data) === '[object Object]') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: Record<string, any> = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          result[key] = this.sanitizeForIndexedDB(data[key]);
        }
      }
      return result;
    }

    return JSON.parse(JSON.stringify(data));
  }
}

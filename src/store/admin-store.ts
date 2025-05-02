import { makeAutoObservable } from 'mobx';
import { axiosInstance } from '@/lib/axios';
import { EXEL_EXPORT_API } from '@/lib/constant';

class AdminStore {
  public isLoading: boolean = false;

  loadExelFile = async (): Promise<Blob> => {
    try {
      this.isLoading = true;
      const response = await axiosInstance.get(EXEL_EXPORT_API, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.log(error);
      return new Blob();
    } finally {
      this.isLoading = false;
    }
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export const useAdminStore = new AdminStore();

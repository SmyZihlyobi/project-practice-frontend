import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LOGIN_PATH, MIGRATION_LOGIN_PAGE_DELAY } from './constant';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export const loginPageMigration = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.href !== LOGIN_PATH) {
    toast.error('У вас недостаточно прав, вы будете перенаправлены на страницу входа');

    setTimeout(() => {
      window.location.href = LOGIN_PATH;
    }, MIGRATION_LOGIN_PAGE_DELAY);
  }
};

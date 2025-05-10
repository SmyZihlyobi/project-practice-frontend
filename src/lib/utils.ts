import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LOGIN_PATH } from './constant';
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

export function navigateToLogin() {
  if (typeof window !== 'undefined') {
    if (location.href === LOGIN_PATH) {
      return;
    }
    location.href = LOGIN_PATH;
  }
}

export function permissionError() {
  toast.error(
    'У вас недостаточно прав или ваша сессия истекла, пожалуйся перезайдите!\n Вы будете перенаправлены на страницу входа...',
  );
  setTimeout(navigateToLogin, 2000);
}

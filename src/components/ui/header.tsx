'use client';

import { PopoverGroup } from '@headlessui/react';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            href={{
              pathname: '/',
            }}
            className="-m-1.5 p-1.5"
          >
            IKNT PROJECTS
          </Link>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link
            href={{
              pathname: '',
            }}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Информация
          </Link>
          <Link
            href={{
              pathname: '',
            }}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Проекты
          </Link>
          <Link
            href={{
              pathname: '/student/teams',
            }}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Команды
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href={{
              pathname: '/student/login',
            }}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
          <ModeToggle></ModeToggle>
        </div>
      </nav>
    </header>
  );
}

export { Header };

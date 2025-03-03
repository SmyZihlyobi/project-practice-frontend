'use client';

import { PopoverGroup } from '@headlessui/react';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/modeToggle';
import * as React from 'react';

export default function Header() {
  return (
    <header className="white border-b border-gray-200">
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
            className="text-sm/6 font-semibold "
          >
            Информация
          </Link>
          <Link
            href={{
              pathname: '',
            }}
            className="text-sm/6  font-semibold "
          >
            Проекты
          </Link>
          <Link
            href={{
              pathname: '/student/teams',
            }}
            className="text-sm/6  font-semibold"
          >
            Команды
          </Link>
          <Link
            href={{
              pathname: '/student/join-project',
            }}
            className="text-sm/6  font-semibold"
          >
            Регистрация на проект
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-12">
          <Link
            href={{
              pathname: '/login',
            }}
            className="text-sm/6 font-semibold"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <ModeToggle></ModeToggle>
    </header>
  );
}

export { Header };

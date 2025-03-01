'use client';

import { useState } from 'react';
import { PopoverGroup } from '@headlessui/react';
import Link from 'next/link';

export default function Header() {
  const [setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
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
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
          </button>
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
              pathname: '',
            }}
            className="text-sm/6 font-semibold text-gray-900"
          >
            что то еще
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export { Header };

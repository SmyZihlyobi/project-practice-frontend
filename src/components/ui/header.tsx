'use client';

import { PopoverGroup } from '@headlessui/react';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/modeToggle';
import * as React from 'react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-gray-200">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            href={{
              pathname: '/',
            }}
            className="-m-1.5 p-1.5 font-bold text-lg"
          >
            IKNT PROJECTS
          </Link>
        </div>

        {/* Desktop Navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link
            href={{
              pathname: '/info',
            }}
            className="text-sm/6 font-semibold"
          >
            Информация
          </Link>
          <Link href="#" className="text-sm/6 font-semibold">
            Проекты
          </Link>
          <Link
            href={{
              pathname: '/student/teams',
            }}
            className="text-sm/6 font-semibold"
          >
            Команды
          </Link>
          <Link
            href={{
              pathname: '/student/join-project',
            }}
            className="text-sm/6 font-semibold"
          >
            Регистрация на проект
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-12">
          <Link href="/login" className="text-sm/6 font-semibold">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Drawer) */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-50" onClick={() => setIsMenuOpen(false)} />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full ${theme === 'dark' ? 'bg-gray-900 text-white border-l-2 border-black' : 'bg-white border-l-2 border-gray text-gray-900'} overflow-y-auto px-6 py-6 sm:max-w-sm`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 font-bold text-lg">
              IKNT PROJECTS
            </Link>

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6">
            <div className="">
              <div className="space-y-2 py-6">
                <Link
                  href="/info"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Информация
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Проекты
                </Link>
                <Link
                  href="/student/teams"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Команды
                </Link>
                <Link
                  href="/student/join-project"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Регистрация на проект
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button className="primary">Тема</Button>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dark
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </div>

              <div className="py-6">
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Mode Toggle */}
      <div className="hidden lg:block absolute right-6 top-5">
        <ModeToggle />
      </div>
    </header>
  );
}

export { Header };

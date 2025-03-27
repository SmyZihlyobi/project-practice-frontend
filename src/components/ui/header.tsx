'use client';

import { PopoverGroup } from '@headlessui/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get(JWT_COOKIE_NAME);
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove(JWT_COOKIE_NAME);
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-dotted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        aria-label="Global"
        className="mx-auto flex items-center justify-between p-6 lg:px-8 max-w-screen-2xl"
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
          <Link href="/project" className="text-sm/6 font-semibold">
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
          <Link
            href={{
              pathname: '/company/create-project',
            }}
            className="text-sm/6 font-semibold"
          >
            Создать проект
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-12">
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-sm/6 font-semibold"
            >
              Выйти <span aria-hidden="true">&rarr;</span>
            </Button>
          ) : (
            <Link href="/login" className="text-sm/6 font-semibold">
              Вход <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>

        <div className="hidden lg:block right-6 top-5">
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="ghost"
            className="block px-3 py-3 h-auto opacity-100 text-inherit"
          >
            {theme === 'light' ? <Sun /> : <Moon />}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
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
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex items-center justify-between px-6 py-6">
                <Link href="/project" className="-m-1.5 p-1.5 font-bold text-lg">
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
              </DrawerHeader>
              <ScrollArea className="h-[calc(100vh-350px)] px-6">
                <div className="flex flex-col gap-0">
                  <Link
                    href="/project"
                    className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-t-2 border-b-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Проекты
                  </Link>
                  <Link
                    href="/student/teams"
                    className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Команды
                  </Link>
                  <Link
                    href="/student/join-project"
                    className="block px-3 py-3 text-base font-semibold  w-full text-center md:text-left border-b-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Регистрация на проект
                  </Link>
                  {/* to-do только для роли компания */}
                  <Link
                    href="/company/create-project"
                    className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Создать проект
                  </Link>
                  <div>
                    {/* to-do Сделать dropdown menu после входа*/}
                    {isLoggedIn ? (
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full block border-b-2 px-3 py-3 h-auto opacity-100 md:text-left text-inherit"
                      >
                        Выйти
                      </Button>
                    ) : (
                      <Link
                        href="/login"
                        className="px-3 py-3 block rounded-lg text-center font-semibold md:text-left border-b-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Вход
                      </Link>
                    )}
                  </div>
                  <Button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    variant="ghost"
                    className="w-full block border-b-2 px-3 py-3 h-auto opacity-100 md:text-left text-inherit"
                  >
                    {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
                  </Button>
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </header>
  );
}

export { Header };

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import { ThemeChanger } from './theme-change';
import { useAuth } from '@/lib/auth/use-auth';
import { Roles } from '@/lib/constant/roles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

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

  const renderUserName = () => {
    if (!user) return 'IKNT PROJECTS';

    if (user.roles.includes(Roles.Company)) {
      return user.name;
    }

    if (user.roles.includes(Roles.Student)) {
      return user.username;
    }

    return 'Профиль';
  };

  const showStudentLinks = user?.roles.includes(Roles.Student);
  const showAdminLinks = user?.roles.includes(Roles.Admin);
  const showCompanyLinks =
    user?.roles.includes(Roles.Admin) || user?.roles.includes(Roles.Company);

  if (isLoading) return null;

  return (
    <header className="fixed w-full top-0 z-50 border-b-2 border-dotted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/project" className="text-sm/6 font-semibold">
            Проекты
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href={{
                  pathname: '/student/teams',
                }}
                className="text-sm/6 font-semibold"
              >
                Команды
              </Link>
              {showStudentLinks && (
                <Link
                  href={{
                    pathname: '/student/join-project',
                  }}
                  className="text-sm/6 font-semibold"
                >
                  Регистрация на проект
                </Link>
              )}
              {showCompanyLinks && (
                <Link
                  href={{
                    pathname: '/company/create-project',
                  }}
                  className="text-sm/6 font-semibold"
                >
                  Создать проект
                </Link>
              )}
            </>
          )}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-12">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative">
                  <User className="absolute -left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  {renderUserName()}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Мой профиль</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {showStudentLinks && (
                  <DropdownMenuItem>
                    <Link
                      href={{
                        pathname: '/me/favorite',
                      }}
                      className="w-full"
                    >
                      Избранное
                    </Link>
                  </DropdownMenuItem>
                )}
                {showAdminLinks && (
                  <DropdownMenuItem>
                    <Link href={{ pathname: '/admin' }} className="w-full">
                      Админка
                    </Link>
                  </DropdownMenuItem>
                )}
                {showCompanyLinks && (
                  <DropdownMenuItem>
                    <Link href={{ pathname: '/me/projects' }} className="w-full">
                      Мои проекты
                    </Link>
                  </DropdownMenuItem>
                )}
                {showCompanyLinks && (
                  <DropdownMenuItem>
                    <Link
                      href={{
                        pathname: '/me/settings',
                      }}
                      className="w-full"
                    >
                      Настройки
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link
                    href="/"
                    onClick={e => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="w-full "
                  >
                    Выйти
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="text-sm/6 font-semibold">
              Вход <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>

        <div className="hidden lg:block right-6 top-5">
          <ThemeChanger />
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
                <div className="-m-1.5 p-1.5 font-bold text-lg">{renderUserName()}</div>
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
                  {isAuthenticated && (
                    <>
                      {showAdminLinks && (
                        <Link
                          href="/admin"
                          className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-t-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Админка
                        </Link>
                      )}
                      <Link
                        href="/student/teams"
                        className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Команды
                      </Link>
                      {showStudentLinks && (
                        <Link
                          href={{ pathname: '/student/join-project' }}
                          className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Регистрация на проект
                        </Link>
                      )}
                      {showStudentLinks && (
                        <Link
                          href={{
                            pathname: '/me/favorite',
                          }}
                          className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Избранное
                        </Link>
                      )}
                      {showCompanyLinks && (
                        <Link
                          href={{ pathname: '/company/create-project' }}
                          className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Создать проект
                        </Link>
                      )}
                      {showCompanyLinks && (
                        <Link
                          href={{ pathname: '/me/projects' }}
                          className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Мои проекты
                        </Link>
                      )}
                      {showCompanyLinks && (
                        <Link
                          href={{ pathname: '/me/settings' }}
                          className="block px-3 py-3 text-base font-semibold w-full text-center md:text-left border-b-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Настройки
                        </Link>
                      )}
                    </>
                  )}
                  <div>
                    {isLoggedIn ? (
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full block border-b-2 px-3 py-3 h-auto opacity-100 md:text-left text-base font-semibold"
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
                </div>
                <div className="mt-2 max-w-fit ml-auto">
                  <ThemeChanger />
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

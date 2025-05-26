'use client';
import Link from 'next/link';
import {
  CircleUserRound,
  ClipboardList,
  FilePlus2,
  IdCard,
  Heart,
  LogOut,
  Plus,
  Presentation,
  Settings,
  Users,
} from 'lucide-react';
import { Roles } from '@/lib/constant/roles';
import { useAuth } from '@/lib/auth/use-auth';
import {
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME } from '@/lib/constant';
import { ThemeChanger } from '@/components/ui/theme-change';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MobileHeader() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const isActive = (targetPath: string) => pathname === targetPath;

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

  useEffect(() => {
    const mainElement = document.getElementById('main');

    if (!mainElement) return;

    if (isAuthenticated) {
      mainElement.classList.remove('mt-24');
    } else {
      mainElement.classList.add('mt-24');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Cookies.remove(JWT_COOKIE_NAME);
    logout();
    window.location.href = '/';
  };

  const showStudentLinks = user?.roles.includes(Roles.Student);
  const showAdminLinks = user?.roles.includes(Roles.Admin);
  const showCompanyLinks =
    user?.roles.includes(Roles.Admin) || user?.roles.includes(Roles.Company);

  if (isLoading) return null;

  return (
    <div>
      {isAuthenticated && (
        <header className="fixed w-full bottom-0 z-50 bg-background border-t-[1px] shadow-lg lg:hidden">
          <nav className="mx-auto flex items-center justify-between py-4 px-7">
            <Link
              href={{
                pathname: '/student/teams',
              }}
              className={
                isActive('/student/teams')
                  ? 'dark:text-white  text-black'
                  : 'text-gray-500 '
              }
            >
              <Users size={22} />
            </Link>

            {showStudentLinks && (
              <Link
                href={{
                  pathname: '/student/join-project',
                }}
                className={
                  isActive('/student/join-project')
                    ? 'dark:text-white  text-black'
                    : 'text-gray-500 '
                }
              >
                <Plus size={22} />
              </Link>
            )}

            {showCompanyLinks && (
              <Link
                href={{
                  pathname: '/company/create-project',
                }}
                className={
                  isActive('/company/create-project')
                    ? 'dark:text-white  text-black'
                    : 'text-gray-500 '
                }
              >
                <FilePlus2 />
              </Link>
            )}

            <Link
              href={{
                pathname: '/project',
              }}
              className={
                isActive('/project') ? 'dark:text-white  text-black' : 'text-gray-500 '
              }
            >
              <ClipboardList size={22} />
            </Link>

            {showCompanyLinks && (
              <Link
                href={{
                  pathname: '/me/projects',
                }}
                className={
                  isActive('/me/projects')
                    ? 'dark:text-white  text-black'
                    : 'text-gray-500 '
                }
              >
                <Presentation size={22} />
              </Link>
            )}

            {showStudentLinks && (
              <Link
                href={{
                  pathname: '/me/favorite',
                }}
                className={
                  isActive('/me/favorite')
                    ? 'dark:text-white  text-black'
                    : 'text-gray-500'
                }
              >
                <Heart size={22} />
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <CircleUserRound size={22} className="text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col ml-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{renderUserName()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {showAdminLinks && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      <IdCard className="mr-2 ml-1 h-4 w-4" />
                      Админ-панель
                    </DropdownMenuItem>
                  </Link>
                )}

                {showCompanyLinks && (
                  <Link href="/me/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 ml-1 h-4 w-4" />
                      Настройки
                    </DropdownMenuItem>
                  </Link>
                )}
                {showCompanyLinks && <DropdownMenuSeparator />}
                <div className="flex justify-between">
                  <div className="left-0 inline-flex">
                    <ThemeChanger />
                  </div>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="mr-2 ml-1 h-4 w-4" />
                    Выход
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </header>
      )}
    </div>
  );
}

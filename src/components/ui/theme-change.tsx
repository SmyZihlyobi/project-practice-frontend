'use client';

import { useEffect, useState } from 'react';

import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from './button';

type Theme = 'light' | 'dark' | 'system';

const THEMES: Theme[] = ['system', 'light', 'dark'];

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const index = THEMES.indexOf(theme as Theme);
    setCurrentThemeIndex(index >= 0 ? index : 0);
  }, [theme]);

  const getSelectedThemeIcon = (variant: Theme = 'system') => {
    switch (variant) {
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'system':
        return <SunMoon className="w-5 h-5" />;
      default:
        return <SunMoon className="w-5 h-5" />;
    }
  };

  const handleThemeChanged = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    setCurrentThemeIndex(nextThemeIndex);
    setTheme(THEMES[nextThemeIndex]);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className="block px-3 py-3 w-full h-full opacity-100 text-inherit"
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleThemeChanged}
      variant="ghost"
      className="block px-3 py-3 w-full h-full opacity-100 text-inherit"
      aria-label="Toggle theme"
    >
      {getSelectedThemeIcon(theme as Theme)}
    </Button>
  );
};

export { ThemeChanger };

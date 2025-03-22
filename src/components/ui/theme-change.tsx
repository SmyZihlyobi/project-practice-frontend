'use client';

import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEMES: Theme[] = ['system', 'light', 'dark'];

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);

  const getSelectedThemeIcon = (variant: Theme = 'system') => {
    switch (variant) {
      case 'dark':
        return <Moon />;
      case 'light':
        return <Sun />;
      case 'system':
        return <SunMoon />;
      default:
        return <SunMoon />;
    }
  };

  const handleThemeChanged = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    setCurrentThemeIndex(nextThemeIndex);
    setTheme(THEMES[nextThemeIndex]);
  };

  return (
    <Button
      onClick={handleThemeChanged}
      variant="ghost"
      className="block px-3 py-3 w-full h-full opacity-100 text-inherit"
    >
      {getSelectedThemeIcon(theme as Theme)}
    </Button>
  );
};

export { ThemeChanger };

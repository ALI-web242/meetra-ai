'use client';

import { useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useThemeStore, Theme } from '@/stores/themeStore';

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'bright', label: 'Bright', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
            theme === t.value
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title={`Switch to ${t.label} theme`}
        >
          {t.icon}
          <span className="text-sm font-medium hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

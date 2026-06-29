// components/providers/ThemeProvider.jsx
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/useThemeStore';

export default function ThemeProvider({ children }) {
  const { theme, isMounted, setMounted } = useThemeStore();

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted();
  }, [setMounted]);

  // Sync theme with DOM
  useEffect(() => {
    if (isMounted) {
      const html = document.documentElement;
      const root = document.getElementById('__next');
      
      // Add/remove dark class
      if (theme === 'dark') {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
      } else {
        html.classList.remove('dark');
        html.style.colorScheme = 'light';
      }

      // Optional: Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }
  }, [theme, isMounted]);

  // Prevent flash of wrong theme
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-brown-900" />
    );
  }

  return <>{children}</>;
}
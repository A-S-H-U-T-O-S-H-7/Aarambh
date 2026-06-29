// hooks/useTheme.js
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useEffect, useState } from 'react';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme, isMounted } = useThemeStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return theme with client-side safety
  return {
    theme: isClient ? theme : 'light',
    isDark: isClient ? theme === 'dark' : false,
    isLight: isClient ? theme === 'light' : true,
    isMounted: isMounted && isClient,
    toggleTheme,
    setTheme,
  };
};
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'cosmic' | 'emerald' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 * Manages three modern startup themes: Cosmic (purple), Emerald (green), Sunset (orange)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('cosmic');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['cosmic', 'emerald', 'sunset'].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('cosmic');
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['cosmic', 'emerald', 'sunset'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const applyTheme = (selectedTheme: Theme) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    const themes = {
      cosmic: {
        primary: '#a855f7',
        primaryLight: '#c084fc',
        primaryDark: '#7c3aed',
        accent1: '#ec4899',
        accent2: '#ef4444',
        accent3: '#facc15',
      },
      emerald: {
        primary: '#10b981',
        primaryLight: '#34d399',
        primaryDark: '#059669',
        accent1: '#06b6d4',
        accent2: '#8b5cf6',
        accent3: '#f59e0b',
      },
      sunset: {
        primary: '#f97316',
        primaryLight: '#fb923c',
        primaryDark: '#ea580c',
        accent1: '#ef4444',
        accent2: '#ec4899',
        accent3: '#fbbf24',
      },
    };

    const selectedColors = themes[selectedTheme];
    root.style.setProperty('--color-primary', selectedColors.primary);
    root.style.setProperty('--color-primary-light', selectedColors.primaryLight);
    root.style.setProperty('--color-primary-dark', selectedColors.primaryDark);
    root.style.setProperty('--color-accent-1', selectedColors.accent1);
    root.style.setProperty('--color-accent-2', selectedColors.accent2);
    root.style.setProperty('--color-accent-3', selectedColors.accent3);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a default context for SSR
    return {
      theme: 'cosmic' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

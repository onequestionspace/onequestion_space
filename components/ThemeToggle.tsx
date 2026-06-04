'use client';

import { useTheme, type Theme } from '@/lib/theme-context';
import { useState, useEffect } from 'react';

/**
 * Theme Toggle Component
 * Displays three theme options: Cosmic, Emerald, Sunset
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes: { id: Theme; name: string; icon: string; description: string }[] = [
    {
      id: 'cosmic',
      name: 'Cosmic',
      icon: '🌌',
      description: 'Purple & Pink - Modern & Bold',
    },
    {
      id: 'emerald',
      name: 'Emerald',
      icon: '🌿',
      description: 'Green & Cyan - Fresh & Growth',
    },
    {
      id: 'sunset',
      name: 'Sunset',
      icon: '🌅',
      description: 'Orange & Red - Warm & Energy',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        title="Toggle theme"
      >
        <span className="text-xl">
          {theme === 'cosmic' && '🌌'}
          {theme === 'emerald' && '🌿'}
          {theme === 'sunset' && '🌅'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-white/10 rounded-xl shadow-glow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Choose Theme
            </p>
          </div>
          <div className="p-2 space-y-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  theme === t.id
                    ? 'bg-primary/20 border border-primary/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  {theme === t.id && (
                    <span className="text-primary text-lg">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

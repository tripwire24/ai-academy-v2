'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <div className="flex items-center space-x-1 border border-border rounded-full p-1 bg-surface-elevated">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'light' ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'
        }`}
        aria-label="Light theme"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'dark' ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'
        }`}
        aria-label="Dark theme"
      >
        <Moon size={14} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-full transition-colors ${
          theme === 'system' ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'
        }`}
        aria-label="System theme"
      >
        <Monitor size={14} />
      </button>
    </div>
  );
}

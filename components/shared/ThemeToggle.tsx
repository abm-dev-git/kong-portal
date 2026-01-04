'use client';

import { useTheme } from '@/lib/context/theme-context';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ThemeToggle({ className, showLabel = false, size = 'md' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showLabel && (
        <span className="text-sm text-[var(--cream)]/70 mr-2">Theme</span>
      )}
      <div className="flex items-center rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 p-0.5">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            buttonSize,
            'rounded-md transition-colors',
            theme === 'light'
              ? 'bg-[var(--turquoise)]/20 text-[var(--turquoise)]'
              : 'text-[var(--cream)]/60 hover:text-[var(--cream)]'
          )}
          aria-label="Light theme"
          title="Light theme"
        >
          <Sun className={iconSize} />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            buttonSize,
            'rounded-md transition-colors',
            theme === 'dark'
              ? 'bg-[var(--turquoise)]/20 text-[var(--turquoise)]'
              : 'text-[var(--cream)]/60 hover:text-[var(--cream)]'
          )}
          aria-label="Dark theme"
          title="Dark theme"
        >
          <Moon className={iconSize} />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={cn(
            buttonSize,
            'rounded-md transition-colors',
            theme === 'system'
              ? 'bg-[var(--turquoise)]/20 text-[var(--turquoise)]'
              : 'text-[var(--cream)]/60 hover:text-[var(--cream)]'
          )}
          aria-label="System theme"
          title="System theme"
        >
          <Monitor className={iconSize} />
        </button>
      </div>
    </div>
  );
}

// Simple toggle button for mobile or compact spaces
export function ThemeToggleSimple({ className }: { className?: string }) {
  const { toggleTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-md transition-colors',
        'text-[var(--cream)]/60 hover:text-[var(--cream)]',
        'hover:bg-[var(--turquoise)]/10',
        className
      )}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

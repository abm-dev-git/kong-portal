'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  LogOut,
  Settings,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  User,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useTheme } from '@/lib/context/theme-context';

interface UserMenuProps {
  size?: 'sm' | 'md';
  showDashboardLink?: boolean;
}

export function UserMenu({ size = 'md', showDashboardLink = false }: UserMenuProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress;
  const name = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.username || email;

  const handleSignOut = () => {
    setIsOpen(false);
    signOut({ redirectUrl: '/' });
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-full transition-colors',
          'hover:ring-2 hover:ring-[var(--turquoise)]/30',
          'focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <UserAvatar
          email={email}
          name={name}
          size={size === 'sm' ? 'sm' : 'md'}
        />
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--cream)]/60 transition-transform hidden sm:block',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-64 py-2',
            'bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl',
            'animate-in fade-in-0 zoom-in-95 duration-100'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-[var(--turquoise)]/10">
            <div className="flex items-center gap-3">
              <UserAvatar email={email} name={name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--cream)] truncate">
                  {name}
                </p>
                <p className="text-xs text-[var(--cream)]/60 truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {showDashboardLink && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--cream)] hover:bg-[var(--turquoise)]/10 transition-colors"
                role="menuitem"
              >
                <LayoutDashboard className="w-4 h-4 text-[var(--cream)]/60" />
                Dashboard
              </Link>
            )}

            <Link
              href="/settings/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--cream)] hover:bg-[var(--turquoise)]/10 transition-colors"
              role="menuitem"
            >
              <User className="w-4 h-4 text-[var(--cream)]/60" />
              Account Settings
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--cream)] hover:bg-[var(--turquoise)]/10 transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-[var(--cream)]/60" />
              Settings
            </Link>
          </div>

          {/* Theme Selection */}
          <div className="py-1 border-t border-[var(--turquoise)]/10">
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-[var(--cream)]/50 uppercase tracking-wide mb-2">
                Theme
              </p>
              <div className="flex gap-1">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors',
                      theme === value
                        ? 'bg-[var(--turquoise)]/20 text-[var(--turquoise)]'
                        : 'text-[var(--cream)]/60 hover:bg-[var(--turquoise)]/10 hover:text-[var(--cream)]'
                    )}
                    title={`${label} theme`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="py-1 border-t border-[var(--turquoise)]/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

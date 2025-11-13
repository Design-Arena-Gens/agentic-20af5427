"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { getCurrentUser } from '../lib/session-client';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-950/70 border-b border-gray-200 dark:border-gray-800">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="font-bold text-lg">Akari</Link>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/planner" className="hover:text-brand-600">Planner</Link>
          <Link href="/diff" className="hover:text-brand-600">Diff</Link>
          <Link href="/translator" className="hover:text-brand-600">Translator</Link>
          <Link href="/profile" className="hover:text-brand-600">Profile</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user ? (
            <Link href="/profile" className="px-3 py-1.5 rounded bg-brand-600 text-white text-sm">{user.email}</Link>
          ) : (
            <Link href="/login" className="px-3 py-1.5 rounded border text-sm">Sign in</Link>
          )}
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="container max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link href="/planner" onClick={() => setOpen(false)}>Planner</Link>
            <Link href="/diff" onClick={() => setOpen(false)}>Diff</Link>
            <Link href="/translator" onClick={() => setOpen(false)}>Translator</Link>
            <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
          </div>
        </div>
      )}
    </header>
  );
}

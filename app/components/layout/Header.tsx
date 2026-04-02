'use client';

import { Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RoleDropdown from './RoleDropdown';

interface HeaderProps {
  onMenuClick: () => void;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function Header({ onMenuClick, pageTitle, pageSubtitle }: HeaderProps) {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <header className="h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 lg:px-5 gap-3 sticky top-0 z-10 shrink-0">
      <button
        onClick={onMenuClick}
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{pageTitle}</h1>
          {pageSubtitle && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700 text-sm hidden sm:inline">/</span>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block truncate">
                {pageSubtitle}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <RoleDropdown />

        <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

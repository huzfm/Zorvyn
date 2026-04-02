'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-full w-[248px] z-30',
          'flex flex-col',
          'bg-white dark:bg-zinc-950',
          'border-r border-zinc-200 dark:border-zinc-800',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto lg:shrink-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between h-14 px-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-white dark:text-zinc-900"
              >
                <path
                  d="M2 10.5L5.5 7L8 9.5L12 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="4" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-zinc-900 dark:text-zinc-50">
              Zoryn
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-2 mb-2 mt-1">
            Menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100',
                ].join(' ')}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3.5 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
              U
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                Personal Account
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 truncate">Finance Dashboard</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

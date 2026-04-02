'use client';

import { Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ViewerNotice() {
  const { role, setRole } = useApp();

  if (role !== 'viewer') return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs">
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">View-only mode.</span>
          {' '}You can browse, filter, and export data, but cannot add, edit, or delete transactions.
        </span>
      </div>
      <button
        onClick={() => setRole('admin')}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium whitespace-nowrap hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shrink-0"
      >
        <ShieldCheck className="w-3 h-3" />
        Switch to Admin
      </button>
    </div>
  );
}

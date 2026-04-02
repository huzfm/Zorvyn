'use client';

import { ShieldCheck, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RoleDropdown() {
  const { role, setRole } = useApp();

  return (
    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-md p-0.5 gap-0.5">
      <button
        onClick={() => setRole('admin')}
        className={[
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors capitalize',
          role === 'admin'
            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200',
        ].join(' ')}
      >
        <ShieldCheck className="w-3 h-3" />
        <span className="hidden sm:inline">Admin</span>
      </button>

      <button
        onClick={() => setRole('viewer')}
        className={[
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors capitalize',
          role === 'viewer'
            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200',
        ].join(' ')}
      >
        <Eye className="w-3 h-3" />
        <span className="hidden sm:inline">Viewer</span>
      </button>
    </div>
  );
}

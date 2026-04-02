'use client';

import Link from 'next/link';
import { ArrowRight, Inbox } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';

export default function RecentTransactions() {
  const { transactions } = useApp();

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 8);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">
            Recent
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Transactions</p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Inbox className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
          {recent.map((t, i) => {
            const color = CATEGORY_COLORS[t.category] ?? '#71717a';
            return (
              <div
                key={t.id}
                className={[
                  'flex items-center gap-3.5 px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors',
                  i === recent.length - 1 ? 'rounded-b-xl' : '',
                ].join(' ')}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                    {t.description}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>

                <span
                  className={[
                    'text-sm font-semibold tabular-nums shrink-0',
                    t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-900 dark:text-zinc-100',
                  ].join(' ')}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

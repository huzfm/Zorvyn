'use client';

import { Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/mockData';

export default function TransactionFilters() {
  const { filters, setFilters, resetFilters } = useApp();

  const hasActiveFilters =
    filters.search ||
    filters.type !== 'all' ||
    filters.category ||
    filters.dateFrom ||
    filters.dateTo;

  const inputCls = [
    'w-full h-9 px-3 text-sm rounded-md',
    'bg-white dark:bg-zinc-900',
    'border border-zinc-200 dark:border-zinc-800',
    'text-zinc-900 dark:text-zinc-100',
    'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
    'focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100',
    'focus:border-zinc-900 dark:focus:border-zinc-100',
  ].join(' ');

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by description or category…"
          value={filters.search}
          onChange={e => setFilters({ search: e.target.value })}
          className={`${inputCls} pl-8`}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={filters.type}
          onChange={e => setFilters({ type: e.target.value as 'all' | 'income' | 'expense' })}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={e => setFilters({ category: e.target.value })}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="">All categories</option>
          <optgroup label="Expenses">
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Income">
            {INCOME_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-1 px-0.5">From</p>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters({ dateFrom: e.target.value })}
            className={`${inputCls} cursor-pointer`}
          />
        </div>
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-1 px-0.5">To</p>
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters({ dateTo: e.target.value })}
            className={`${inputCls} cursor-pointer`}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 w-full justify-center h-8 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors border border-dashed border-zinc-200 dark:border-zinc-700"
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>
      )}
    </div>
  );
}

'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
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

  const baseInput = [
    'px-3 py-1.5 h-9 text-sm',
    'bg-white dark:bg-zinc-900',
    'border border-zinc-200 dark:border-zinc-800',
    'rounded-md',
    'text-zinc-900 dark:text-zinc-100',
    'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
    'focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100',
    'transition-shadow',
  ].join(' ');

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 px-1 self-center">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </div>

        <div className="w-px bg-zinc-200 dark:bg-zinc-800 self-stretch mx-0.5" />

        <div className="flex-1 min-w-44 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={filters.search}
            onChange={e => setFilters({ search: e.target.value })}
            className={`w-full pl-8 pr-2.5 ${baseInput}`}
          />
        </div>

        <select
          value={filters.type}
          onChange={e => setFilters({ type: e.target.value as 'all' | 'income' | 'expense' })}
          className={`${baseInput} cursor-pointer pr-7`}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={e => setFilters({ category: e.target.value })}
          className={`${baseInput} cursor-pointer pr-7`}
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

        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => setFilters({ dateFrom: e.target.value })}
          className={`${baseInput} cursor-pointer`}
          title="From"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={e => setFilters({ dateTo: e.target.value })}
          className={`${baseInput} cursor-pointer`}
          title="To"
        />

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 h-9 px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

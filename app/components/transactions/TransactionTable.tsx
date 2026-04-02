'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';
import { SortField, Transaction } from '../../types';
import TransactionModal from './TransactionModal';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

const PAGE_SIZE = 15;

export default function TransactionTable() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paged = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field: SortField) {
    setFilters(
      filters.sortField === field
        ? { sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' }
        : { sortField: field, sortDir: 'desc' }
    );
    setPage(1);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (filters.sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return filters.sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3" />
      : <ArrowDown className="w-3 h-3" />;
  }

  function handleEdit(t: Transaction) {
    setEditTarget(t);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this transaction? This cannot be undone.')) {
      deleteTransaction(id);
    }
  }

  const thBtn =
    'flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap';

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {filteredTransactions.length}{' '}
          {filteredTransactions.length === 1 ? 'result' : 'results'}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => setExportOpen(v => !v)}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            {exportOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden w-36 py-1">
                  <button
                    onClick={() => { exportToCSV(filteredTransactions); setExportOpen(false); }}
                    className="w-full px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => { exportToJSON(filteredTransactions); setExportOpen(false); }}
                    className="w-full px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Export as JSON
                  </button>
                </div>
              </>
            )}
          </div>

          {role === 'admin' ? (
            <button
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div
              title="Switch to Admin role to add transactions"
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-zinc-300 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-md cursor-not-allowed select-none"
            >
              <Lock className="w-3.5 h-3.5" />
              Add
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5">
            <Inbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm font-medium text-zinc-400 dark:text-zinc-600">No transactions found</p>
            <p className="text-xs text-zinc-300 dark:text-zinc-700">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {paged.map(t => {
                const color = CATEGORY_COLORS[t.category] ?? '#71717a';
                return (
                  <div key={t.id} className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                          style={{ backgroundColor: color }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {t.description}
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
                            {formatDate(t.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={[
                            'text-sm font-semibold tabular-nums',
                            t.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-zinc-900 dark:text-zinc-100',
                          ].join(' ')}
                        >
                          {t.type === 'income' ? '+' : '−'}
                          {formatCurrency(t.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pl-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: `${color}18`, color }}
                        >
                          {t.category}
                        </span>
                        <span
                          className={[
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            t.type === 'income'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
                          ].join(' ')}
                        >
                          {t.type}
                        </span>
                      </div>
                      {role === 'admin' && (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleEdit(t)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3 w-28">
                      <button onClick={() => handleSort('date')} className={thBtn}>
                        Date <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button onClick={() => handleSort('description')} className={thBtn}>
                        Description <SortIcon field="description" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">
                      <button onClick={() => handleSort('category')} className={thBtn}>
                        Category <SortIcon field="category" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Type
                      </span>
                    </th>
                    <th className="text-right px-4 py-3">
                      <button onClick={() => handleSort('amount')} className={`${thBtn} ml-auto`}>
                        Amount <SortIcon field="amount" />
                      </button>
                    </th>
                    {role === 'admin' && <th className="px-4 py-3 w-20" />}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((t, i) => {
                    const color = CATEGORY_COLORS[t.category] ?? '#71717a';
                    return (
                      <tr
                        key={t.id}
                        className={[
                          'border-b border-zinc-50 dark:border-zinc-800/50 last:border-0',
                          'hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors',
                          i % 2 !== 0 ? 'bg-zinc-50/40 dark:bg-zinc-800/10' : '',
                        ].join(' ')}
                      >
                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                          {formatDate(t.date)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] lg:max-w-xs">
                            {t.description}
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-600 md:hidden mt-0.5">
                            {t.category}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${color}18`, color }}
                          >
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span
                            className={[
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                              t.type === 'income'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
                            ].join(' ')}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span
                            className={[
                              'text-sm font-semibold tabular-nums',
                              t.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-zinc-900 dark:text-zinc-100',
                            ].join(' ')}
                          >
                            {t.type === 'income' ? '+' : '−'}
                            {formatCurrency(t.amount)}
                          </span>
                        </td>
                        {role === 'admin' && (
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-0.5">
                              <button
                                onClick={() => handleEdit(t)}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(t.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 dark:text-zinc-600">
                  {page} / {totalPages}
                </p>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pg = i + 1;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={[
                          'w-7 h-7 rounded-md text-xs font-medium transition-colors',
                          page === pg
                            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                        ].join(' ')}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        transaction={editTarget}
      />
    </>
  );
}

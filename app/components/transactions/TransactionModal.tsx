'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/mockData';

interface Props {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

type FormState = {
  date: string;
  description: string;
  amount: string;
  category: string;
  type: TransactionType;
};

const EMPTY_FORM: FormState = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  category: '',
  type: 'expense',
};

export default function TransactionModal({ open, onClose, transaction }: Props) {
  const { addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const descRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm(
      transaction
        ? {
            date: transaction.date,
            description: transaction.description,
            amount: String(transaction.amount),
            category: transaction.category,
            type: transaction.type,
          }
        : { ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] }
    );
    setErrors({});
    setTimeout(() => descRef.current?.focus(), 100);
  }, [transaction, open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function patch(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate(): Partial<FormState> {
    const e: Partial<FormState> = {};
    if (!form.date) e.date = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid positive amount';
    if (!form.category) e.category = 'Required';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const data = {
      date: form.date,
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
    };
    transaction ? updateTransaction(transaction.id, data) : addTransaction(data);
    onClose();
  }

  if (!open) return null;

  const inputCls = [
    'w-full h-9 px-3 text-sm rounded-md',
    'bg-white dark:bg-zinc-800',
    'border border-zinc-200 dark:border-zinc-700',
    'text-zinc-900 dark:text-zinc-100',
    'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
    'focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100',
    'focus:border-zinc-900 dark:focus:border-zinc-100 transition-shadow',
  ].join(' ');

  const labelCls = 'block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-wider font-medium mb-0.5">
              {transaction ? 'Editing' : 'New entry'}
            </p>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className={labelCls}>Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['expense', 'income'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t, category: '' }))}
                  className={[
                    'h-9 rounded-md text-sm font-medium capitalize transition-colors border',
                    form.type === t
                      ? t === 'income'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50 text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <input
              ref={descRef}
              type="text"
              placeholder="e.g. Monthly Salary, Grocery Store…"
              value={form.description}
              onChange={e => patch('description', e.target.value)}
              className={inputCls}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount (USD)</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={e => patch('amount', e.target.value)}
                className={inputCls}
              />
              {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => patch('date', e.target.value)}
                className={inputCls}
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <select
              value={form.category}
              onChange={e => patch('category', e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-9 rounded-md text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Transaction, CategoryBreakdown, MonthlyData, FilterState } from '../types';
import { CATEGORY_COLORS } from '../data/mockData';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getMonthKey(dateStr: string): string {
  return dateStr.substring(0, 7);
}

export function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
}

export function computeSummaryStats(transactions: Transaction[]) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyTransactions = transactions.filter(t => getMonthKey(t.date) === currentMonth);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  const prevMonthlyTransactions = transactions.filter(t => getMonthKey(t.date) === prevMonth);

  const prevMonthlyIncome = prevMonthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const prevMonthlyExpenses = prevMonthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance: monthlyIncome - monthlyExpenses,
    prevMonthlyIncome,
    prevMonthlyExpenses,
  };
}

export function computeCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const expenseMap = new Map<string, { amount: number; count: number }>();

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const existing = expenseMap.get(t.category) ?? { amount: 0, count: 0 };
      expenseMap.set(t.category, {
        amount: existing.amount + t.amount,
        count: existing.count + 1,
      });
    });

  const totalExpenses = Array.from(expenseMap.values()).reduce((s, v) => s + v.amount, 0);

  return Array.from(expenseMap.entries())
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      color: CATEGORY_COLORS[category] ?? '#94a3b8',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const monthMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach(t => {
    const key = getMonthKey(t.date);
    const existing = monthMap.get(key) ?? { income: 0, expenses: 0 };
    if (t.type === 'income') {
      monthMap.set(key, { ...existing, income: existing.income + t.amount });
    } else {
      monthMap.set(key, { ...existing, expenses: existing.expenses + t.amount });
    }
  });

  return Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, data]) => ({
      month: getMonthLabel(key),
      fullMonth: key,
      income: data.income,
      expenses: data.expenses,
      balance: data.income - data.expenses,
    }));
}

export function applyFilters(transactions: Transaction[], filters: FilterState): Transaction[] {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type);
  }

  if (filters.category) {
    result = result.filter(t => t.category === filters.category);
  }

  if (filters.dateFrom) {
    result = result.filter(t => t.date >= filters.dateFrom);
  }

  if (filters.dateTo) {
    result = result.filter(t => t.date <= filters.dateTo);
  }

  result.sort((a, b) => {
    const dir = filters.sortDir === 'asc' ? 1 : -1;
    switch (filters.sortField) {
      case 'date':
        return dir * a.date.localeCompare(b.date);
      case 'amount':
        return dir * (a.amount - b.amount);
      case 'description':
        return dir * a.description.localeCompare(b.description);
      case 'category':
        return dir * a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return result;
}

export function generateId(): string {
  return `t${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

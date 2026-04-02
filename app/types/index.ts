export type TransactionType = 'income' | 'expense';
export type Role = 'admin' | 'viewer';
export type SortField = 'date' | 'amount' | 'description' | 'category';
export type SortDir = 'asc' | 'desc';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface FilterState {
  search: string;
  type: 'all' | TransactionType;
  category: string;
  dateFrom: string;
  dateTo: string;
  sortField: SortField;
  sortDir: SortDir;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  count: number;
}

export interface MonthlyData {
  month: string;
  fullMonth: string;
  income: number;
  expenses: number;
  balance: number;
}

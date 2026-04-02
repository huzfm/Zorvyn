'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { Transaction, FilterState, Role, CategoryBreakdown, MonthlyData } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import {
  computeSummaryStats,
  computeCategoryBreakdown,
  computeMonthlyData,
  applyFilters,
  generateId,
} from '../utils/helpers';

const LS_TRANSACTIONS = 'zoryn_transactions';
const LS_ROLE = 'zoryn_role';
const LS_DARK = 'zoryn_dark';

interface AppContextType {
  transactions: Transaction[];
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  role: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
  summaryStats: ReturnType<typeof computeSummaryStats>;
  categoryBreakdown: CategoryBreakdown[];
  monthlyData: MonthlyData[];
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: '',
  dateFrom: '',
  dateTo: '',
  sortField: 'date',
  sortDir: 'desc',
};

const AppContext = createContext<AppContextType | null>(null);

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; data: Partial<Omit<Transaction, 'id'>> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'SET_DARK'; payload: boolean }
  | { type: 'TOGGLE_DARK' };

interface State {
  transactions: Transaction[];
  filters: FilterState;
  role: Role;
  darkMode: boolean;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_DARK':
      return { ...state, darkMode: action.payload };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    transactions: INITIAL_TRANSACTIONS,
    filters: defaultFilters,
    role: 'admin' as Role,
    darkMode: false,
  });

  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(LS_TRANSACTIONS);
      if (savedTransactions) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) });
      }
      const savedRole = localStorage.getItem(LS_ROLE) as Role | null;
      if (savedRole === 'admin' || savedRole === 'viewer') {
        dispatch({ type: 'SET_ROLE', payload: savedRole });
      }
      const savedDark = localStorage.getItem(LS_DARK);
      if (savedDark !== null) {
        dispatch({ type: 'SET_DARK', payload: savedDark === 'true' });
      } else {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
        dispatch({ type: 'SET_DARK', payload: prefersDark });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(state.transactions)); } catch {}
  }, [state.transactions]);

  useEffect(() => {
    try { localStorage.setItem(LS_ROLE, state.role); } catch {}
  }, [state.role]);

  useEffect(() => {
    try { localStorage.setItem(LS_DARK, String(state.darkMode)); } catch {}
  }, [state.darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const filteredTransactions = useMemo(
    () => applyFilters(state.transactions, state.filters),
    [state.transactions, state.filters]
  );

  const summaryStats = useMemo(() => computeSummaryStats(state.transactions), [state.transactions]);
  const categoryBreakdown = useMemo(() => computeCategoryBreakdown(state.transactions), [state.transactions]);
  const monthlyData = useMemo(() => computeMonthlyData(state.transactions), [state.transactions]);

  const value: AppContextType = {
    transactions: state.transactions,
    filters: state.filters,
    setFilters: filters => dispatch({ type: 'SET_FILTERS', payload: filters }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    role: state.role,
    setRole: role => dispatch({ type: 'SET_ROLE', payload: role }),
    darkMode: state.darkMode,
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK' }),
    addTransaction: t =>
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...t, id: generateId() } }),
    updateTransaction: (id, data) =>
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, data } }),
    deleteTransaction: id => dispatch({ type: 'DELETE_TRANSACTION', payload: id }),
    filteredTransactions,
    summaryStats,
    categoryBreakdown,
    monthlyData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

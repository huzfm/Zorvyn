import { Transaction } from '../types';
import { formatDate } from './helpers';

export function exportToCSV(transactions: Transaction[], filename = 'transactions'): void {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    formatDate(t.date),
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.amount.toFixed(2),
  ]);

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(transactions: Transaction[], filename = 'transactions'): void {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="space-y-4 max-w-screen-xl mx-auto">
      <TransactionFilters />
      <TransactionTable />
    </div>
  );
}

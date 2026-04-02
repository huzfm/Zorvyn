import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import ViewerNotice from '../components/layout/ViewerNotice';

export default function TransactionsPage() {
  return (
    <div className="space-y-3 max-w-screen-xl mx-auto">
      <ViewerNotice />
      <TransactionFilters />
      <TransactionTable />
    </div>
  );
}

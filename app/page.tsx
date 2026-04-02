import SummaryCards from './components/dashboard/SummaryCards';
import BalanceTrendChart from './components/dashboard/BalanceTrendChart';
import SpendingBreakdownChart from './components/dashboard/SpendingBreakdownChart';
import RecentTransactions from './components/dashboard/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingBreakdownChart />
        </div>
      </div>
      <RecentTransactions />
    </div>
  );
}

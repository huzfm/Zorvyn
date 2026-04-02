'use client';

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, percentageChange } from '../../utils/helpers';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  positiveIsUp?: boolean;
  icon: React.ReactNode;
  accent: 'neutral' | 'green' | 'red' | 'purple';
}

const accentStyles = {
  neutral: {
    iconBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    border: '',
  },
  green: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    border: '',
  },
  red: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    border: '',
  },
  purple: {
    iconBg: 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400',
    border: '',
  },
};

function StatCard({ label, value, change, positiveIsUp, icon, accent }: StatCardProps) {
  const styles = accentStyles[accent];
  const hasChange = change !== undefined && change !== 0;
  const isUp = (change ?? 0) > 0;
  const isGood = positiveIsUp === undefined ? null : positiveIsUp ? isUp : !isUp;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${styles.iconBg}`}>
          {icon}
        </div>
      </div>

      <div>
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums tracking-tight">
          {value}
        </p>

        {hasChange ? (
          <div
            className={[
              'flex items-center gap-1 mt-1.5 text-xs font-medium',
              isGood === true
                ? 'text-emerald-600 dark:text-emerald-400'
                : isGood === false
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-zinc-500 dark:text-zinc-400',
            ].join(' ')}
          >
            {isUp ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(change!).toFixed(1)}% vs last month
          </div>
        ) : (
          <p className="flex items-center gap-1 mt-1.5 text-xs text-zinc-400 dark:text-zinc-600">
            <Minus className="w-3 h-3" />
            All time
          </p>
        )}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { summaryStats } = useApp();
  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    prevMonthlyIncome,
    prevMonthlyExpenses,
  } = summaryStats;

  const monthlyNet = monthlyIncome - monthlyExpenses;
  const prevNet = prevMonthlyIncome - prevMonthlyExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <StatCard
        label="Total Balance"
        value={formatCurrency(totalBalance)}
        icon={<TrendingUp className="w-4 h-4" />}
        accent="neutral"
      />
      <StatCard
        label="Total Income"
        value={formatCurrency(totalIncome)}
        change={percentageChange(monthlyIncome, prevMonthlyIncome)}
        positiveIsUp={true}
        icon={<ArrowUpRight className="w-4 h-4" />}
        accent="green"
      />
      <StatCard
        label="Total Expenses"
        value={formatCurrency(totalExpenses)}
        change={percentageChange(monthlyExpenses, prevMonthlyExpenses)}
        positiveIsUp={false}
        icon={<ArrowDownRight className="w-4 h-4" />}
        accent="red"
      />
      <StatCard
        label="This Month Net"
        value={formatCurrency(monthlyNet)}
        change={percentageChange(monthlyNet, prevNet)}
        positiveIsUp={true}
        icon={<TrendingDown className="w-4 h-4" />}
        accent="purple"
      />
    </div>
  );
}

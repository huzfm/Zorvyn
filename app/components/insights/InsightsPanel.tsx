'use client';

import {
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Target,
  Repeat,
  BarChart3,
  PiggyBank,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';

interface InsightCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}

function InsightCard({ icon, label, value, sub, positive }: InsightCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </p>
        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {value}
        </p>
        {sub && (
          <p
            className={[
              'text-xs mt-1 flex items-center gap-1',
              positive === true
                ? 'text-emerald-600 dark:text-emerald-400'
                : positive === false
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-zinc-400 dark:text-zinc-600',
            ].join(' ')}
          >
            {positive === true && <ArrowUpRight className="w-3 h-3" />}
            {positive === false && <ArrowDownRight className="w-3 h-3" />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

interface TooltipPayloadItem { dataKey: string; value: number; }
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="text-zinc-500 dark:text-zinc-400 capitalize">{p.dataKey}</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPanel() {
  const { transactions, categoryBreakdown, monthlyData, darkMode } = useApp();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <BarChart3 className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
        <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400">No data yet</p>
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          Add transactions to start seeing insights
        </p>
      </div>
    );
  }

  const gridColor = darkMode ? '#27272a' : '#f4f4f5';
  const tickColor = darkMode ? '#71717a' : '#a1a1aa';

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const avgMonthlyExpenses = monthlyData.length > 0
    ? monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length : 0;
  const avgMonthlyIncome = monthlyData.length > 0
    ? monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length : 0;

  const bestMonth = monthlyData.length > 0
    ? monthlyData.reduce((b, m) => m.balance > b.balance ? m : b, monthlyData[0]) : null;
  const worstMonth = monthlyData.length > 0
    ? monthlyData.reduce((w, m) => m.expenses > w.expenses ? m : w, monthlyData[0]) : null;

  const freqMap = new Map<string, number>();
  transactions.filter(t => t.type === 'expense').forEach(t =>
    freqMap.set(t.category, (freqMap.get(t.category) ?? 0) + 1)
  );
  const mostFrequent = [...freqMap.entries()].sort((a, b) => b[1] - a[1])[0];

  const expenseDates = transactions.filter(t => t.type === 'expense').map(t => t.date);
  const minDate = expenseDates.length ? expenseDates.reduce((a, b) => a < b ? a : b) : null;
  const maxDate = expenseDates.length ? expenseDates.reduce((a, b) => a > b ? a : b) : null;
  const daysDiff = minDate && maxDate
    ? Math.max(1, Math.ceil((new Date(maxDate).getTime() - new Date(minDate).getTime()) / 86400000)) : 1;
  const avgDailyExpense = totalExpenses / daysDiff;

  const topCategory = categoryBreakdown[0];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {topCategory && (
          <InsightCard
            icon={<Award className="w-3.5 h-3.5" />}
            label="Top Spending"
            value={topCategory.category}
            sub={`${formatCurrency(topCategory.amount)} · ${topCategory.percentage.toFixed(1)}%`}
            positive={false}
          />
        )}
        <InsightCard
          icon={<PiggyBank className="w-3.5 h-3.5" />}
          label="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          sub={`${formatCurrency(totalIncome - totalExpenses)} saved total`}
          positive={savingsRate >= 15}
        />
        <InsightCard
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Avg Daily Spend"
          value={formatCurrency(avgDailyExpense)}
          sub="Based on tracked period"
        />
        <InsightCard
          icon={<Target className="w-3.5 h-3.5" />}
          label="Avg Monthly Expenses"
          value={formatCurrency(avgMonthlyExpenses)}
          sub={`Avg income ${formatCurrency(avgMonthlyIncome)}/mo`}
        />
        {mostFrequent && (
          <InsightCard
            icon={<Repeat className="w-3.5 h-3.5" />}
            label="Most Frequent"
            value={mostFrequent[0]}
            sub={`${mostFrequent[1]} transactions`}
          />
        )}
        {bestMonth && (
          <InsightCard
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            label="Best Month"
            value={bestMonth.month}
            sub={`Saved ${formatCurrency(bestMonth.balance)}`}
            positive={true}
          />
        )}
        {worstMonth && (
          <InsightCard
            icon={<TrendingDown className="w-3.5 h-3.5" />}
            label="Highest Spend Month"
            value={worstMonth.month}
            sub={`Spent ${formatCurrency(worstMonth.expenses)}`}
            positive={false}
          />
        )}
        <InsightCard
          icon={<Zap className="w-3.5 h-3.5" />}
          label="Total Transactions"
          value={`${transactions.length}`}
          sub={`${transactions.filter(t => t.type === 'income').length} income · ${transactions.filter(t => t.type === 'expense').length} expense`}
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Comparison
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Monthly Income vs Expenses
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
              Expenses
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              width={38}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: gridColor }} />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <div className="mb-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Breakdown
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Expenses by Category
          </p>
        </div>
        <div className="space-y-3.5">
          {categoryBreakdown.slice(0, 9).map(cat => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{cat.category}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-600">
                    ({cat.count})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {formatCurrency(cat.amount)}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-600 w-8 text-right tabular-nums">
                    {cat.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

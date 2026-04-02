'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-500 dark:text-zinc-400 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BalanceTrendChart() {
  const { monthlyData, darkMode } = useApp();

  const gridColor = darkMode ? '#27272a' : '#f4f4f5';
  const tickColor = darkMode ? '#71717a' : '#a1a1aa';

  if (monthlyData.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 h-full flex flex-col">
        <div className="mb-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Balance Trend</p>
          <p className="text-sm text-zinc-900 dark:text-zinc-50 font-semibold">Monthly Overview</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm">
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Balance Trend
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Income vs Expenses
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded-full" />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 inline-block rounded-full" />
            Expenses
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            width={38}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

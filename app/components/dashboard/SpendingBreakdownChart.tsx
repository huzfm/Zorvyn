'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { percentage: number; color: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const e = payload[0];
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 shadow-lg text-xs">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.payload.color }} />
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{e.name}</p>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 tabular-nums">
        {formatCurrency(e.value)}
        <span className="ml-1.5">· {e.payload.percentage.toFixed(1)}%</span>
      </p>
    </div>
  );
}

export default function SpendingBreakdownChart() {
  const { categoryBreakdown } = useApp();
  const top = categoryBreakdown.slice(0, 7);

  if (top.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 h-full flex flex-col">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
          Spending
        </p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-5">By Category</p>
        <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm">
          No expenses yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 h-full flex flex-col">
      <div className="mb-3">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
          Spending
        </p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">By Category</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={top}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={82}
            dataKey="amount"
            nameKey="category"
            paddingAngle={2}
            strokeWidth={0}
          >
            {top.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-2">
        {top.map(cat => (
          <div key={cat.category} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 flex-1 truncate">
              {cat.category}
            </span>
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
              {cat.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

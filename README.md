# Zoryn  Finance Dashboard

A clean, interactive personal finance dashboard built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Recharts**. Track income and expenses, understand spending patterns, and manage transactions — all in a polished, responsive interface.

---

## Live Preview

```bash
pnpm dev      # starts at http://localhost:3000
```

---

## Setup

**Prerequisites:** Node.js 18+ and pnpm

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

---

## Features

### Dashboard Overview
- **4 Summary Cards** — Total Balance, Total Income, Total Expenses, This Month Net — each with month-over-month percentage change indicators
- **Balance Trend Chart** — Area chart showing income vs expenses across all months (Recharts)
- **Spending Breakdown** — Donut/pie chart of expenses by category with tooltips
- **Recent Transactions** — Latest 7 transactions with quick-glance formatting

### Transactions Page
- **Full Transaction Table** — Date, Description, Category badge, Type badge, Amount (color-coded)
- **Search** — Real-time search across description and category
- **Type Filter** — All / Income / Expense
- **Category Filter** — Grouped dropdown (expenses vs income categories)
- **Date Range Filter** — From/To date pickers
- **Column Sorting** — Click any column header to sort ascending/descending; click again to toggle direction
- **Pagination** — 15 rows per page with page controls
- **Export** — Download filtered transactions as CSV or JSON
- **Admin-only actions** — Add, Edit, Delete transactions (hidden in Viewer mode)

### Insights Page
- 8 insight cards: Top Spending Category, Savings Rate, Avg Daily Expense, Avg Monthly Expenses, Most Frequent Expense, Best Savings Month, Highest Spending Month, Transaction Count
- **Monthly Comparison Bar Chart** — Income vs expenses grouped by month
- **Category Breakdown** — Horizontal progress bars for all expense categories with amounts and percentages

### Dark Mode
Click the moon/sun icon in the header to toggle dark mode. Preference is persisted to `localStorage`.

### Data Persistence
- Transactions, selected role, and dark mode preference are all stored in `localStorage`
- Survives page refreshes; resets to mock data only on first visit

---

## Architecture

```
app/
├── layout.tsx                    # Root layout with Providers
├── page.tsx                      # Dashboard page (/)
├── globals.css                   # Tailwind + dark mode variant config
│
├── transactions/page.tsx         # Transactions page (/transactions)
├── insights/page.tsx             # Insights page (/insights)
│
├── context/AppContext.tsx        # Global state via useReducer + Context
├── data/mockData.ts              # 81 mock transactions, category colors
├── types/index.ts                # TypeScript interfaces
├── utils/
│   ├── helpers.ts                # Formatters, computations, filter logic
│   └── exportUtils.ts            # CSV + JSON export
│
└── components/
    ├── providers/Providers.tsx   # AppProvider + AppShell wrapper
    ├── layout/
    │   ├── AppShell.tsx          # Main layout shell
    │   ├── Sidebar.tsx           # Navigation sidebar
    │   └── Header.tsx            # Top header with role switcher
    ├── dashboard/
    │   ├── SummaryCards.tsx
    │   ├── BalanceTrendChart.tsx
    │   ├── SpendingBreakdownChart.tsx
    │   └── RecentTransactions.tsx
    ├── transactions/
    │   ├── TransactionTable.tsx
    │   ├── TransactionFilters.tsx
    │   └── TransactionModal.tsx
    └── insights/
        └── InsightsPanel.tsx
```

---

## State Management

State is managed with **React's `useReducer` + Context API** — no external state library needed for this scale.

The `AppContext` holds:
- `transactions` — all transaction records
- `filters` — search, type, category, date range, sort field + direction
- `role` — `'admin' | 'viewer'`
- `darkMode` — boolean

Derived/computed values (`filteredTransactions`, `summaryStats`, `categoryBreakdown`, `monthlyData`) are memoized with `useMemo` to avoid unnecessary recalculation.

---

## Mock Data

81 transactions spanning **October 2025 – March 2026** across 12 categories:

- **Expense categories:** Food & Dining, Transportation, Entertainment, Healthcare, Shopping, Utilities, Rent, Education, Travel, Other
- **Income categories:** Salary, Freelance, Investments

Monthly income averages ~$4,700 with expenses averaging ~$2,800, for a healthy savings rate of roughly 40%.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Recharts | Charts (Area, Pie, Bar) |
| Lucide React | Icons |
| React Context + useReducer | State management |
| localStorage | Client-side persistence |

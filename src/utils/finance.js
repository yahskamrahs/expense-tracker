import { CURRENCY_META } from '../data/defaults';

export const dateKey = (date) => String(date || '').slice(0, 10);
export const monthKey = (date) => dateKey(date).slice(0, 7);
export const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export function formatCurrency(value, currency = 'INR', compact = false) {
  const meta = CURRENCY_META[currency] || CURRENCY_META.INR;
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  if (compact && Math.abs(amount) >= 1000) {
    return `${meta.symbol}${new Intl.NumberFormat(meta.locale, { notation: 'compact', maximumFractionDigits: 1 }).format(amount)}`;
  }
  return `${meta.symbol}${new Intl.NumberFormat(meta.locale, { maximumFractionDigits: 2 }).format(amount)}`;
}

export function getTotals(transactions) {
  return transactions.reduce((acc, tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') acc.income += amount;
    if (tx.type === 'expense') acc.expense += amount;
    return acc;
  }, { income: 0, expense: 0 });
}

export function calculateBalance(transactions) {
  const { income, expense } = getTotals(transactions);
  return income - expense;
}

export function filterByMonth(transactions, selectedMonth) {
  if (!selectedMonth || selectedMonth === 'all') return transactions;
  return transactions.filter((tx) => monthKey(tx.date) === selectedMonth);
}

export function calculateMonthlySummary(transactions) {
  const { income, expense } = getTotals(transactions);
  const savings = income - expense;
  const expenseItems = transactions.filter((tx) => tx.type === 'expense');
  const largestExpense = expenseItems.reduce((max, tx) => Math.max(max, Number(tx.amount) || 0), 0);
  const categories = calculateCategoryTotals(transactions);
  const topCategory = categories[0]?.category || '—';
  return {
    income,
    expense,
    savings,
    savingsRate: income > 0 ? (savings / income) * 100 : null,
    count: transactions.length,
    largestExpense,
    topCategory,
  };
}

export function calculateCategoryTotals(transactions) {
  const map = new Map();
  transactions.filter((tx) => tx.type === 'expense').forEach((tx) => {
    map.set(tx.category, (map.get(tx.category) || 0) + Number(tx.amount || 0));
  });
  const total = [...map.values()].reduce((a, b) => a + b, 0);
  return [...map.entries()]
    .map(([category, value]) => ({ category, value, percentage: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function groupTransactionsByMonth(transactions, limit = 8) {
  const map = new Map();
  transactions.forEach((tx) => {
    const key = monthKey(tx.date);
    if (!key) return;
    const row = map.get(key) || { month: key, income: 0, expense: 0, savings: 0 };
    row[tx.type] += Number(tx.amount || 0);
    row.savings = row.income - row.expense;
    map.set(key, row);
  });
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-limit);
}

export function percentChange(current, previous) {
  if (!Number.isFinite(previous) || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function previousMonth(selectedMonth) {
  const [y, m] = selectedMonth.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function calculateBudgetProgress(spent, budget) {
  if (!budget || budget <= 0) return { percentage: 0, status: 'No budget' };
  const percentage = (spent / budget) * 100;
  const status = percentage >= 100 ? 'Over Budget' : percentage >= 75 ? 'Approaching Limit' : 'Healthy';
  return { percentage, status };
}

export function formatMonthLabel(key) {
  if (key === 'all') return 'All Time';
  const [year, month] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
}

export function formatDate(date) {
  const [y, m, d] = dateKey(date).split('-').map(Number);
  if (!y || !m || !d) return 'Invalid date';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(y, m - 1, d));
}

export function sortedTransactions(transactions, sort = 'newest') {
  const copy = [...transactions];
  if (sort === 'oldest') return copy.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === 'highest') return copy.sort((a, b) => Number(b.amount) - Number(a.amount));
  if (sort === 'lowest') return copy.sort((a, b) => Number(a.amount) - Number(b.amount));
  if (sort === 'category') return copy.sort((a, b) => a.category.localeCompare(b.category));
  return copy.sort((a, b) => b.date.localeCompare(a.date) || String(b.createdAt).localeCompare(String(a.createdAt)));
}

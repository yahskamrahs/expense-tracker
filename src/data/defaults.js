export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Entertainment',
  'Health', 'Rent', 'Travel', 'Subscriptions', 'Family', 'Other',
];

export const DEFAULT_INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Scholarship', 'Gift', 'Allowance',
  'Investment', 'Refund', 'Other',
];

export const DEFAULT_PAYMENT_METHODS = ['Cash', 'UPI', 'Bank', 'Card', 'Net Banking', 'Other'];
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'BDT'];

export const CURRENCY_META = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  BDT: { symbol: '৳', locale: 'en-BD' },
};

const monthDate = (offset, day) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  d.setDate(day);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-${String(day).padStart(2, '0')}`;
};

let demoId = 1;
const tx = (type, amount, category, title, date, paymentMethod, note = '') => ({
  id: `demo-${demoId++}`,
  type,
  amount,
  category,
  title,
  note,
  date,
  paymentMethod,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  demo: true,
});

export const createDemoTransactions = () => [
  tx('income', 52000, 'Salary', 'Monthly Salary', monthDate(0, 2), 'Bank'),
  tx('income', 12000, 'Freelance', 'Landing Page Project', monthDate(0, 10), 'Bank'),
  tx('expense', 12500, 'Rent', 'Apartment Rent', monthDate(0, 3), 'Bank'),
  tx('expense', 4750, 'Food', 'Groceries', monthDate(0, 6), 'Card'),
  tx('expense', 1500, 'Bills', 'Internet Bill', monthDate(0, 8), 'UPI'),
  tx('expense', 2150, 'Transport', 'Ride & Bus', monthDate(0, 12), 'Cash'),
  tx('expense', 1950, 'Education', 'Books and Notes', monthDate(0, 16), 'Card'),
  tx('expense', 1850, 'Food', 'Restaurant', monthDate(0, 20), 'UPI'),
  tx('expense', 799, 'Subscriptions', 'Software Subscription', monthDate(0, 22), 'Card'),
  tx('expense', 2350, 'Shopping', 'Everyday Essentials', monthDate(0, 25), 'UPI'),
  tx('income', 50000, 'Salary', 'Monthly Salary', monthDate(-1, 2), 'Bank'),
  tx('income', 8500, 'Freelance', 'Design Support', monthDate(-1, 13), 'Bank'),
  tx('expense', 12500, 'Rent', 'Apartment Rent', monthDate(-1, 3), 'Bank'),
  tx('expense', 4300, 'Food', 'Groceries', monthDate(-1, 7), 'Card'),
  tx('expense', 1520, 'Bills', 'Internet & Utility', monthDate(-1, 9), 'UPI'),
  tx('expense', 2700, 'Transport', 'Transport', monthDate(-1, 15), 'Cash'),
  tx('expense', 3100, 'Entertainment', 'Weekend Activities', monthDate(-1, 21), 'Card'),
  tx('income', 50000, 'Salary', 'Monthly Salary', monthDate(-2, 2), 'Bank'),
  tx('expense', 12500, 'Rent', 'Apartment Rent', monthDate(-2, 3), 'Bank'),
  tx('expense', 5200, 'Food', 'Groceries & Meals', monthDate(-2, 11), 'Card'),
  tx('expense', 2400, 'Transport', 'Transport', monthDate(-2, 19), 'Cash'),
  tx('expense', 1600, 'Bills', 'Internet Bill', monthDate(-2, 8), 'UPI'),
];

export const DEFAULT_SETTINGS = {
  currency: 'INR',
  theme: 'light',
  compactNumbers: false,
};

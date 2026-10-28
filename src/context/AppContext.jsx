import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, DEFAULT_PAYMENT_METHODS, DEFAULT_SETTINGS, createDemoTransactions } from '../data/defaults';
import { DATA_VERSION, STORAGE_KEYS, initializeStorageVersion, readJSON, writeJSON } from '../utils/storage';
import { currentMonthKey } from '../utils/finance';

const AppContext = createContext(null);

const defaultCategories = {
  expense: DEFAULT_EXPENSE_CATEGORIES,
  income: DEFAULT_INCOME_CATEGORIES,
};
const defaultBudgets = { overall: {}, categories: {} };

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => readJSON(STORAGE_KEYS.transactions, []));
  const [categories, setCategories] = useState(() => readJSON(STORAGE_KEYS.categories, defaultCategories));
  const [budgets, setBudgets] = useState(() => readJSON(STORAGE_KEYS.budgets, defaultBudgets));
  const [recurring, setRecurring] = useState(() => readJSON(STORAGE_KEYS.recurring, []));
  const [settings, setSettings] = useState(() => {
    const loaded = readJSON(STORAGE_KEYS.settings, {});
    const currency = (!loaded.currency || loaded.currency === 'BDT') ? 'INR' : loaded.currency;
    return { ...DEFAULT_SETTINGS, ...loaded, currency };
  });
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());
  const [transactionModal, setTransactionModal] = useState({ open: false, initialType: 'expense', editing: null });
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => { initializeStorageVersion(); }, []);
  useEffect(() => { writeJSON(STORAGE_KEYS.transactions, transactions); }, [transactions]);
  useEffect(() => { writeJSON(STORAGE_KEYS.categories, categories); }, [categories]);
  useEffect(() => { writeJSON(STORAGE_KEYS.budgets, budgets); }, [budgets]);
  useEffect(() => { writeJSON(STORAGE_KEYS.recurring, recurring); }, [recurring]);
  useEffect(() => {
    writeJSON(STORAGE_KEYS.settings, settings);
    try { window.localStorage.setItem(STORAGE_KEYS.theme, settings.theme); } catch {}
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  const notify = useCallback((message, tone = 'success') => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const budgetAlertKeys = useRef(new Set());
  useEffect(() => {
    const month = currentMonthKey();
    const monthExpenses = transactions.filter((tx) => tx.type === 'expense' && String(tx.date || '').startsWith(month));
    const overall = Number(budgets.overall?.[month] || 0);
    const overallSpent = monthExpenses.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    if (overall > 0) {
      const pct = (overallSpent / overall) * 100;
      const level = pct >= 100 ? 'over' : pct >= 85 ? 'approaching' : null;
      const key = `overall-${month}-${level}`;
      if (level && !budgetAlertKeys.current.has(key)) {
        budgetAlertKeys.current.add(key);
        notify(level === 'over' ? 'You have exceeded this month’s overall budget.' : `Monthly budget is ${Math.round(pct)}% used.`, 'warning');
      }
    }
    const categoryLimits = budgets.categories?.[month] || {};
    Object.entries(categoryLimits).forEach(([category, limitValue]) => {
      const limit = Number(limitValue || 0);
      if (limit <= 0) return;
      const catSpent = monthExpenses.filter((tx) => tx.category === category).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const pct = (catSpent / limit) * 100;
      const level = pct >= 100 ? 'over' : pct >= 85 ? 'approaching' : null;
      const key = `${category}-${month}-${level}`;
      if (level && !budgetAlertKeys.current.has(key)) {
        budgetAlertKeys.current.add(key);
        notify(level === 'over' ? `You have exceeded your ${category} budget.` : `${category} budget is ${Math.round(pct)}% used.`, 'warning');
      }
    });
  }, [transactions, budgets, notify]);

  const confirm = useCallback((options) => new Promise((resolve) => {
    setConfirmState({ ...options, resolve });
  }), []);

  const closeConfirm = useCallback((result) => {
    setConfirmState((current) => {
      current?.resolve?.(result);
      return null;
    });
  }, []);

  const openTransaction = useCallback((type = 'expense', editing = null) => {
    setTransactionModal({ open: true, initialType: editing?.type || type, editing });
  }, []);
  const closeTransaction = useCallback(() => setTransactionModal((s) => ({ ...s, open: false, editing: null })), []);

  const saveTransaction = useCallback((input) => {
    const now = new Date().toISOString();
    if (input.id) {
      setTransactions((prev) => prev.map((tx) => tx.id === input.id ? { ...tx, ...input, amount: Number(input.amount), updatedAt: now } : tx));
      notify('Transaction updated');
    } else {
      setTransactions((prev) => [{ ...input, id: uid('tx'), amount: Number(input.amount), createdAt: now, updatedAt: now }, ...prev]);
      notify('Transaction added');
    }
    closeTransaction();
  }, [closeTransaction, notify]);

  const deleteTransaction = useCallback(async (id) => {
    const ok = await confirm({ title: 'Delete this transaction?', message: 'This action cannot be undone.', confirmText: 'Delete', danger: true });
    if (!ok) return;
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    notify('Transaction deleted');
  }, [confirm, notify]);

  const setOverallBudget = useCallback((month, amount) => {
    setBudgets((prev) => ({ ...prev, overall: { ...prev.overall, [month]: Number(amount) || 0 } }));
    notify('Monthly budget saved');
  }, [notify]);

  const setCategoryBudget = useCallback((month, category, amount) => {
    setBudgets((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [month]: { ...(prev.categories?.[month] || {}), [category]: Number(amount) || 0 },
      },
    }));
    notify('Category budget saved');
  }, [notify]);

  const addCategory = useCallback((type, name) => {
    const clean = String(name || '').trim();
    if (!clean) return false;
    if (categories[type].some((x) => x.toLowerCase() === clean.toLowerCase())) return false;
    setCategories((prev) => ({ ...prev, [type]: [...prev[type], clean] }));
    notify('Category created');
    return true;
  }, [categories, notify]);

  const renameCategory = useCallback((type, oldName, newName) => {
    const clean = String(newName || '').trim();
    if (!clean) return false;
    setCategories((prev) => ({ ...prev, [type]: prev[type].map((c) => c === oldName ? clean : c) }));
    setTransactions((prev) => prev.map((tx) => tx.type === type && tx.category === oldName ? { ...tx, category: clean, updatedAt: new Date().toISOString() } : tx));
    notify('Category renamed');
    return true;
  }, [notify]);

  const deleteCategory = useCallback(async (type, name) => {
    if (name === 'Other') { notify('The Other category cannot be deleted.', 'warning'); return; }
    const used = transactions.some((tx) => tx.type === type && tx.category === name);
    const ok = await confirm({
      title: `Delete ${name}?`,
      message: used ? 'Existing transactions in this category will be moved to Other.' : 'This category will be permanently removed.',
      confirmText: 'Delete category', danger: true,
    });
    if (!ok) return;
    if (used) setTransactions((prev) => prev.map((tx) => tx.type === type && tx.category === name ? { ...tx, category: 'Other' } : tx));
    setCategories((prev) => ({ ...prev, [type]: prev[type].filter((c) => c !== name) }));
    notify('Category deleted');
  }, [confirm, notify, transactions]);

  const addRecurring = useCallback((item) => {
    setRecurring((prev) => [...prev, { ...item, id: uid('rec'), amount: Number(item.amount) }]);
    notify('Recurring template created');
  }, [notify]);

  const deleteRecurring = useCallback(async (id) => {
    const ok = await confirm({ title: 'Delete recurring template?', message: 'The template will be removed. Existing transactions are unchanged.', confirmText: 'Delete', danger: true });
    if (!ok) return;
    setRecurring((prev) => prev.filter((r) => r.id !== id));
    notify('Recurring template deleted');
  }, [confirm, notify]);

  const advanceRecurring = useCallback((item) => {
    const date = new Date(`${item.nextDueDate}T12:00:00`);
    if (item.frequency === 'weekly') date.setDate(date.getDate() + 7);
    else if (item.frequency === 'yearly') date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
    const nextDueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setRecurring((prev) => prev.map((r) => r.id === item.id ? { ...r, nextDueDate } : r));
  }, []);

  const addRecurringAsTransaction = useCallback((item) => {
    const now = new Date().toISOString();
    setTransactions((prev) => [{
      id: uid('tx'), type: item.type, amount: Number(item.amount), category: item.category,
      title: item.title, note: 'Added from recurring template', date: item.nextDueDate,
      paymentMethod: item.paymentMethod || '', createdAt: now, updatedAt: now,
    }, ...prev]);
    advanceRecurring(item);
    notify('Recurring transaction added');
  }, [advanceRecurring, notify]);

  const skipRecurring = useCallback((item) => { advanceRecurring(item); notify('Due occurrence skipped', 'info'); }, [advanceRecurring, notify]);

  const loadDemoData = useCallback(async () => {
    const ok = transactions.length === 0 || await confirm({ title: 'Load demo data?', message: 'Demo transactions will be added without deleting your existing data.', confirmText: 'Load demo data' });
    if (!ok) return;
    const demo = createDemoTransactions();
    setTransactions((prev) => [...demo, ...prev]);
    const month = currentMonthKey();
    setBudgets((prev) => ({
      ...prev,
      overall: { ...prev.overall, [month]: prev.overall?.[month] || 35000 },
      categories: { ...prev.categories, [month]: { Food: 8500, Transport: 4000, Entertainment: 3000, ...(prev.categories?.[month] || {}) } },
    }));
    notify('Demo data loaded');
  }, [confirm, notify, transactions.length]);

  const resetAllData = useCallback(async () => {
    const ok = await confirm({ title: 'Reset all data?', message: 'This permanently removes local transactions, budgets, categories, recurring templates, and preferences from this browser.', confirmText: 'Reset All Data', danger: true });
    if (!ok) return;
    setTransactions([]);
    setCategories(defaultCategories);
    setBudgets(defaultBudgets);
    setRecurring([]);
    setSettings(DEFAULT_SETTINGS);
    Object.values(STORAGE_KEYS).forEach((key) => { try { window.localStorage.removeItem(key); } catch {} });
    try { window.localStorage.setItem(STORAGE_KEYS.dataVersion, String(DATA_VERSION)); } catch {}
    notify('All data reset', 'info');
  }, [confirm, notify]);

  const restoreData = useCallback((payload) => {
    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.transactions)) throw new Error('Invalid backup schema.');
    if (payload.transactions.some((tx) => !tx.id || !['income', 'expense'].includes(tx.type) || !Number.isFinite(Number(tx.amount)))) throw new Error('Backup contains invalid transactions.');
    setTransactions(payload.transactions);
    setCategories(payload.categories || defaultCategories);
    setBudgets(payload.budgets || defaultBudgets);
    setRecurring(Array.isArray(payload.recurring) ? payload.recurring : []);
    setSettings({ ...DEFAULT_SETTINGS, ...(payload.settings || {}) });
    notify('Backup restored');
  }, [notify]);

  const backupPayload = useMemo(() => ({
    dataVersion: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    transactions, categories, budgets, recurring, settings,
  }), [transactions, categories, budgets, recurring, settings]);

  const value = useMemo(() => ({
    transactions, setTransactions, categories, budgets, recurring, settings, setSettings,
    selectedMonth, setSelectedMonth, transactionModal, openTransaction, closeTransaction,
    saveTransaction, deleteTransaction, setOverallBudget, setCategoryBudget,
    addCategory, renameCategory, deleteCategory,
    addRecurring, deleteRecurring, addRecurringAsTransaction, skipRecurring,
    loadDemoData, resetAllData, restoreData, backupPayload,
    paymentMethods: DEFAULT_PAYMENT_METHODS,
    toasts, setToasts, notify, confirm, confirmState, closeConfirm,
  }), [transactions, categories, budgets, recurring, settings, selectedMonth, transactionModal, openTransaction, closeTransaction, saveTransaction, deleteTransaction, setOverallBudget, setCategoryBudget, addCategory, renameCategory, deleteCategory, addRecurring, deleteRecurring, addRecurringAsTransaction, skipRecurring, loadDemoData, resetAllData, restoreData, backupPayload, toasts, notify, confirm, confirmState, closeConfirm]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

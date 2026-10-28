# Expense Tracker

A polished, portfolio-quality personal finance dashboard built as a **frontend-only React application**. It tracks income and expenses directly in the browser and persists data with `localStorage`—no backend, account server, or external database is required.

## Project Overview

Expense Tracker is designed to demonstrate practical frontend engineering rather than a basic CRUD tutorial. It combines transaction management, financial calculations, budgets, charts, recurring templates, exports, backups, print reports, responsive UX, accessibility basics, and robust browser storage handling.

## Purpose

The project helps a user understand where money goes, review monthly cash flow, set spending limits, and keep a personal non-sensitive record entirely in one browser. It is suitable for a portfolio, university demonstration, viva, or local personal-finance demo.

## 🚀 Quick Setup & Run

### 1. Prerequisites
- **Node.js** (v18 or higher recommended) — [Download here](https://nodejs.org/)

### 2. Run the Commands
```bash
# Step 1: Open project folder
cd expense-tracker

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
```

### 3. Open in Browser
Visit **`http://localhost:5173`** in your browser.

> 💡 **Tip:** After opening the app, go to **Settings** ➔ click **"Load demo data"** to immediately populate sample transactions, charts, and budget insights!
> 
> 📖 For detailed troubleshooting and ZIP extraction instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md).


## Main Features

- Add income and expense transactions
- Edit and delete existing transactions
- Search and combine multiple filters
- Sort by newest, oldest, amount, or category
- All-time current balance plus period income, expense, and savings
- Monthly summary and savings rate
- Month-over-month expense comparison
- Overall monthly budget with healthy / approaching / over-budget states
- Category-specific budgets
- Income vs Expense, category distribution, and monthly trend charts
- Ranked top categories and largest expenses
- Recurring transaction templates with due prompts when the app is opened
- CSV export and compatible CSV import
- Full JSON backup and safe restore
- Printable A4 monthly financial report using the browser print dialog
- BDT, USD, EUR, GBP, and INR display formatting
- Light and dark themes
- Custom income and expense categories
- Realistic optional demo data
- Responsive desktop, tablet, and mobile layouts
- Keyboard shortcut: press `N` (when not typing) to open a new transaction

## Technology Stack

- React
- Vite
- JavaScript
- React Router
- Lucide React
- Recharts
- Modern CSS with CSS variables
- Browser localStorage

## Why No Database?

This version intentionally demonstrates a frontend-only architecture. Data is saved with browser `localStorage`, so the project can run without MySQL, MongoDB, PostgreSQL, Firebase, Supabase, PHP, Express, or a cloud database.

## localStorage Architecture

The application uses separate keys:

- `expenseTracker.transactions`
- `expenseTracker.categories`
- `expenseTracker.budgets`
- `expenseTracker.recurring`
- `expenseTracker.settings`
- `expenseTracker.theme`
- `expenseTracker.dataVersion`

Stored JSON is parsed defensively. Malformed values fall back to safe defaults instead of crashing the application.

## Dashboard

The dashboard prioritizes the user's financial condition:

- Current Balance = all-time income − all-time expenses
- Period Income
- Period Expenses
- Net Savings
- Savings Rate
- Budget progress
- Spending insight
- Month-over-month comparison
- Recent transactions
- Recurring due items

## Transaction Management

Each transaction can store:

- id
- type (`income` or `expense`)
- amount
- category
- title
- note
- date
- paymentMethod
- createdAt
- updatedAt

The form validates type, title, amount, category, and date before saving.

## Filters

Transactions can be filtered by:

- text search
- type
- category
- payment method
- date range

Filters work together, and the visible result count updates immediately.

## Monthly Summary

For the selected month, the application calculates:

- Income
- Expenses
- Savings
- Savings Rate
- Transaction count
- Largest expense
- Top expense category

`Savings Rate = (Income - Expense) / Income × 100`. If income is zero, the UI returns `N/A` rather than `Infinity` or `NaN`.

## Budgets

Users can set an overall budget for each month and optional category budgets. Progress is calculated from stored transactions and labeled as:

- Healthy: under 75%
- Approaching Limit: 75–99%
- Over Budget: 100% or more

## Analytics

Charts are generated from stored transaction data:

- Income vs Expense
- Expenses by Category
- Monthly Spending Trend
- Top Categories
- Top 5 Expenses

If there is no matching data, a readable empty state is displayed instead of broken chart axes.

## Recurring Templates

Templates support weekly, monthly, and yearly frequencies. Because there is no backend or background service, the app does **not** pretend that transactions are automatically created while the browser is closed. When the app opens and a template is due, the dashboard offers `Add` or `Skip`.

## CSV Export / Import

CSV export uses the browser Blob API and includes:

- Date
- Type
- Title
- Category
- Amount
- Payment Method
- Note

CSV cells are quoted and internal quotes are escaped. Import validates type, date, and positive numeric amount; malformed rows are ignored rather than crashing the app.

## Backup / Restore

JSON backup contains:

- transactions
- categories
- budgets
- recurring templates
- settings
- data version

The restore process validates the backup object and transaction records before replacing local state.

## Monthly Reports

The Reports page creates a professional print-friendly monthly statement with:

- period
- generated date
- currency
- income
- expenses
- net savings
- savings rate
- budget
- top category
- top category breakdown
- transaction table

Use **Print Report → Save as PDF**. Navigation, edit controls, theme controls, and application chrome are hidden by `@media print`.

## Theme System

Light and dark modes use CSS custom properties such as:

- `--bg`
- `--surface`
- `--text`
- `--muted`
- `--border`
- `--positive`
- `--negative`
- `--accent`

Theme preference is persisted in localStorage.

## Responsive Design

The interface is designed around desktop, tablet, and mobile breakpoints. On mobile:

- critical financial cards are stacked
- a fixed bottom navigation is used
- a floating add button is available
- the transaction form becomes a bottom/full-height mobile sheet
- filters stack instead of creating a wide table
- transaction rows collapse into touch-friendly cards

## Project Structure

```text
src/
  components/
    Charts.jsx
    EmptyState.jsx
    Feedback.jsx
    Layout.jsx
    Modal.jsx
    MonthSelect.jsx
    TransactionForm.jsx
    TransactionList.jsx
  context/
    AppContext.jsx
  data/
    defaults.js
  pages/
    AnalyticsPage.jsx
    BudgetPage.jsx
    DashboardPage.jsx
    ReportsPage.jsx
    SettingsPage.jsx
    TransactionsPage.jsx
  utils/
    exportUtils.js
    finance.js
    storage.js
    validation.js
  App.jsx
  main.jsx
  styles.css
```

## Installation & Setup

> 📖 **Need a complete beginner guide for running from a ZIP?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step instructions with troubleshooting for Windows, macOS, and Linux.

```bash
# Install dependencies
npm install

# Run locally in development mode
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Screenshots Placeholder

Add portfolio screenshots here after running the project locally:

- Dashboard (Light)
- Dashboard (Dark)
- Transactions
- Analytics
- Budget
- Monthly Report
- Mobile layout

## Limitations

This frontend-only application stores information only in the current browser.

Therefore:

- clearing browser storage removes data
- data is not automatically synchronized between devices
- localStorage is not suitable for sensitive production financial information
- there is no real user authentication
- there is no cloud backup unless a future backend is added
- recurring templates cannot run in the background while the app is closed

## Privacy

> Your data stays in this browser. This demo does not send transaction data to a server.

## Future Improvements

A production-oriented future version could add authenticated accounts, encrypted server-side storage, multi-device sync, cloud backups, shared household budgets, server-side recurring jobs, and audited financial-security controls.

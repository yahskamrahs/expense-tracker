# Quick Setup & Run Guide

Welcome to the **Expense Tracker** project! This guide is written so that anyone can extract and run this project on **Windows, macOS, or Linux** without any technical roadblocks.

---

## ⚡ Quick Start (TL;DR)

If you already have **Node.js (v18+)** installed:

```bash
# 1. Unzip the project and open your terminal in the extracted folder
cd expense-tracker-localstorage

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev
```

Then open your browser and navigate to: **`http://localhost:5173`**

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Extract the ZIP File](#step-1-extract-the-zip-file)
3. [Step 2: Open Terminal / Command Prompt](#step-2-open-terminal--command-prompt)
4. [Step 3: Install Dependencies](#step-3-install-dependencies)
5. [Step 4: Run the Development Server](#step-4-run-the-development-server)
6. [Step 5: Exploring the App (Quick Tour)](#step-5-exploring-the-app-quick-tour)
7. [Building for Production (Optional)](#building-for-production-optional)
8. [Troubleshooting & FAQs](#troubleshooting--faqs)
9. [Notes for the Sender (Creating the ZIP)](#notes-for-the-sender-creating-the-zip)

---

## 1. Prerequisites

Before running the project, make sure **Node.js** and **npm** are installed on your machine.

### Check if Node.js is Installed
Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal) and run:

```bash
node -v
npm -v
```

- If version numbers appear (e.g. `v18.x.x` or `v20.x.x` or higher), you are ready!
- If you see `'node' is not recognized` or command not found, install Node.js:
  1. Go to [https://nodejs.org/](https://nodejs.org/).
  2. Download and install the **LTS (Long Term Support)** version.
  3. Complete the installer using default settings.
  4. **Restart your terminal or VS Code** after installation.

---

## Step 1: Extract the ZIP File

> ⚠️ **Important:** Do NOT run commands directly inside the ZIP preview window. You must extract the folder first!

- **Windows:** Right-click the `.zip` file ➔ Select **Extract All...** ➔ Choose destination and click **Extract**.
- **macOS:** Double-click the `.zip` file to extract.
- **Linux:** Right-click and choose **Extract Here**, or run:
  ```bash
  unzip expense-tracker-localstorage.zip
  ```

---

## Step 2: Open Terminal / Command Prompt

Navigate inside the extracted project folder where `package.json` is located.

### Method A: Using VS Code (Recommended)
1. Open Visual Studio Code.
2. Click **File** ➔ **Open Folder...** (or `Ctrl + K, Ctrl + O`).
3. Select the extracted `expense-tracker-localstorage` folder.
4. Open the integrated terminal: press **`Ctrl + \``** (or go to **Terminal** ➔ **New Terminal**).

### Method B: Windows Address Bar Shortcut
1. Open the extracted folder in Windows File Explorer.
2. Click on the address bar at the top, type `cmd` or `powershell`, and press `Enter`.
3. A terminal will open directly in this folder.

### Method C: Mac / Linux Terminal
1. Open Terminal.
2. Type `cd ` (with a trailing space) and drag-and-drop the extracted folder into the terminal window, then press `Enter`.

---

## Step 3: Install Dependencies

In your terminal, run:

```bash
npm install
```

> **Why is this necessary?**  
> Modern JavaScript projects omit the large `node_modules` folder when sharing ZIP archives to keep file sizes lightweight. Running `npm install` automatically downloads all required dependencies (React, Vite, Recharts, Lucide icons, etc.) listed in `package.json`.

Wait for the installation to finish (usually takes 15–45 seconds).

---

## Step 4: Run the Development Server

Start the local server with:

```bash
npm run dev
```

You will see output similar to this:

```text
  VITE v6.4.3  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.x:5173/
  ➜  press h + enter to show help
```

### Accessing the App:
- Hold `Ctrl` (or `Cmd` on Mac) and click the `http://localhost:5173/` link in your terminal, or open your browser and manually enter:
  **`http://localhost:5173`**

You should see the Expense Tracker dashboard loaded and ready!

---

## Step 5: Exploring the App (Quick Tour)

Here are a few quick tips to get the most out of your first test run:

1. **Load Demo Data (Recommended for first run):**
   - Click **Settings** in the left sidebar (or the gear icon in the header).
   - Click the **"Load demo data"** button and confirm.
   - Return to the **Dashboard** to see populated income/expense transactions, charts, budget bars, and spending statistics.
2. **Add a Transaction:**
   - Click the **"+ Quick Add"** button in the header or press the **`N`** key on your keyboard.
   - Enter amount, category, date, and description, then save.
3. **Toggle Theme:**
   - Click the **Moon / Sun** icon in the header to switch between Light and Dark mode.
4. **Data Persistence:**
   - All transactions and settings are stored locally in your browser's `localStorage`.
   - Your data remains saved even if you refresh or close the browser!

---

## Building for Production (Optional)

If you want to build an optimized production bundle:

```bash
# Generate the production build in the dist/ folder
npm run build

# Preview the production build locally
npm run preview
```

---

## Troubleshooting & FAQs

### Q1: `npm: command not found` or `'node' is not recognized`
- **Cause:** Node.js is not installed or not added to your system PATH.
- **Fix:** Install Node.js from [nodejs.org](https://nodejs.org/) (LTS version) and restart your terminal or computer.

### Q2: PowerShell says `Execution of scripts is disabled on this system` (Windows)
- **Cause:** Windows PowerShell execution policy restriction.
- **Fix:** Run this command once in PowerShell:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
  Then re-run `npm run dev`. Or use standard Windows Command Prompt (`cmd.exe`).

### Q3: Port 5173 is already in use
- **Cause:** Another app or process is currently using port 5173.
- **Fix:** Vite will usually offer the next port (e.g. `http://localhost:5174/`) automatically. Alternatively, run with a custom port:
  ```bash
  npx vite --port 3000
  ```

### Q4: Browser displays a blank / white screen
- **Fix:**
  1. Press `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac) to hard-refresh the page.
  2. Open DevTools (`F12` ➔ **Console** tab) to check if any browser extension is blocking localStorage.
  3. Ensure you are accessing via `http://localhost:5173` rather than opening `index.html` as a `file://` URL directly.

### Q5: How do I stop the development server?
- Press `Ctrl + C` in the terminal and confirm with `y` (if prompted).

---

## Notes for the Sender (Creating the ZIP)

When you compress this project to send to someone else, follow these best practices:

1. **Delete or exclude the `node_modules` folder** before zipping:
   - The `node_modules` folder can be hundreds of megabytes with thousands of tiny files.
   - Removing it keeps the ZIP under **1–2 MB** and ensures the recipient installs fresh, OS-native binaries on their system.
2. **Exclude `dist` folder** (if built).
3. **Ensure files to include:**
   - `src/`
   - `index.html`
   - `package.json`
   - `package-lock.json`
   - `vite.config.js`
   - `SETUP_GUIDE.md`
   - `README.md`

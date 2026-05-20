# Investment Tracker

A lightweight macOS desktop app for tracking income, expenses, and net profit across multiple websites or platforms. All data lives locally in SQLite — no cloud, no account.

## Use cases

- **Sweepstakes casinos** — log purchases (expense), redemptions (income), and rakeback / loyalty cashback to see which sites are net positive over time
- **Online poker, sports books, regular casinos** — same model: stake vs. winnings, with site-by-site filtering
- **Side hustles, marketplace selling, freelance gigs** — track per-platform income and expense, chart cumulative net profit
- **Any "money in / money out per website" analysis** with optional pending and excluded flags

## Features

- Add/edit/delete transactions with income, expense, cashback %, website, date, and free-text description
- Automatic net-profit calculation per row (income − expense + expense × cashback%)
- Filter the table by website and date range
- Mark transactions as **pending** (e.g. unsettled withdrawals) or **excluded** (excluded from the chart but kept in the table)
- Cumulative net-profit timeline chart, derived from non-excluded rows
- Data persists across app restarts in `~/Library/Application Support/com.investmenttracker.app/investment-tracker.db`

## Getting started

```bash
# Install dependencies
npm install

# Run in dev mode
npm run tauri dev

# Build a distributable .app and .dmg (macOS)
npm run tauri build
```

After `tauri build`, the .app sits at `src-tauri/target/release/bundle/macos/Investment Tracker.app`. Drag it to `/Applications` to launch from Spotlight or the dock.

## Stack

Tauri 2 (Rust shell), React 19, Vite, Tailwind CSS, Recharts. SQLite via `tauri-plugin-sql`. No backend.

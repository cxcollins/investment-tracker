# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires NODE_EXTRA_CA_CERTS due to Apple internal npm registry)
NODE_EXTRA_CA_CERTS="$HOME/corp-ca.pem" npm install

# Run the desktop app in dev mode (run in your own terminal, not via Claude Code — port binding is sandbox-restricted)
npm run tauri dev

# Build for production
npm run tauri build

# Vite frontend only (no Tauri shell)
npm run dev

# Rust-only build check
cd src-tauri && cargo build
```

## Architecture

This is a **Tauri 2 desktop app** — React handles the UI, Rust (`src-tauri/`) provides the native shell and SQLite access via `tauri-plugin-sql`.

### Data flow

All database access goes through `src/db.js`, which holds a singleton `Database` connection opened via `tauri-plugin-sql`. The DB is initialized (tables created) once at startup in `App.jsx` via `initDb()` before the main UI renders. The `useTransactions` hook in `src/hooks/useTransactions.js` is the single source of truth for transaction state — components call `add`/`remove` from the hook rather than touching `db.js` directly.

### Frontend structure

- `App.jsx` — initializes DB, gates render until ready, then mounts `<Dashboard>` which owns tab state and the `useTransactions` hook
- `components/TransactionForm.jsx` — controlled form; cashback field only renders when type is `expense`
- `components/TransactionList.jsx` — client-side filtering (type, date range) over the full transaction list
- `components/SpendingByCategory.jsx` / `SpendingOverTime.jsx` — read-only Recharts visualizations derived from the same transaction array

### Rust side

`src-tauri/src/lib.rs` only registers `tauri-plugin-sql` — there are no custom Tauri commands. All SQL queries run from JS through the plugin. The SQLite file is stored in the app's platform data directory (`~/Library/Application Support/com.investmenttracker.app/` on macOS).

### SQLite schema

```sql
transactions(id, amount REAL, type TEXT, category TEXT, description TEXT, date TEXT, cashback REAL)
categories(id, name TEXT, type TEXT)
```

`cashback` is nullable and only used for `type = 'expense'` rows. The `categories` table exists in the schema but is not yet wired to the UI (free-text input is used instead).

## Environment notes

- `npm run tauri dev` cannot be run from within Claude Code's sandbox (port binding is blocked). Run it directly in a terminal.

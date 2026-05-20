import Database from '@tauri-apps/plugin-sql'

let db = null

async function getDb() {
  if (!db) {
    let dbName
    if (import.meta.env.VITE_MODE === 'test') {
      dbName = 'investment-tracker-test.db'
    } else {
      dbName = 'investment-tracker.db'
    }
    db = await Database.load(`sqlite:${dbName}`)
  }
  return db
}

export async function initDb() {
  const db = await getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT    NOT NULL,
      type TEXT    NOT NULL CHECK(type IN ('income','expense'))
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      income      REAL DEFAULT 0,
      expense     REAL DEFAULT 0,
      cashback    REAL DEFAULT 0,
      website     TEXT    NOT NULL,
      description TEXT,
      date        TEXT    NOT NULL,
      pending     INTEGER DEFAULT 0,
      exclude     INTEGER DEFAULT 0
    )
  `)
}

export async function getTransactions() {
  const db = await getDb()
  return db.select('SELECT * FROM transactions ORDER BY date DESC')
}

export async function addTransaction(tx) {
  const db = await getDb()
  await db.execute(
    'INSERT INTO transactions (income, expense, cashback, website, description, date, pending, exclude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [tx.income ?? 0, tx.expense ?? 0, tx.cashback ?? 0, tx.website, tx.description ?? null, tx.date, tx.pending ? 1 : 0, tx.exclude ? 1 : 0],
  )
}

export async function updateTransaction(id, tx) {
  const db = await getDb()
  await db.execute(
    'UPDATE transactions SET income = ?, expense = ?, cashback = ?, website = ?, description = ?, date = ?, pending = ?, exclude = ? WHERE id = ?',
    [tx.income ?? 0, tx.expense ?? 0, tx.cashback ?? 0, tx.website, tx.description ?? null, tx.date, tx.pending ? 1 : 0, tx.exclude ? 1 : 0, id],
  )
}

export async function deleteTransaction(id) {
  const db = await getDb()
  await db.execute('DELETE FROM transactions WHERE id = ?', [id])
}

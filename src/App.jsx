import { useState, useEffect } from 'react'
import { initDb } from './db'
import { useTransactions } from './hooks/useTransactions'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { NetProfitChart } from './components/NetProfitChart'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initDb().then(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-600">
        Loading...
      </div>
    )
  }

  return <Dashboard />
}

function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [selectedWebsites, setSelectedWebsites] = useState(new Set())
  const { transactions, add, update, remove } = useTransactions()

  async function handleAdd(tx) {
    await add(tx)
    setShowForm(false)
  }

  function toggleWebsite(website) {
    setSelectedWebsites(prev => {
      const next = new Set(prev)
      if (next.has(website)) {
        next.delete(website)
      } else {
        next.add(website)
      }
      return next
    })
  }

  const websites = [...new Set(transactions.map(tx => tx.website))].sort()
  const filtered = selectedWebsites.size > 0
    ? transactions.filter(tx => selectedWebsites.has(tx.website))
    : transactions

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-950 border-b border-gray-800 px-6 py-5 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Casino Tracker</h1>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-emerald-500 transition"
          >
            + Add Transaction
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            {websites.map(w => (
              <button
                key={w}
                onClick={() => toggleWebsite(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedWebsites.has(w)
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <TransactionList transactions={filtered} onDelete={remove} onUpdate={update} />
        <NetProfitChart transactions={filtered.filter(tx => !tx.exclude)} />
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4">
            <TransactionForm onAdd={handleAdd} />
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

function netProfit(tx) {
  const cashbackAmount = Number(tx.expense) * (Number(tx.cashback) / 100)
  return Number(tx.income) - Number(tx.expense) + cashbackAmount
}

const inputClass = "bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none w-full"

export function TransactionList({ transactions, onDelete, onUpdate }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const filtered = transactions.filter(tx => {
    if (fromDate && tx.date < fromDate) return false
    if (toDate && tx.date > toDate) return false
    return true
  })

  function startEdit(tx) {
    setEditingId(tx.id)
    setEditForm({
      income: String(tx.income || ''),
      expense: String(tx.expense || ''),
      cashback: String(tx.cashback || ''),
      website: tx.website,
      description: tx.description || '',
      date: tx.date,
      pending: !!tx.pending,
      exclude: !!tx.exclude,
    })
  }

  async function saveEdit() {
    await onUpdate(editingId, {
      income: editForm.income ? parseFloat(editForm.income) : 0,
      expense: editForm.expense ? parseFloat(editForm.expense) : 0,
      cashback: editForm.cashback ? parseFloat(editForm.cashback) : 0,
      website: editForm.website,
      description: editForm.description || null,
      date: editForm.date,
      pending: editForm.pending,
      exclude: editForm.exclude,
    })
    setEditingId(null)
    setEditForm(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(null)
  }

  async function togglePending(tx) {
    await onUpdate(tx.id, {
      income: tx.income,
      expense: tx.expense,
      cashback: tx.cashback,
      website: tx.website,
      description: tx.description,
      date: tx.date,
      pending: !tx.pending,
      exclude: !!tx.exclude,
    })
  }

  async function toggleExclude(tx) {
    await onUpdate(tx.id, {
      income: tx.income,
      expense: tx.expense,
      cashback: tx.cashback,
      website: tx.website,
      description: tx.description,
      date: tx.date,
      pending: !!tx.pending,
      exclude: !tx.exclude,
    })
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex gap-4 items-center flex-wrap">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
        />
        <span className="text-gray-600 text-sm">to</span>
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-800">
              <th className="pl-4 pr-1 py-3 w-6"></th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Website</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Income</th>
              <th className="px-4 py-3 font-medium text-right">Expense</th>
              <th className="px-4 py-3 font-medium text-right">Cashback</th>
              <th className="px-4 py-3 font-medium text-right">Net Profit</th>
              <th className="px-3 py-3 font-medium text-center" title="Exclude from chart">Exclude</th>
              <th className="px-3 py-3 font-medium text-center" title="Pending income">Pending</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-600">
                  No transactions
                </td>
              </tr>
            )}
            {filtered.map(tx => {
              const isExcluded = !!tx.exclude

              if (editingId === tx.id) {
                return (
                  <tr key={tx.id} className="border-b border-gray-800 bg-gray-800/30">
                    <td className="pl-4 pr-1 py-2 text-yellow-500">
                      {editForm.pending ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg> : null}
                    </td>
                    <td className="px-4 py-2">
                      <input type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" value={editForm.website} onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))} className={inputClass} />
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className={inputClass} />
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" step="0.01" min="0" value={editForm.income} onChange={e => setEditForm(f => ({ ...f, income: e.target.value }))} className={inputClass + " text-right"} />
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" step="0.01" min="0" value={editForm.expense} onChange={e => setEditForm(f => ({ ...f, expense: e.target.value }))} className={inputClass + " text-right"} />
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" step="0.01" min="0" value={editForm.cashback} onChange={e => setEditForm(f => ({ ...f, cashback: e.target.value }))} className={inputClass + " text-right"} />
                    </td>
                    <td className="px-4 py-2 text-right text-gray-500">—</td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={editForm.exclude} onChange={e => setEditForm(f => ({ ...f, exclude: e.target.checked }))} className="accent-emerald-500" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={editForm.pending} onChange={e => setEditForm(f => ({ ...f, pending: e.target.checked }))} className="accent-emerald-500" />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300 text-xs transition">Save</button>
                        <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-300 text-xs transition">Cancel</button>
                      </div>
                    </td>
                  </tr>
                )
              }

              const net = netProfit(tx)
              return (
                <tr key={tx.id} className={`border-b border-gray-800 last:border-0 hover:bg-gray-800/50 ${isExcluded ? 'opacity-50' : ''} ${tx.pending ? 'border-l-2 border-l-yellow-500 bg-yellow-500/5' : ''}`}>
                  <td className="pl-4 pr-1 py-3 text-yellow-500">
                    {tx.pending ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg> : null}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{tx.date}</td>
                  <td className="px-4 py-3 text-gray-300">{tx.website}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.description ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    {Number(tx.income) > 0 ? `+$${Number(tx.income).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-red-400">
                    {Number(tx.expense) > 0 ? `-$${Number(tx.expense).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    {Number(tx.cashback) > 0 ? `${Number(tx.cashback)}%` : '—'}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    net >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {net >= 0 ? '+' : '-'}${Math.abs(net).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isExcluded}
                      onChange={() => toggleExclude(tx)}
                      className="accent-emerald-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!tx.pending}
                      onChange={() => togglePending(tx)}
                      className="accent-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(tx)}
                        className="text-gray-500 hover:text-emerald-400 text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="text-gray-600 hover:text-red-400 text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

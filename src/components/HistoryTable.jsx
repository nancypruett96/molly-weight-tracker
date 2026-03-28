import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'

const START_WEIGHT = 181.4

export default function HistoryTable({ entries, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)

  if (!entries.length) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4">History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <th className="text-left pb-3 pr-4 font-semibold">Date</th>
              <th className="text-right pb-3 pr-4 font-semibold">Weight</th>
              <th className="text-right pb-3 pr-4 font-semibold">Change</th>
              <th className="text-left pb-3 pr-4 font-semibold">Note</th>
              <th className="pb-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => {
              const prev = entries[i + 1]
              const change = prev ? e.weight_lbs - prev.weight_lbs : null
              const changeFromStart = e.weight_lbs - START_WEIGHT

              return (
                <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 text-slate-700 font-medium whitespace-nowrap">
                    {format(parseISO(e.date), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 pr-4 text-right font-bold text-slate-800">
                    {e.weight_lbs} lbs
                  </td>
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    {change !== null ? (
                      <span className={`font-semibold ${change < 0 ? 'text-teal-600' : change > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-slate-400 max-w-xs truncate">
                    {e.note || ''}
                  </td>
                  <td className="py-3 text-right">
                    {confirmId === e.id ? (
                      <span className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { onDelete(e.id); setConfirmId(null) }}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmId(e.id)}
                        className="text-slate-200 hover:text-red-400 transition-colors text-xs"
                        title="Delete entry"
                      >
                        ✕
                      </button>
                    )}
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

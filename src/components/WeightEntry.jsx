import React, { useState } from 'react'
import { format } from 'date-fns'

export default function WeightEntry({ onSave, latestEntry }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [date, setDate] = useState(today)
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const alreadyLogged = latestEntry && latestEntry.date === today

  async function handleSubmit(e) {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!w || w < 80 || w > 400) {
      setError('Please enter a valid weight between 80 and 400 lbs.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ date, weight_lbs: w, note })
      setSaved(true)
      setWeight('')
      setNote('')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Something went wrong saving. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-1">Log a Weigh-in</h2>
      {alreadyLogged && (
        <p className="text-sm text-teal-600 mb-4">
          ✓ You already logged today ({latestEntry.weight_lbs} lbs). You can update it here.
        </p>
      )}
      {!alreadyLogged && (
        <p className="text-sm text-slate-400 mb-4">
          Enter your weight for today or any past date.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              max={today}
              onChange={e => setDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              min="80"
              max="400"
              placeholder="e.g. 172.4"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Note (optional)</label>
          <input
            type="text"
            placeholder="e.g. Felt great this week, vacation weekend..."
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={200}
            className="border border-slate-200 rounded-xl px-4 py-3 text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving || !weight}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Weigh-in'}
        </button>
      </form>
    </div>
  )
}

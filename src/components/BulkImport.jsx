import React, { useState } from 'react'
import { parse, isValid, format } from 'date-fns'

/*
  Bulk Import: accepts a pasted table of dates + weights.
  Supports the WW CSV format when the data request arrives,
  or manual entry as "date, weight" lines.

  Expected formats:
    2024-01-08, 172.6
    01/08/2024, 172.6
    Jan 8 2024, 172.6
*/

function parseLines(text) {
  const lines = text.trim().split('\n')
  const results = []
  const errors = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.toLowerCase().startsWith('date')) continue // skip header rows

    // Split on comma, tab, or multiple spaces
    const parts = line.split(/[,\t]+/).map(s => s.trim())
    if (parts.length < 2) { errors.push(`Line ${i + 1}: couldn't parse "${line}"`); continue }

    const rawDate = parts[0]
    const rawWeight = parts[1].replace(/[^0-9.]/g, '')
    const weight_lbs = parseFloat(rawWeight)

    if (!weight_lbs || weight_lbs < 80 || weight_lbs > 400) {
      errors.push(`Line ${i + 1}: invalid weight "${parts[1]}"`)
      continue
    }

    // Try parsing the date in multiple formats
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'M/d/yyyy', 'MMM d yyyy', 'MMMM d yyyy', 'MM-dd-yyyy']
    let parsedDate = null
    for (const fmt of formats) {
      const d = parse(rawDate, fmt, new Date())
      if (isValid(d)) { parsedDate = d; break }
    }

    if (!parsedDate) {
      errors.push(`Line ${i + 1}: couldn't parse date "${rawDate}"`)
      continue
    }

    results.push({ date: format(parsedDate, 'yyyy-MM-dd'), weight_lbs, note: parts[2] || '' })
  }

  return { results, errors }
}

export default function BulkImport({ onImport, open, onClose }) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  function handleParse() {
    const { results, errors } = parseLines(text)
    setPreview({ results, errors })
  }

  async function handleImport() {
    if (!preview?.results?.length) return
    setImporting(true)
    try {
      await onImport(preview.results)
      setDone(true)
      setText('')
      setPreview(null)
      setTimeout(() => { setDone(false); onClose() }, 2000)
    } catch (err) {
      alert('Import failed: ' + err.message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Import Historical Data</h2>
            <p className="text-sm text-slate-400 mt-0.5">Paste your data below — one entry per line</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 text-2xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-700">
            <p className="font-semibold mb-1">Accepted formats:</p>
            <code className="block text-xs text-teal-600 mt-1">2024-01-08, 172.6, optional note</code>
            <code className="block text-xs text-teal-600">01/08/2024, 172.6</code>
            <code className="block text-xs text-teal-600">Jan 8 2024, 172.6</code>
          </div>

          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setPreview(null) }}
            placeholder={"2024-01-08, 172.6\n2024-01-15, 172.0\n2024-01-22, 171.4"}
            className="w-full h-48 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
          />

          {!preview && (
            <button
              onClick={handleParse}
              disabled={!text.trim()}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors disabled:opacity-40"
            >
              Preview Import
            </button>
          )}

          {preview && (
            <div className="space-y-3">
              {preview.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-600 mb-2">⚠ {preview.errors.length} lines skipped:</p>
                  {preview.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-500">{e}</p>
                  ))}
                </div>
              )}
              {preview.results.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    ✓ {preview.results.length} entries ready to import
                  </p>
                  <div className="max-h-40 overflow-y-auto text-xs text-green-600 font-mono space-y-0.5">
                    {preview.results.slice(0, 10).map((r, i) => (
                      <p key={i}>{r.date} → {r.weight_lbs} lbs</p>
                    ))}
                    {preview.results.length > 10 && (
                      <p className="text-green-400">…and {preview.results.length - 10} more</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setPreview(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleImport}
                  disabled={!preview.results.length || importing}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {done ? '✓ Imported!' : importing ? 'Importing…' : `Import ${preview.results.length} Entries`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

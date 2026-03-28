import React, { useState, useEffect, useCallback } from 'react'
import StatsBar from './components/StatsBar'
import WeightChart from './components/WeightChart'
import WeightEntry from './components/WeightEntry'
import Milestones from './components/Milestones'
import HistoryTable from './components/HistoryTable'
import BulkImport from './components/BulkImport'
import { fetchEntries, addEntry, deleteEntry, bulkInsertEntries } from './lib/data'

const SUPABASE_CONFIGURED =
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

export default function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const loadEntries = useCallback(async () => {
    if (!SUPABASE_CONFIGURED) {
      setLoading(false)
      return
    }
    try {
      const data = await fetchEntries()
      setEntries(data)
    } catch (err) {
      setError('Could not load data. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadEntries() }, [loadEntries])

  async function handleSave(entry) {
    const saved = await addEntry(entry)
    setEntries(prev => {
      const without = prev.filter(e => e.date !== saved.date)
      return [saved, ...without].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  async function handleDelete(id) {
    await deleteEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  async function handleImport(rows) {
    const saved = await bulkInsertEntries(rows)
    await loadEntries()
    return saved
  }

  const latestEntry = entries[0] || null

  // Day of week greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg">⚖</div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-none">My Weight Journey</h1>
              <p className="text-xs text-slate-400 leading-none mt-0.5">{greeting}, Molly!</p>
            </div>
          </div>
          <button
            onClick={() => setImportOpen(true)}
            className="text-xs text-slate-400 hover:text-teal-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            Import data
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 flex gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'log', label: 'Log Weight' },
            { id: 'history', label: 'History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!SUPABASE_CONFIGURED && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-center">
            <p className="text-amber-800 font-semibold mb-1">⚙ Setup required</p>
            <p className="text-amber-700 text-sm">
              Add your Supabase credentials to the <code className="bg-amber-100 px-1 rounded">.env</code> file to start saving data.
              See the <strong>README</strong> for step-by-step instructions.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {(activeTab === 'dashboard') && (
              <>
                <StatsBar entries={entries} />
                <WeightChart entries={entries} />
                <Milestones entries={entries} />
              </>
            )}

            {activeTab === 'log' && (
              <WeightEntry onSave={handleSave} latestEntry={latestEntry} />
            )}

            {activeTab === 'history' && (
              entries.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-4">📋</p>
                  <p className="text-lg font-medium">No entries yet.</p>
                  <p className="text-sm mt-1">Switch to "Log Weight" to add your first weigh-in.</p>
                </div>
              ) : (
                <HistoryTable entries={entries} onDelete={handleDelete} />
              )
            )}
          </>
        )}
      </main>

      <BulkImport
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  )
}

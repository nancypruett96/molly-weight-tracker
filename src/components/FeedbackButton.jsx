import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  function openModal() {
    setOpen(true)
    setDone(false)
    setError(null)
    setMessage('')
  }

  function closeModal() {
    setOpen(false)
    setMessage('')
    setDone(false)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({ message: message.trim() })
      if (error) throw error
      setDone(true)
      setTimeout(() => closeModal(), 2500)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 transition-colors"
        aria-label="Send feedback"
      >
        <span>💬</span>
        <span>Feedback</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {done ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-3">💌</p>
                <p className="text-lg font-semibold text-slate-800">Thanks, Molly!</p>
                <p className="text-sm text-slate-500 mt-1">Your feedback has been sent.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800">Send Feedback</h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <p className="text-sm text-slate-500 mb-4">
                  Something you'd like to see? Anything confusing? Just type whatever comes to mind — Nancy reads every message.
                </p>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type anything here…"
                    rows={5}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                    autoFocus
                  />

                  {error && (
                    <p className="text-red-500 text-xs mt-2">{error}</p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !message.trim()}
                      className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-sm font-medium transition-colors"
                    >
                      {submitting ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

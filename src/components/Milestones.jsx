import React from 'react'

const START_WEIGHT = 181.4
const GOAL_WEIGHT = 170

const MILESTONES = [
  { label: 'First step', desc: 'Logged your first weigh-in', icon: '👟', check: (e) => e.length >= 1 },
  { label: '1 lb lost', desc: '1 lb down from start', icon: '⭐', check: (e, curr) => curr && (START_WEIGHT - curr) >= 1 },
  { label: '5 lbs lost', desc: '5 lbs down from start', icon: '🌟', check: (e, curr) => curr && (START_WEIGHT - curr) >= 5 },
  { label: '10 lbs lost', desc: '10 lbs down from start', icon: '🏆', check: (e, curr) => curr && (START_WEIGHT - curr) >= 10 },
  { label: '4-week streak', desc: 'Logged 4 weeks in a row', icon: '🔥', check: (e) => calcStreak(e) >= 4 },
  { label: '12-week streak', desc: 'Logged 12 weeks straight', icon: '💫', check: (e) => calcStreak(e) >= 12 },
  { label: '1 year tracked', desc: 'Tracking for 52+ weeks', icon: '🎂', check: (e) => e.length >= 52 },
  { label: 'Goal reached!', desc: `Hit your goal of ${GOAL_WEIGHT} lbs`, icon: '🎉', check: (e, curr) => curr && curr <= GOAL_WEIGHT },
]

function calcStreak(entries) {
  if (!entries.length) return 0
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
  let streak = 1
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i].date)
    const prev = new Date(sorted[i + 1].date)
    if ((curr - prev) / (1000 * 60 * 60 * 24) <= 10) streak++
    else break
  }
  return streak
}

export default function Milestones({ entries }) {
  const current = entries[0]?.weight_lbs

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Milestones</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MILESTONES.map(m => {
          const earned = m.check(entries, current)
          return (
            <div
              key={m.label}
              className={`rounded-xl p-3 text-center transition-all ${
                earned
                  ? 'bg-teal-50 border border-teal-200'
                  : 'bg-slate-50 border border-slate-100 opacity-40 grayscale'
              }`}
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <p className={`text-xs font-bold ${earned ? 'text-teal-700' : 'text-slate-500'}`}>{m.label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{m.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

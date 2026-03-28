import React from 'react'

const GOAL_WEIGHT = 170
const START_WEIGHT = 181.4
const HEIGHT_IN = 70 // 5'10"

function bmi(weightLbs) {
  return ((weightLbs / (HEIGHT_IN * HEIGHT_IN)) * 703).toFixed(1)
}

export default function StatsBar({ entries }) {
  const latest = entries[0]
  const current = latest ? latest.weight_lbs : null
  const totalLost = current ? (START_WEIGHT - current).toFixed(1) : null
  const toGoal = current ? Math.max(0, current - GOAL_WEIGHT).toFixed(1) : null
  const streak = calcStreak(entries)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Current Weight"
        value={current ? `${current} lbs` : '—'}
        sub={current ? `BMI ${bmi(current)}` : null}
        color="teal"
      />
      <StatCard
        label="Total Lost"
        value={totalLost != null ? (totalLost > 0 ? `-${totalLost} lbs` : `+${Math.abs(totalLost)} lbs`) : '—'}
        sub={`Started at ${START_WEIGHT} lbs`}
        color={totalLost > 0 ? 'green' : 'slate'}
      />
      <StatCard
        label="To Goal"
        value={toGoal != null ? (toGoal > 0 ? `${toGoal} lbs` : '🎉 Reached!') : '—'}
        sub={`Goal: ${GOAL_WEIGHT} lbs`}
        color={toGoal === '0.0' ? 'green' : 'teal'}
      />
      <StatCard
        label="Check-in Streak"
        value={streak ? `${streak} wks` : '—'}
        sub="Weekly weigh-ins"
        color="purple"
      />
    </div>
  )
}

function StatCard({ label, value, sub, color }) {
  const colors = {
    teal:   'bg-teal-50 border-teal-200 text-teal-700',
    green:  'bg-green-50 border-green-200 text-green-700',
    slate:  'bg-slate-50 border-slate-200 text-slate-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  )
}

// Count consecutive weeks with entries
function calcStreak(entries) {
  if (!entries.length) return 0
  let streak = 1
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i].date)
    const prev = new Date(sorted[i + 1].date)
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24)
    if (diffDays <= 10) streak++
    else break
  }
  return streak
}

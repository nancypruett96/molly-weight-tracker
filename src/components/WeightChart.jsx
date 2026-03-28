import React, { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Legend
} from 'recharts'
import { format, parseISO, subMonths } from 'date-fns'

const GOAL = 170
const START = 181.4

const RANGES = [
  { label: '3 months', months: 3 },
  { label: '6 months', months: 6 },
  { label: '1 year', months: 12 },
  { label: 'All time', months: null },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const w = payload[0]?.value
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-xl font-bold text-teal-600">{w} lbs</p>
      <p className="text-xs text-slate-400">{(START - w).toFixed(1)} lbs from start</p>
    </div>
  )
}

export default function WeightChart({ entries }) {
  const [range, setRange] = useState(null)

  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date))
  const cutoff = range ? subMonths(new Date(), range) : null

  const chartData = sorted
    .filter(e => !cutoff || new Date(e.date) >= cutoff)
    .map(e => ({
      date: format(parseISO(e.date), 'MMM d, yyyy'),
      weight: e.weight_lbs,
    }))

  const weights = chartData.map(d => d.weight)
  const minY = Math.max(140, Math.min(...weights) - 3)
  const maxY = Math.max(START + 3, Math.max(...weights) + 3)

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
        <p className="text-lg">No data yet — log your first weigh-in below!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Weight Trend</h2>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => setRange(r.months)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                range === r.months
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={GOAL}
            stroke="#10b981"
            strokeDasharray="5 5"
            label={{ value: 'Goal', fill: '#10b981', fontSize: 11, position: 'right' }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0d9488' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

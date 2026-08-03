import { useMemo, useState } from 'react'

const DAY_MS = 86400000
const WEEKS = 53
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Monday-start week containing the given date.
function startOfWeek(d) {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  const shift = (out.getDay() + 6) % 7
  out.setDate(out.getDate() - shift)
  return out
}

export default function ActivityHeatmap({ matches }) {
  const [mode, setMode] = useState('volume')

  const { weeks, byDay, stats, maxCount } = useMemo(() => {
    const byDay = new Map()
    for (const m of matches) {
      const k = dayKey(new Date(m.ts))
      if (!byDay.has(k)) byDay.set(k, { n: 0, w: 0, l: 0 })
      const d = byDay.get(k)
      d.n++
      d[m.result]++
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const firstWeek = startOfWeek(new Date(today.getTime() - (WEEKS - 1) * 7 * DAY_MS))

    const weeks = []
    for (let w = 0; w < WEEKS; w++) {
      const days = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(firstWeek.getTime() + (w * 7 + d) * DAY_MS)
        const key = dayKey(date)
        days.push({
          key,
          date,
          future: date > today,
          data: byDay.get(key) || null,
        })
      }
      weeks.push(days)
    }

    let maxCount = 0
    for (const d of byDay.values()) if (d.n > maxCount) maxCount = d.n

    // Day streaks, walking back from today.
    let current = 0
    for (let i = 0; ; i++) {
      const k = dayKey(new Date(today.getTime() - i * DAY_MS))
      if (byDay.has(k)) current++
      else if (i > 0) break
      else if (!byDay.has(k)) break
    }

    const sortedKeys = [...byDay.keys()].sort()
    let longest = 0, run = 0, prev = null
    for (const k of sortedKeys) {
      const date = new Date(k + 'T00:00:00')
      if (prev && (date - prev) === DAY_MS) run++
      else run = 1
      if (run > longest) longest = run
      prev = date
    }

    let bestDay = null
    for (const [k, d] of byDay) {
      if (!bestDay || d.n > bestDay.n) bestDay = { key: k, ...d }
    }

    const stats = {
      daysActive: byDay.size,
      current,
      longest,
      bestDay,
      total: matches.length,
    }

    return { weeks, byDay, stats, maxCount }
  }, [matches])

  const level = (d) => {
    if (!d || d.n === 0) return 0
    if (maxCount <= 1) return 4
    return Math.min(4, Math.ceil((d.n / maxCount) * 4))
  }

  const cellClass = (day) => {
    if (day.future) return 'heat-cell heat-cell--future'
    const d = day.data
    if (!d) return 'heat-cell heat-cell--0'
    if (mode === 'winrate') {
      const rate = Math.round((d.w / d.n) * 100)
      const bucket = rate >= 70 ? 'great' : rate >= 50 ? 'good' : rate >= 30 ? 'mid' : 'bad'
      return `heat-cell heat-cell--wr-${bucket}`
    }
    return `heat-cell heat-cell--${level(d)}`
  }

  const title = (day) => {
    const label = day.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    if (day.future) return label
    if (!day.data) return `${label} — no matches`
    const { n, w, l } = day.data
    return `${label} — ${n} match${n === 1 ? '' : 'es'}, ${w}W-${l}L (${Math.round((w / n) * 100)}%)`
  }

  // Month label sits above the first week whose Monday starts a new month.
  const monthLabels = weeks.map((week, i) => {
    const first = week[0].date
    if (i === 0) return null
    const prevMonth = weeks[i - 1][0].date.getMonth()
    return first.getMonth() !== prevMonth ? MONTHS[first.getMonth()] : null
  })

  return (
    <div className="heat">
      <div className="heat-top">
        <div className="heat-stats">
          <div className="heat-stat">
            <span className="heat-stat__val">{stats.total}</span>
            <span className="heat-stat__label">Matches</span>
          </div>
          <div className="heat-stat">
            <span className="heat-stat__val">{stats.daysActive}</span>
            <span className="heat-stat__label">Days Played</span>
          </div>
          <div className="heat-stat">
            <span className="heat-stat__val heat-stat__val--good">{stats.current}</span>
            <span className="heat-stat__label">Current Streak</span>
          </div>
          <div className="heat-stat">
            <span className="heat-stat__val">{stats.longest}</span>
            <span className="heat-stat__label">Longest Streak</span>
          </div>
          {stats.bestDay && (
            <div className="heat-stat">
              <span className="heat-stat__val">{stats.bestDay.n}</span>
              <span className="heat-stat__label">Busiest Day</span>
            </div>
          )}
        </div>
        <div className="heat-modes">
          <button
            className={'heat-mode' + (mode === 'volume' ? ' heat-mode--active' : '')}
            type="button"
            onClick={() => setMode('volume')}
          >Volume</button>
          <button
            className={'heat-mode' + (mode === 'winrate' ? ' heat-mode--active' : '')}
            type="button"
            onClick={() => setMode('winrate')}
          >Win Rate</button>
        </div>
      </div>

      <div className="heat-scroll">
        <div className="heat-inner">
          <div className="heat-months">
            <div className="heat-months__spacer" />
            {monthLabels.map((m, i) => (
              <span key={i} className="heat-months__cell">{m}</span>
            ))}
          </div>
          <div className="heat-body">
            <div className="heat-days">
              {DAY_LABELS.map((d, i) => <span key={i} className="heat-days__label">{d}</span>)}
            </div>
            <div className="heat-grid">
              {weeks.map((week, wi) => (
                <div key={wi} className="heat-week">
                  {week.map(day => (
                    <div key={day.key} className={cellClass(day)} title={title(day)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="heat-legend">
        {mode === 'volume' ? (
          <>
            <span className="heat-legend__label">Less</span>
            {[0, 1, 2, 3, 4].map(l => <div key={l} className={`heat-cell heat-cell--${l}`} />)}
            <span className="heat-legend__label">More</span>
          </>
        ) : (
          <>
            <span className="heat-legend__label">Rough</span>
            {['bad', 'mid', 'good', 'great'].map(b => <div key={b} className={`heat-cell heat-cell--wr-${b}`} />)}
            <span className="heat-legend__label">Dominant</span>
          </>
        )}
      </div>
    </div>
  )
}

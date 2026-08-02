import { useState, useMemo, useCallback } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const RECORD_KEY = 'szMatchRecord'
const HISTORY_KEY = 'szMatchHistory'

function syncToJournal(enemyId, result) {
  try {
    const records = JSON.parse(localStorage.getItem(RECORD_KEY)) || {}
    if (!records[enemyId]) records[enemyId] = { w: 0, l: 0 }
    records[enemyId][result]++
    localStorage.setItem(RECORD_KEY, JSON.stringify(records))
  } catch {}
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
    history.unshift({ enemyId, result, ts: Date.now() })
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 500)))
  } catch {}
}

function formatDuration(ms) {
  const mins = Math.floor(ms / 60000)
  const hrs = Math.floor(mins / 60)
  if (hrs > 0) return `${hrs}h ${mins % 60}m`
  return `${mins}m`
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function SessionMode() {
  const [sessions, setSessions] = useLocalStorage('szSessions', [])
  const [active, setActive] = useLocalStorage('szActiveSession', null)
  const [search, setSearch] = useState('')
  const [viewingSession, setViewingSession] = useState(null)

  const searchResults = useMemo(() => {
    if (!search.trim()) return characters.slice(0, 16)
    return characters.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 12)
  }, [search])

  const startSession = useCallback(() => {
    setActive({ startedAt: Date.now(), matches: [] })
  }, [setActive])

  const logMatch = useCallback((enemyId, result) => {
    setActive(prev => {
      if (!prev) return prev
      return { ...prev, matches: [...prev.matches, { enemyId, result, ts: Date.now() }] }
    })
    syncToJournal(enemyId, result)
  }, [setActive])

  const endSession = useCallback(() => {
    if (!active || active.matches.length === 0) {
      setActive(null)
      return
    }
    const session = {
      id: Date.now().toString(36),
      startedAt: active.startedAt,
      endedAt: Date.now(),
      matches: active.matches,
    }
    setSessions(prev => [session, ...prev].slice(0, 50))
    setActive(null)
    setViewingSession(session)
  }, [active, setActive, setSessions])

  const deleteSession = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (viewingSession?.id === id) setViewingSession(null)
  }, [setSessions, viewingSession])

  const getSessionStats = (session) => {
    const matches = session.matches
    const wins = matches.filter(m => m.result === 'w').length
    const losses = matches.filter(m => m.result === 'l').length
    const total = matches.length
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0
    const duration = (session.endedAt || Date.now()) - session.startedAt

    let bestStreak = 0, worstStreak = 0, curW = 0, curL = 0
    for (const m of matches) {
      if (m.result === 'w') { curW++; curL = 0; if (curW > bestStreak) bestStreak = curW }
      else { curL++; curW = 0; if (curL > worstStreak) worstStreak = curL }
    }

    const oppRecord = {}
    for (const m of matches) {
      if (!oppRecord[m.enemyId]) oppRecord[m.enemyId] = { w: 0, l: 0 }
      oppRecord[m.enemyId][m.result]++
    }
    const oppEntries = Object.entries(oppRecord).map(([id, rec]) => ({
      id, char: charactersById[id], ...rec, total: rec.w + rec.l,
      winRate: Math.round((rec.w / (rec.w + rec.l)) * 100)
    })).filter(o => o.char)

    const hardest = [...oppEntries].filter(o => o.total >= 2).sort((a, b) => a.winRate - b.winRate).slice(0, 3)
    const easiest = [...oppEntries].filter(o => o.total >= 2).sort((a, b) => b.winRate - a.winRate).slice(0, 3)
    const mostFaced = [...oppEntries].sort((a, b) => b.total - a.total).slice(0, 3)

    return { wins, losses, total, winRate, duration, bestStreak, worstStreak, hardest, easiest, mostFaced }
  }

  const activeStats = active ? getSessionStats({ ...active, endedAt: Date.now() }) : null

  if (viewingSession) {
    const stats = getSessionStats(viewingSession)
    return (
      <div className="session">
        <button className="session-back" type="button" onClick={() => setViewingSession(null)}>&larr; Back</button>
        <SessionSummary session={viewingSession} stats={stats} />
      </div>
    )
  }

  if (active) {
    return (
      <div className="session">
        <div className="session-active-header">
          <div className="session-active-header__left">
            <div className="session-live-dot" />
            <span className="session-active-header__title">Session Live</span>
            <span className="session-active-header__time">{formatDuration(Date.now() - active.startedAt)}</span>
          </div>
          <button className="session-end-btn" type="button" onClick={endSession}>End Session</button>
        </div>

        <div className="session-live-stats">
          <div className="session-live-stat">
            <span className="session-live-stat__val">{activeStats.total}</span>
            <span className="session-live-stat__label">Matches</span>
          </div>
          <div className="session-live-stat">
            <span className="session-live-stat__val session-live-stat__val--w">{activeStats.wins}</span>
            <span className="session-live-stat__label">Wins</span>
          </div>
          <div className="session-live-stat">
            <span className="session-live-stat__val session-live-stat__val--l">{activeStats.losses}</span>
            <span className="session-live-stat__label">Losses</span>
          </div>
          <div className="session-live-stat">
            <span className="session-live-stat__val">{activeStats.winRate}%</span>
            <span className="session-live-stat__label">Win Rate</span>
          </div>
        </div>

        {active.matches.length > 0 && (
          <div className="session-momentum">
            <span className="session-momentum__label">Momentum</span>
            <div className="session-momentum__track">
              {active.matches.map((m, i) => (
                <div
                  key={i}
                  className={'session-momentum__dot session-momentum__dot--' + m.result}
                  title={`${charactersById[m.enemyId]?.name || '?'} — ${m.result === 'w' ? 'Win' : 'Loss'}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="session-log">
          <p className="session-log__intro">Who did you just fight?</p>
          <input
            className="session-log__search"
            type="text"
            placeholder="Search opponent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="session-log__grid">
            {searchResults.map(c => (
              <div key={c.id} className="session-log__card">
                <div className="session-log__card-top">
                  {c.forms[0]?.image ? (
                    <img className="session-log__card-img" src={c.forms[0].image} alt="" />
                  ) : (
                    <div className="session-log__card-ph" style={{ background: c.color }}>{c.name[0]}</div>
                  )}
                  <span className="session-log__card-name">{c.name}</span>
                </div>
                <div className="session-log__card-btns">
                  <button className="session-log__btn session-log__btn--w" type="button" onClick={() => logMatch(c.id, 'w')}>W</button>
                  <button className="session-log__btn session-log__btn--l" type="button" onClick={() => logMatch(c.id, 'l')}>L</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {active.matches.length > 0 && (
          <div className="session-recent">
            <h3 className="session-recent__title">This Session</h3>
            <div className="session-recent__list">
              {[...active.matches].reverse().map((m, i) => {
                const char = charactersById[m.enemyId]
                if (!char) return null
                return (
                  <div key={i} className={'session-recent__entry session-recent__entry--' + m.result}>
                    {char.forms[0]?.image ? (
                      <img className="session-recent__img" src={char.forms[0].image} alt="" />
                    ) : (
                      <div className="session-recent__ph" style={{ background: char.color }}>{char.name[0]}</div>
                    )}
                    <span className="session-recent__name">{char.name}</span>
                    <span className={'session-recent__result session-recent__result--' + m.result}>
                      {m.result === 'w' ? 'W' : 'L'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="session">
      <div className="session-start">
        <h2 className="session-start__title">Session Mode</h2>
        <p className="session-start__sub">Track a play session in real time. Log each match as you go, see your momentum, and get a full breakdown when you're done.</p>
        <button className="session-start__btn" type="button" onClick={startSession}>Start Session</button>
      </div>

      {sessions.length > 0 && (
        <div className="session-history">
          <h3 className="session-history__title">Past Sessions</h3>
          <div className="session-history__list">
            {sessions.map(s => {
              const stats = getSessionStats(s)
              return (
                <button key={s.id} className="session-history__card" type="button" onClick={() => setViewingSession(s)}>
                  <div className="session-history__card-top">
                    <span className="session-history__date">{formatDate(s.startedAt)}</span>
                    <span className="session-history__duration">{formatDuration(stats.duration)}</span>
                  </div>
                  <div className="session-history__card-stats">
                    <span className={'session-history__winrate' + (stats.winRate >= 50 ? ' session-history__winrate--good' : ' session-history__winrate--bad')}>
                      {stats.winRate}%
                    </span>
                    <span className="session-history__record">{stats.wins}W-{stats.losses}L</span>
                    <span className="session-history__total">{stats.total} matches</span>
                  </div>
                  <div className="session-history__momentum">
                    {s.matches.slice(0, 20).map((m, i) => (
                      <div key={i} className={'session-momentum__dot session-momentum__dot--' + m.result} />
                    ))}
                    {s.matches.length > 20 && <span className="session-history__more">+{s.matches.length - 20}</span>}
                  </div>
                  <button
                    className="session-history__delete"
                    type="button"
                    onClick={e => { e.stopPropagation(); deleteSession(s.id) }}
                  >&times;</button>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function SessionSummary({ session, stats }) {
  return (
    <div className="session-summary">
      <h2 className="session-summary__title">Session Summary</h2>
      <div className="session-summary__meta">
        <span>{formatDate(session.startedAt)}</span>
        <span>{formatDuration(stats.duration)}</span>
      </div>

      <div className="session-summary__big-stats">
        <div className="session-summary__stat">
          <span className={'session-summary__stat-val' + (stats.winRate >= 50 ? ' session-summary__stat-val--good' : ' session-summary__stat-val--bad')}>
            {stats.winRate}%
          </span>
          <span className="session-summary__stat-label">Win Rate</span>
        </div>
        <div className="session-summary__stat">
          <span className="session-summary__stat-val">{stats.wins}-{stats.losses}</span>
          <span className="session-summary__stat-label">Record</span>
        </div>
        <div className="session-summary__stat">
          <span className="session-summary__stat-val">{stats.total}</span>
          <span className="session-summary__stat-label">Matches</span>
        </div>
        <div className="session-summary__stat">
          <span className="session-summary__stat-val session-summary__stat-val--good">{stats.bestStreak}</span>
          <span className="session-summary__stat-label">Best Streak</span>
        </div>
        <div className="session-summary__stat">
          <span className="session-summary__stat-val session-summary__stat-val--bad">{stats.worstStreak}</span>
          <span className="session-summary__stat-label">Worst Streak</span>
        </div>
      </div>

      <div className="session-summary__momentum">
        <span className="session-momentum__label">Match Flow</span>
        <div className="session-momentum__track">
          {session.matches.map((m, i) => (
            <div
              key={i}
              className={'session-momentum__dot session-momentum__dot--' + m.result}
              title={`${charactersById[m.enemyId]?.name || '?'} — ${m.result === 'w' ? 'Win' : 'Loss'}`}
            />
          ))}
        </div>
      </div>

      {stats.mostFaced.length > 0 && (
        <div className="session-summary__section">
          <h3 className="session-summary__section-title">Most Faced</h3>
          <div className="session-summary__opp-list">
            {stats.mostFaced.map(o => (
              <div key={o.id} className="session-summary__opp">
                {o.char.forms[0]?.image ? (
                  <img className="session-summary__opp-img" src={o.char.forms[0].image} alt="" />
                ) : (
                  <div className="session-summary__opp-ph" style={{ background: o.char.color }}>{o.char.name[0]}</div>
                )}
                <span className="session-summary__opp-name">{o.char.name}</span>
                <span className="session-summary__opp-record">{o.w}W-{o.l}L</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.hardest.length > 0 && (
        <div className="session-summary__section">
          <h3 className="session-summary__section-title">Struggled Against</h3>
          <div className="session-summary__opp-list">
            {stats.hardest.map(o => (
              <div key={o.id} className="session-summary__opp">
                {o.char.forms[0]?.image ? (
                  <img className="session-summary__opp-img" src={o.char.forms[0].image} alt="" />
                ) : (
                  <div className="session-summary__opp-ph" style={{ background: o.char.color }}>{o.char.name[0]}</div>
                )}
                <span className="session-summary__opp-name">{o.char.name}</span>
                <span className="session-summary__opp-record session-summary__opp-record--bad">{o.winRate}% ({o.w}W-{o.l}L)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.easiest.length > 0 && (
        <div className="session-summary__section">
          <h3 className="session-summary__section-title">Dominated</h3>
          <div className="session-summary__opp-list">
            {stats.easiest.map(o => (
              <div key={o.id} className="session-summary__opp">
                {o.char.forms[0]?.image ? (
                  <img className="session-summary__opp-img" src={o.char.forms[0].image} alt="" />
                ) : (
                  <div className="session-summary__opp-ph" style={{ background: o.char.color }}>{o.char.name[0]}</div>
                )}
                <span className="session-summary__opp-name">{o.char.name}</span>
                <span className="session-summary__opp-record session-summary__opp-record--good">{o.winRate}% ({o.w}W-{o.l}L)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

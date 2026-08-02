import { useState, useMemo, useCallback } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const RECORD_KEY = 'szMatchRecord'
const HISTORY_KEY = 'szMatchHistory'

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(RECORD_KEY)) || {} } catch { return {} }
}
function saveRecords(r) { localStorage.setItem(RECORD_KEY, JSON.stringify(r)) }
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
}
function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)) }

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function FighterJournal() {
  const [main, setMain] = useLocalStorage('szMainFighter', null)
  const [records, setRecords] = useState(loadRecords)
  const [history, setHistory] = useState(loadHistory)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('overview')

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    return characters.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6)
  }, [search])

  const mainChar = main ? charactersById[main] : null

  const allOpponents = useMemo(() => {
    const entries = Object.entries(records).map(([id, rec]) => {
      const char = charactersById[id]
      if (!char) return null
      const total = rec.w + rec.l
      const winRate = total > 0 ? Math.round((rec.w / total) * 100) : 0
      return { id, char, ...rec, total, winRate }
    }).filter(Boolean)
    entries.sort((a, b) => b.total - a.total)
    return entries
  }, [records])

  const stats = useMemo(() => {
    let totalW = 0, totalL = 0
    for (const opp of allOpponents) { totalW += opp.w; totalL += opp.l }
    const total = totalW + totalL
    const winRate = total > 0 ? Math.round((totalW / total) * 100) : 0

    const worst = [...allOpponents].filter(o => o.total >= 2).sort((a, b) => a.winRate - b.winRate).slice(0, 5)
    const best = [...allOpponents].filter(o => o.total >= 2).sort((a, b) => b.winRate - a.winRate).slice(0, 5)

    const now = Date.now()
    const todayH = history.filter(h => now - h.ts < 86400000)
    const weekH = history.filter(h => now - h.ts < 604800000)
    const todayW = todayH.filter(h => h.result === 'w').length
    const todayL = todayH.filter(h => h.result === 'l').length
    const weekW = weekH.filter(h => h.result === 'w').length
    const weekL = weekH.filter(h => h.result === 'l').length

    let streak = null
    if (history.length > 0) {
      const latest = history[0].result
      let count = 0
      for (const entry of history) { if (entry.result !== latest) break; count++ }
      if (count >= 2) streak = { type: latest, count }
    }

    return { totalW, totalL, total, winRate, worst, best, todayW, todayL, weekW, weekL, streak }
  }, [allOpponents, history])

  const logMatch = useCallback((enemyId, result) => {
    setRecords(prev => {
      const next = { ...prev }
      if (!next[enemyId]) next[enemyId] = { w: 0, l: 0 }
      next[enemyId] = { ...next[enemyId], [result]: next[enemyId][result] + 1 }
      saveRecords(next)
      return next
    })
    setHistory(prev => {
      const entry = { enemyId, result, ts: Date.now() }
      const next = [entry, ...prev].slice(0, 500)
      saveHistory(next)
      return next
    })
  }, [])

  const recentHistory = history.slice(0, 20)

  if (!mainChar) {
    return (
      <div className="journal">
        <div className="journal-setup">
          <h2 className="journal-setup__title">Set Your Main</h2>
          <p className="journal-setup__sub">Pick the character you play most. Your journal tracks your matchup history and shows where to improve.</p>
          <div className="journal-setup__search-wrap">
            <input
              className="journal-setup__input"
              type="text"
              placeholder="Search your main..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {searchResults.length > 0 && (
              <div className="journal-setup__results">
                {searchResults.map(c => (
                  <button key={c.id} className="journal-setup__result" type="button" onClick={() => { setMain(c.id); setSearch('') }}>
                    {c.forms[0]?.image ? <img className="journal-setup__thumb" src={c.forms[0].image} alt="" /> : <div className="journal-setup__thumb-ph" style={{ background: c.color }}>{c.name[0]}</div>}
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="journal">
      <div className="journal-header">
        <div className="journal-main">
          {mainChar.forms[0]?.image ? (
            <img className="journal-main__img" src={mainChar.forms[0].image} alt="" />
          ) : (
            <div className="journal-main__ph" style={{ background: mainChar.color }}>{mainChar.name[0]}</div>
          )}
          <div>
            <div className="journal-main__label">Your Main</div>
            <h2 className="journal-main__name">{mainChar.name}</h2>
          </div>
          <button className="journal-main__change" type="button" onClick={() => setMain(null)}>Change</button>
        </div>

        <div className="journal-overview">
          <div className="journal-big-stat">
            <span className="journal-big-stat__val">{stats.winRate}%</span>
            <span className="journal-big-stat__label">Win Rate</span>
          </div>
          <div className="journal-big-stat">
            <span className="journal-big-stat__val">{stats.totalW}-{stats.totalL}</span>
            <span className="journal-big-stat__label">Overall</span>
          </div>
          <div className="journal-big-stat">
            <span className="journal-big-stat__val">{stats.todayW}-{stats.todayL}</span>
            <span className="journal-big-stat__label">Today</span>
          </div>
          <div className="journal-big-stat">
            <span className="journal-big-stat__val">{stats.weekW}-{stats.weekL}</span>
            <span className="journal-big-stat__label">This Week</span>
          </div>
          {stats.streak && (
            <div className={'journal-streak ' + (stats.streak.type === 'w' ? 'journal-streak--w' : 'journal-streak--l')}>
              {stats.streak.count} {stats.streak.type === 'w' ? 'Win' : 'Loss'} Streak
            </div>
          )}
        </div>
      </div>

      <div className="journal-tabs">
        <button className={'journal-tab' + (tab === 'overview' ? ' journal-tab--active' : '')} type="button" onClick={() => setTab('overview')}>Overview</button>
        <button className={'journal-tab' + (tab === 'log' ? ' journal-tab--active' : '')} type="button" onClick={() => setTab('log')}>Quick Log</button>
        <button className={'journal-tab' + (tab === 'history' ? ' journal-tab--active' : '')} type="button" onClick={() => setTab('history')}>History</button>
      </div>

      {tab === 'overview' && (
        <div className="journal-content">
          {stats.worst.length > 0 && (
            <div className="journal-section">
              <h3 className="journal-section__title">Needs Work (Lowest Win Rate)</h3>
              <div className="journal-matchup-list">
                {stats.worst.map(opp => (
                  <div key={opp.id} className="journal-matchup">
                    <div className="journal-matchup__left">
                      {opp.char.forms[0]?.image ? <img className="journal-matchup__img" src={opp.char.forms[0].image} alt="" /> : <div className="journal-matchup__ph" style={{ background: opp.char.color }}>{opp.char.name[0]}</div>}
                      <span className="journal-matchup__name">{opp.char.name}</span>
                    </div>
                    <div className="journal-matchup__right">
                      <span className={'journal-matchup__rate' + (opp.winRate < 40 ? ' journal-matchup__rate--bad' : '')}>{opp.winRate}%</span>
                      <span className="journal-matchup__record">{opp.w}W-{opp.l}L</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.best.length > 0 && (
            <div className="journal-section">
              <h3 className="journal-section__title">Strong Against (Highest Win Rate)</h3>
              <div className="journal-matchup-list">
                {stats.best.map(opp => (
                  <div key={opp.id} className="journal-matchup">
                    <div className="journal-matchup__left">
                      {opp.char.forms[0]?.image ? <img className="journal-matchup__img" src={opp.char.forms[0].image} alt="" /> : <div className="journal-matchup__ph" style={{ background: opp.char.color }}>{opp.char.name[0]}</div>}
                      <span className="journal-matchup__name">{opp.char.name}</span>
                    </div>
                    <div className="journal-matchup__right">
                      <span className={'journal-matchup__rate' + (opp.winRate >= 70 ? ' journal-matchup__rate--good' : '')}>{opp.winRate}%</span>
                      <span className="journal-matchup__record">{opp.w}W-{opp.l}L</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allOpponents.length === 0 && (
            <div className="journal-empty">
              <p>No matches logged yet. Use the Quick Log tab to record your results, or log wins/losses from the Matchups page.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'log' && (
        <div className="journal-content">
          <p className="journal-log-intro">Tap an opponent to log a win or loss.</p>
          <input
            className="journal-log-search"
            type="text"
            placeholder="Search opponent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="journal-log-grid">
            {(search.trim()
              ? characters.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 12)
              : characters.slice(0, 20)
            ).map(c => {
              const rec = records[c.id]
              return (
                <div key={c.id} className="journal-log-card">
                  <div className="journal-log-card__top">
                    {c.forms[0]?.image ? <img className="journal-log-card__img" src={c.forms[0].image} alt="" /> : <div className="journal-log-card__ph" style={{ background: c.color }}>{c.name[0]}</div>}
                    <span className="journal-log-card__name">{c.name}</span>
                  </div>
                  {rec && <span className="journal-log-card__record">{rec.w}W-{rec.l}L</span>}
                  <div className="journal-log-card__btns">
                    <button className="journal-log-btn journal-log-btn--w" type="button" onClick={() => logMatch(c.id, 'w')}>W</button>
                    <button className="journal-log-btn journal-log-btn--l" type="button" onClick={() => logMatch(c.id, 'l')}>L</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="journal-content">
          {recentHistory.length === 0 ? (
            <div className="journal-empty"><p>No match history yet.</p></div>
          ) : (
            <div className="journal-history-list">
              {recentHistory.map((h, i) => {
                const char = charactersById[h.enemyId]
                if (!char) return null
                return (
                  <div key={i} className={'journal-history-entry ' + (h.result === 'w' ? 'journal-history-entry--w' : 'journal-history-entry--l')}>
                    <div className="journal-history-entry__left">
                      {char.forms[0]?.image ? <img className="journal-history-entry__img" src={char.forms[0].image} alt="" /> : <div className="journal-history-entry__ph" style={{ background: char.color }}>{char.name[0]}</div>}
                      <span className="journal-history-entry__name">vs {char.name}</span>
                    </div>
                    <div className="journal-history-entry__right">
                      <span className={'journal-history-entry__result ' + (h.result === 'w' ? 'journal-history-entry__result--w' : 'journal-history-entry__result--l')}>
                        {h.result === 'w' ? 'WIN' : 'LOSS'}
                      </span>
                      <span className="journal-history-entry__time">{formatTime(h.ts)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState, useMemo, useCallback } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { getForm } from '../utils/dp.js'
import { tierLists } from '../data/tierList.js'
import { RANKED_META } from '../data/counterStrategies.js'
import CharacterDetail from './CharacterDetail.jsx'

const GOOD_TRAITS = ['Instant Spark', 'Dodge Skill', 'Unblockable Ultimate', 'Health Regeneration']
const GOOD_SKILLS = ['Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage', 'Full Power', 'Super Explosive Wave']
const RUSH_SKILLS = ['Rush Attack', 'Instant Transmission', 'False Courage']
const RECORD_KEY = 'szMatchRecord'
const HISTORY_KEY = 'szMatchHistory'

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(RECORD_KEY)) || {} } catch { return {} }
}
function saveRecords(records) {
  localStorage.setItem(RECORD_KEY, JSON.stringify(records))
}
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
}
function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

function getFormChain(char, selectedForm) {
  const idx = char.forms.findIndex(f => f.form === selectedForm.form)
  if (idx === -1) return char.forms
  return char.forms.slice(idx)
}

function getFullProfile(char, selectedForm) {
  const chain = selectedForm ? getFormChain(char, selectedForm) : char.forms
  const traits = new Set()
  const skills = new Set()
  const supers = []
  let bestDp = 0
  let peakHp = 0
  let peakMelee = 0
  let peakUltDmg = 0
  let startDp = selectedForm ? selectedForm.dp : char.forms[0].dp

  for (const form of chain) {
    for (const t of form.traits) traits.add(t)
    if (form.dp > bestDp) bestDp = form.dp
    if (form.health > peakHp) peakHp = form.health
    const combat = getCombatData(char.name, form.form)
    if (combat) {
      if (combat.skill1) skills.add(combat.skill1)
      if (combat.skill2) skills.add(combat.skill2)
      if (combat.meleeDmg > peakMelee) peakMelee = combat.meleeDmg
      if (combat.super1) supers.push(combat.super1)
      if (combat.super2) supers.push(combat.super2)
      if (combat.ultimate?.damage > peakUltDmg) peakUltDmg = combat.ultimate.damage
    }
  }

  const transformRange = bestDp - startDp
  return { traits, skills, supers, bestDp, startDp, peakHp, peakMelee, peakUltDmg, transformRange }
}

function scoreMatchup(myChar, myForm, enemyChar) {
  const my = getFullProfile(myChar, myForm)
  const enemy = getFullProfile(enemyChar, null)
  let score = 0

  if (enemy.traits.has('Instant Spark') && my.traits.has('Dodge Skill')) score += 2
  if (enemy.traits.has('Dodge Skill') && my.skills.has('Explosive Wave')) score += 2
  if (enemy.traits.has('Health Regeneration') && my.peakMelee > 4000) score += 1
  if (!enemy.traits.has('Dodge Skill') && my.peakMelee > 4000) score += 1
  if (!enemy.traits.has('Instant Spark') && my.traits.has('Unblockable Ultimate')) score += 2

  if (enemy.traits.has('Instant Spark') && !my.traits.has('Dodge Skill')) score -= 2
  if (enemy.traits.has('Dodge Skill') && !my.skills.has('Explosive Wave')) score -= 1
  if (enemy.traits.has('Unblockable Ultimate') && !my.traits.has('Instant Spark')) score -= 2
  if (enemy.traits.has('Health Regeneration')) score -= 1

  if (enemy.bestDp > RANKED_META.superArmourThreshold && my.bestDp <= RANKED_META.superArmourThreshold) score -= 4
  if (my.bestDp > RANKED_META.superArmourThreshold && enemy.bestDp <= RANKED_META.superArmourThreshold) score += 2

  const dpDiff = my.bestDp - enemy.bestDp
  if (dpDiff >= 2) score += 1
  if (dpDiff <= -2) score -= 1
  if (dpDiff <= -4) score -= 2

  if (my.peakHp < enemy.peakHp - 5000) score -= 1
  if (enemy.peakMelee > my.peakMelee + 2000) score -= 1

  if (my.transformRange >= 3) score += 1
  if (enemy.transformRange >= 3 && my.transformRange < 2) score -= 1

  if (my.peakUltDmg > 18000) score += 1
  if (enemy.peakUltDmg > 18000 && !my.traits.has('Instant Spark')) score -= 1

  let skillBonus = 0
  for (const s of my.skills) {
    if (GOOD_SKILLS.includes(s)) skillBonus += 0.5
  }
  score += Math.min(skillBonus, 1.5)

  for (const s of enemy.skills) {
    if (RUSH_SKILLS.includes(s) && !my.traits.has('Dodge Skill')) score -= 0.5
  }

  return score
}

function getMetaThreats(listIndex) {
  const tl = tierLists[listIndex]
  if (!tl) return []
  const threats = []
  for (const t of tl.tiers) {
    if (t.tier === 'Z' || t.tier === 'S' || t.tier === 'A') {
      for (const id of t.characters) {
        const char = charactersById[id]
        if (char && !threats.find(th => th.char.id === id)) {
          threats.push({ char, tier: t.tier })
        }
      }
    }
  }
  return threats
}

function getRating(score) {
  if (score >= 7) return { label: 'Easy', cls: 'mu-easy', icon: '++' }
  if (score >= 4) return { label: 'Favoured', cls: 'mu-fav', icon: '+' }
  if (score >= 1) return { label: 'Even', cls: 'mu-even', icon: '=' }
  if (score >= -2) return { label: 'Tough', cls: 'mu-tough', icon: '-' }
  return { label: 'Hard', cls: 'mu-hard', icon: '--' }
}

function getWinRate(rec) {
  if (!rec || (rec.w + rec.l) === 0) return null
  return Math.round((rec.w / (rec.w + rec.l)) * 100)
}

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

function getStreak(history) {
  if (history.length === 0) return null
  const latest = history[0].result
  let count = 0
  for (const entry of history) {
    if (entry.result !== latest) break
    count++
  }
  if (count < 2) return null
  return { type: latest, count }
}

function getSessionStats(history) {
  const now = Date.now()
  const today = history.filter(h => now - h.ts < 86400000)
  const week = history.filter(h => now - h.ts < 604800000)
  const todayW = today.filter(h => h.result === 'w').length
  const todayL = today.filter(h => h.result === 'l').length
  const weekW = week.filter(h => h.result === 'w').length
  const weekL = week.filter(h => h.result === 'l').length

  const nemesis = {}
  for (const h of history) {
    if (h.result === 'l') {
      nemesis[h.enemyId] = (nemesis[h.enemyId] || 0) + 1
    }
  }
  let nemesisId = null, nemesisCount = 0
  for (const [id, c] of Object.entries(nemesis)) {
    if (c > nemesisCount) { nemesisId = id; nemesisCount = c }
  }

  const victim = {}
  for (const h of history) {
    if (h.result === 'w') {
      victim[h.enemyId] = (victim[h.enemyId] || 0) + 1
    }
  }
  let victimId = null, victimCount = 0
  for (const [id, c] of Object.entries(victim)) {
    if (c > victimCount) { victimId = id; victimCount = c }
  }

  return {
    today: { w: todayW, l: todayL, total: todayW + todayL },
    week: { w: weekW, l: weekL, total: weekW + weekL },
    nemesis: nemesisId && nemesisCount >= 2 ? { id: nemesisId, losses: nemesisCount } : null,
    victim: victimId && victimCount >= 2 ? { id: victimId, wins: victimCount } : null,
  }
}

export default function MatchupChart({ team }) {
  const [listIndex, setListIndex] = useState(0)
  const [detailChar, setDetailChar] = useState(null)
  const [filter, setFilter] = useState('all')
  const [records, setRecords] = useState(loadRecords)
  const [history, setHistory] = useState(loadHistory)
  const [tab, setTab] = useState('analysis')

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

  const undoRecord = useCallback((enemyId, type) => {
    setRecords(prev => {
      const next = { ...prev }
      if (!next[enemyId] || next[enemyId][type] <= 0) return prev
      next[enemyId] = { ...next[enemyId], [type]: next[enemyId][type] - 1 }
      if (next[enemyId].w === 0 && next[enemyId].l === 0) delete next[enemyId]
      saveRecords(next)
      return next
    })
  }, [])

  const clearRecord = useCallback((enemyId) => {
    setRecords(prev => {
      const next = { ...prev }
      delete next[enemyId]
      saveRecords(next)
      return next
    })
    setHistory(prev => {
      const next = prev.filter(h => h.enemyId !== enemyId)
      saveHistory(next)
      return next
    })
  }, [])

  const deleteHistoryEntry = useCallback((index) => {
    setHistory(prev => {
      const entry = prev[index]
      if (!entry) return prev
      const next = [...prev]
      next.splice(index, 1)
      saveHistory(next)
      setRecords(recs => {
        const updated = { ...recs }
        if (updated[entry.enemyId]) {
          updated[entry.enemyId] = { ...updated[entry.enemyId], [entry.result]: Math.max(0, updated[entry.enemyId][entry.result] - 1) }
          if (updated[entry.enemyId].w === 0 && updated[entry.enemyId].l === 0) delete updated[entry.enemyId]
          saveRecords(updated)
        }
        return updated
      })
      return next
    })
  }, [])

  const clearAllHistory = useCallback(() => {
    setHistory([])
    setRecords({})
    saveHistory([])
    saveRecords({})
  }, [])

  const teamRows = team
    .map(item => {
      const char = charactersById[item.characterId]
      const form = getForm(item)
      return char && form ? { char, form, item } : null
    })
    .filter(Boolean)

  const threats = useMemo(() => getMetaThreats(listIndex), [listIndex])

  const analysis = useMemo(() => {
    if (teamRows.length === 0 || threats.length === 0) return null

    const results = threats.map(({ char: enemy, tier }) => {
      let bestScore = -Infinity
      let bestChar = null
      let bestForm = null
      const scores = []

      for (const row of teamRows) {
        const s = scoreMatchup(row.char, row.form, enemy)
        scores.push({ char: row.char, form: row.form, score: s })
        if (s > bestScore) {
          bestScore = s
          bestChar = row.char
          bestForm = row.form
        }
      }

      const enemyData = getFullProfile(enemy, null)
      const bestEnemyForm = enemy.forms.reduce((a, b) => b.dp > a.dp ? b : a, enemy.forms[0])
      const rating = getRating(bestScore)

      return { enemy, enemyData, bestEnemyForm, tier, bestScore, bestChar, bestForm, rating, scores }
    })

    results.sort((a, b) => a.bestScore - b.bestScore)

    const covered = results.filter(r => r.bestScore >= 4).length
    const even = results.filter(r => r.bestScore >= 1 && r.bestScore < 4).length
    const struggling = results.filter(r => r.bestScore < 1).length

    return { results, covered, even, struggling, total: results.length }
  }, [teamRows, threats])

  const teamSummary = useMemo(() => {
    if (teamRows.length === 0) return null
    const traits = new Set()
    const skills = new Set()
    let totalDp = 0
    let highDpCount = 0
    let lowDpCount = 0

    for (const row of teamRows) {
      const profile = getFullProfile(row.char, row.form)
      totalDp += row.form.dp
      if (profile.bestDp > RANKED_META.superArmourThreshold) highDpCount++
      if (profile.bestDp <= 4) lowDpCount++
      for (const t of profile.traits) traits.add(t)
      for (const s of profile.skills) skills.add(s)
    }

    const gaps = []
    if (!traits.has('Dodge Skill')) gaps.push('No Dodge Skill — vulnerable to rushdown and combos')
    if (!traits.has('Instant Spark')) gaps.push('No Instant Spark — cannot escape enemy combos')
    if (!traits.has('Unblockable Ultimate')) gaps.push('No Unblockable Ultimate — tanky enemies can wall you')
    if (highDpCount === 0 && teamRows.length > 0) gaps.push('No characters above 7 DP — vulnerable to super armour')
    if (lowDpCount === teamRows.length && teamRows.length > 1) gaps.push('All low DP — high DP enemies will have super armour against your entire team')
    if (!skills.has('Explosive Wave') && !skills.has('Super Explosive Wave')) gaps.push('No Explosive Wave — weak against Dodge Skill abusers')
    if (!skills.has('Afterimage Strike') && !skills.has('Wild Sense')) gaps.push('No evasion skills (Afterimage/Wild Sense) — less survivability')

    return { traits, skills, totalDp, highDpCount, lowDpCount, gaps }
  }, [teamRows])

  const totalRecord = useMemo(() => {
    let w = 0, l = 0
    for (const rec of Object.values(records)) { w += rec.w; l += rec.l }
    return { w, l, total: w + l }
  }, [records])

  const streak = useMemo(() => getStreak(history), [history])
  const sessionStats = useMemo(() => getSessionStats(history), [history])

  const filteredResults = analysis?.results.filter(r => {
    if (filter === 'all') return true
    if (filter === 'struggling') return r.bestScore < 1
    if (filter === 'even') return r.bestScore >= 1 && r.bestScore < 4
    if (filter === 'covered') return r.bestScore >= 4
    if (filter === 'tracked') return records[r.enemy.id]
    return true
  }) ?? []

  return (
    <div className="mu-page">
      <div className="mu-header">
        <div className="mu-list-switch">
          {tierLists.map((tl, i) => (
            <button
              key={tl.name}
              type="button"
              className={i === listIndex ? 'rankings-cat-btn rankings-cat-btn--active' : 'rankings-cat-btn'}
              onClick={() => setListIndex(i)}
            >
              {tl.name} Meta
            </button>
          ))}
        </div>
        <div className="mu-tab-switch">
          <button type="button" className={`mu-tab-btn${tab === 'analysis' ? ' mu-tab-btn--active' : ''}`} onClick={() => setTab('analysis')}>Analysis</button>
          <button type="button" className={`mu-tab-btn${tab === 'history' ? ' mu-tab-btn--active' : ''}`} onClick={() => setTab('history')}>
            Match Log{history.length > 0 ? ` (${history.length})` : ''}
          </button>
        </div>
      </div>

      {totalRecord.total > 0 && (
        <div className="mu-record-bar">
          <span className="mu-record-bar__label">Your Record</span>
          <span className="mu-record-bar__wins">{totalRecord.w}W</span>
          <span className="mu-record-bar__sep">-</span>
          <span className="mu-record-bar__losses">{totalRecord.l}L</span>
          {totalRecord.total > 0 && (
            <span className={`mu-record-bar__rate ${getWinRate(totalRecord) >= 50 ? 'mu-record-bar__rate--good' : 'mu-record-bar__rate--bad'}`}>
              {getWinRate(totalRecord)}% WR
            </span>
          )}
          {streak && (
            <span className={`mu-record-bar__streak ${streak.type === 'w' ? 'mu-record-bar__streak--win' : 'mu-record-bar__streak--loss'}`}>
              {streak.count} {streak.type === 'w' ? 'Win' : 'Loss'} Streak
            </span>
          )}
          {tab === 'analysis' && (
            <button type="button" className="mu-record-bar__filter" onClick={() => setFilter(filter === 'tracked' ? 'all' : 'tracked')}>
              {filter === 'tracked' ? 'Show all' : 'Tracked only'}
            </button>
          )}
        </div>
      )}

      {tab === 'history' ? (
        <div className="mu-history">
          {history.length === 0 ? (
            <div className="mu-empty">
              <div className="mu-empty__icon">0-0</div>
              <h3 className="mu-empty__title">No Matches Logged</h3>
              <p className="mu-empty__text">Use the W and L buttons on the Analysis tab to log your match results.</p>
            </div>
          ) : (
            <>
              <div className="mu-history__stats">
                <div className="mu-stat">
                  <span className="mu-stat__label">Today</span>
                  <span className="mu-stat__value">
                    <span className="mu-stat__w">{sessionStats.today.w}W</span>
                    <span className="mu-stat__sep">-</span>
                    <span className="mu-stat__l">{sessionStats.today.l}L</span>
                  </span>
                  {sessionStats.today.total > 0 && (
                    <span className={`mu-stat__wr ${getWinRate(sessionStats.today) >= 50 ? 'mu-stat__wr--good' : 'mu-stat__wr--bad'}`}>
                      {getWinRate(sessionStats.today)}%
                    </span>
                  )}
                </div>
                <div className="mu-stat">
                  <span className="mu-stat__label">This Week</span>
                  <span className="mu-stat__value">
                    <span className="mu-stat__w">{sessionStats.week.w}W</span>
                    <span className="mu-stat__sep">-</span>
                    <span className="mu-stat__l">{sessionStats.week.l}L</span>
                  </span>
                  {sessionStats.week.total > 0 && (
                    <span className={`mu-stat__wr ${getWinRate(sessionStats.week) >= 50 ? 'mu-stat__wr--good' : 'mu-stat__wr--bad'}`}>
                      {getWinRate(sessionStats.week)}%
                    </span>
                  )}
                </div>
                <div className="mu-stat">
                  <span className="mu-stat__label">All Time</span>
                  <span className="mu-stat__value">
                    <span className="mu-stat__w">{totalRecord.w}W</span>
                    <span className="mu-stat__sep">-</span>
                    <span className="mu-stat__l">{totalRecord.l}L</span>
                  </span>
                  {totalRecord.total > 0 && (
                    <span className={`mu-stat__wr ${getWinRate(totalRecord) >= 50 ? 'mu-stat__wr--good' : 'mu-stat__wr--bad'}`}>
                      {getWinRate(totalRecord)}%
                    </span>
                  )}
                </div>
                {sessionStats.nemesis && (
                  <div className="mu-stat mu-stat--nemesis">
                    <span className="mu-stat__label">Nemesis</span>
                    <span className="mu-stat__char">
                      {(() => {
                        const c = charactersById[sessionStats.nemesis.id]
                        const f = c?.forms.reduce((a, b) => b.dp > a.dp ? b : a, c.forms[0])
                        return c ? (
                          <>
                            {f?.image && <img className="mu-stat__img" src={f.image} alt={c.name} />}
                            <span>{c.name}</span>
                          </>
                        ) : sessionStats.nemesis.id
                      })()}
                    </span>
                    <span className="mu-stat__detail">{sessionStats.nemesis.losses} losses</span>
                  </div>
                )}
                {sessionStats.victim && (
                  <div className="mu-stat mu-stat--victim">
                    <span className="mu-stat__label">Easiest</span>
                    <span className="mu-stat__char">
                      {(() => {
                        const c = charactersById[sessionStats.victim.id]
                        const f = c?.forms.reduce((a, b) => b.dp > a.dp ? b : a, c.forms[0])
                        return c ? (
                          <>
                            {f?.image && <img className="mu-stat__img" src={f.image} alt={c.name} />}
                            <span>{c.name}</span>
                          </>
                        ) : sessionStats.victim.id
                      })()}
                    </span>
                    <span className="mu-stat__detail">{sessionStats.victim.wins} wins</span>
                  </div>
                )}
              </div>

              <div className="mu-history__actions">
                <button type="button" className="mu-history__clear" onClick={clearAllHistory}>Clear All History</button>
              </div>

              <div className="mu-history__list">
                {history.map((entry, i) => {
                  const char = charactersById[entry.enemyId]
                  const bestForm = char?.forms.reduce((a, b) => b.dp > a.dp ? b : a, char?.forms[0])
                  return (
                    <div key={`${entry.ts}-${i}`} className={`mu-history__entry ${entry.result === 'w' ? 'mu-history__entry--win' : 'mu-history__entry--loss'}`}>
                      <span className={`mu-history__result ${entry.result === 'w' ? 'mu-history__result--win' : 'mu-history__result--loss'}`}>
                        {entry.result === 'w' ? 'WIN' : 'LOSS'}
                      </span>
                      {bestForm?.image ? (
                        <img className="mu-history__img" src={bestForm.image} alt={char?.name} onClick={() => char && setDetailChar(char)} />
                      ) : (
                        <div className="mu-history__ph" style={{ background: char?.color }} onClick={() => char && setDetailChar(char)}>{char?.name?.[0] || '?'}</div>
                      )}
                      <span className="mu-history__name" onClick={() => char && setDetailChar(char)}>{char?.name || entry.enemyId}</span>
                      <span className="mu-history__time">{formatTime(entry.ts)}</span>
                      <button type="button" className="mu-history__delete" onClick={() => deleteHistoryEntry(i)} title="Remove entry">x</button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {teamRows.length === 0 ? (
            <div className="mu-empty">
              <div className="mu-empty__icon">vs</div>
              <h3 className="mu-empty__title">Team Matchup Analysis</h3>
              <p className="mu-empty__text">Add fighters to your team to see how you match up against the meta.</p>
              <p className="mu-empty__hint">Go to Team Builder, add some characters, then come back here.</p>
            </div>
          ) : (
            <>
              {teamSummary && (
                <div className="mu-summary">
                  <div className="mu-summary__team">
                    <h4 className="mu-summary__label">Your Team</h4>
                    <div className="mu-summary__fighters">
                      {teamRows.map(r => (
                        <div key={`${r.item.characterId}-${r.item.formName}`} className="mu-summary__fighter">
                          {r.form.image ? (
                            <img src={r.form.image} alt={r.char.name} />
                          ) : (
                            <div className="mu-summary__ph" style={{ background: r.char.color }}>{r.char.name[0]}</div>
                          )}
                          <div className="mu-summary__fighter-info">
                            <span className="mu-summary__fighter-name">{r.char.name}</span>
                            <span className="mu-summary__fighter-dp">
                              {(() => {
                                const p = getFullProfile(r.char, r.form)
                                return p.bestDp > r.form.dp ? `${r.form.dp}→${p.bestDp} DP` : `${r.form.dp} DP`
                              })()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mu-summary__traits">
                      {[...teamSummary.traits].filter(t => GOOD_TRAITS.includes(t)).map(t => (
                        <span key={t} className="cg-tag cg-tag--trait">{t}</span>
                      ))}
                      {[...teamSummary.skills].filter(s => GOOD_SKILLS.includes(s)).map(s => (
                        <span key={s} className="cg-tag cg-tag--skill">{s}</span>
                      ))}
                    </div>
                  </div>

                  {teamSummary.gaps.length > 0 && (
                    <div className="mu-gaps">
                      <h4 className="mu-gaps__label">Team Gaps</h4>
                      <ul className="mu-gaps__list">
                        {teamSummary.gaps.map((g, i) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {analysis && (
                <>
                  <div className="mu-score-bar">
                    <button
                      className={`mu-score-pill mu-score-pill--green${filter === 'covered' ? ' mu-score-pill--active' : ''}`}
                      type="button" onClick={() => setFilter(filter === 'covered' ? 'all' : 'covered')}
                    >
                      Covered {analysis.covered}
                    </button>
                    <button
                      className={`mu-score-pill mu-score-pill--yellow${filter === 'even' ? ' mu-score-pill--active' : ''}`}
                      type="button" onClick={() => setFilter(filter === 'even' ? 'all' : 'even')}
                    >
                      Even {analysis.even}
                    </button>
                    <button
                      className={`mu-score-pill mu-score-pill--red${filter === 'struggling' ? ' mu-score-pill--active' : ''}`}
                      type="button" onClick={() => setFilter(filter === 'struggling' ? 'all' : 'struggling')}
                    >
                      Struggling {analysis.struggling}
                    </button>
                    <span className="mu-score-total">/ {analysis.total} meta threats</span>
                  </div>

                  <div className="mu-threats">
                    {filteredResults.map(r => {
                      const rec = records[r.enemy.id]
                      const wr = getWinRate(rec)
                      return (
                        <div key={r.enemy.id} className={`mu-threat ${r.rating.cls}`}>
                          <div className="mu-threat__enemy" onClick={() => setDetailChar(r.enemy)}>
                            {r.bestEnemyForm.image ? (
                              <img className="mu-threat__img" src={r.bestEnemyForm.image} alt={r.enemy.name} />
                            ) : (
                              <div className="mu-threat__ph" style={{ background: r.enemy.color }}>{r.enemy.name[0]}</div>
                            )}
                            <div className="mu-threat__info">
                              <span className="mu-threat__name">{r.enemy.name}</span>
                              <span className="mu-threat__dp">
                                {r.enemyData.startDp !== r.enemyData.bestDp
                                  ? `${r.enemyData.startDp}→${r.enemyData.bestDp} DP`
                                  : `${r.enemyData.bestDp} DP`}
                              </span>
                              <span className={`mu-threat__tier mu-threat__tier--${r.tier.toLowerCase()}`}>{r.tier}</span>
                            </div>
                          </div>

                          <div className="mu-threat__traits">
                            {[...r.enemyData.traits].filter(t => GOOD_TRAITS.includes(t)).map(t => (
                              <span key={t} className="mu-threat__trait">{t}</span>
                            ))}
                            {r.enemyData.bestDp > RANKED_META.superArmourThreshold && (
                              <span className="mu-threat__trait mu-threat__trait--armour">Super Armour</span>
                            )}
                          </div>

                          <div className={`mu-threat__verdict ${r.rating.cls}`}>
                            <span className="mu-threat__icon">{r.rating.icon}</span>
                            <span className="mu-threat__label">{r.rating.label}</span>
                          </div>

                          <div className="mu-threat__answer">
                            <span className="mu-threat__answer-label">Best answer:</span>
                            {r.bestForm?.image ? (
                              <img className="mu-threat__answer-img" src={r.bestForm.image} alt={r.bestChar?.name} />
                            ) : (
                              <div className="mu-threat__answer-ph" style={{ background: r.bestChar?.color }}>{r.bestChar?.name[0]}</div>
                            )}
                            <span className="mu-threat__answer-name">{r.bestChar?.name}</span>
                          </div>

                          <div className="mu-threat__record">
                            <div className="mu-record">
                              <button type="button" className="mu-record__btn mu-record__btn--win" onClick={() => logMatch(r.enemy.id, 'w')}>W</button>
                              <button type="button" className="mu-record__btn mu-record__btn--loss" onClick={() => logMatch(r.enemy.id, 'l')}>L</button>
                              {rec && (
                                <div className="mu-record__display">
                                  <span className="mu-record__score">
                                    <span className="mu-record__w" onContextMenu={e => { e.preventDefault(); undoRecord(r.enemy.id, 'w') }}>{rec.w}</span>
                                    -
                                    <span className="mu-record__l" onContextMenu={e => { e.preventDefault(); undoRecord(r.enemy.id, 'l') }}>{rec.l}</span>
                                  </span>
                                  {wr !== null && (
                                    <span className={`mu-record__wr ${wr >= 50 ? 'mu-record__wr--good' : 'mu-record__wr--bad'}`}>{wr}%</span>
                                  )}
                                  <button type="button" className="mu-record__clear" onClick={() => clearRecord(r.enemy.id)} title="Clear record">x</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {detailChar && (
        <CharacterDetail character={detailChar} onClose={() => setDetailChar(null)} />
      )}
    </div>
  )
}

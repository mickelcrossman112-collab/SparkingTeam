import { useState, useMemo } from 'react'
import { charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { getForm, teamDpTotal } from '../utils/dp.js'

function teamStats(team) {
  let totalHp = 0
  let totalMelee = 0
  let totalKi = 0
  let totalDef = 0
  const tags = {}
  const traits = []
  let count = 0

  for (const item of team) {
    const char = charactersById[item.characterId]
    const form = getForm(item)
    if (!char || !form) continue
    count++
    totalHp += form.health
    for (const t of form.tags || []) tags[t] = (tags[t] || 0) + 1
    for (const t of form.traits) if (!traits.includes(t)) traits.push(t)
    const combat = getCombatData(char.name, form.form)
    if (combat) {
      totalMelee += combat.meleeDmg
      totalKi += combat.kiBlastDmg
      totalDef += combat.defense
    }
  }

  const synergies = Object.entries(tags).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1])

  return {
    count,
    dp: teamDpTotal(team),
    totalHp,
    avgHp: count > 0 ? Math.round(totalHp / count) : 0,
    totalMelee,
    avgMelee: count > 0 ? Math.round(totalMelee / count) : 0,
    totalKi,
    avgKi: count > 0 ? Math.round(totalKi / count) : 0,
    totalDef,
    avgDef: count > 0 ? Math.round(totalDef / count) : 0,
    synergies,
    traits,
  }
}

function StatRow({ label, valA, valB, fmt }) {
  const a = fmt ? fmt(valA) : valA.toLocaleString()
  const b = fmt ? fmt(valB) : valB.toLocaleString()
  const diff = valA - valB
  const clsA = diff > 0 ? 'cmp-stat--win' : diff < 0 ? 'cmp-stat--lose' : ''
  const clsB = diff < 0 ? 'cmp-stat--win' : diff > 0 ? 'cmp-stat--lose' : ''

  return (
    <div className="cmp-stat-row">
      <span className={`cmp-stat-val ${clsA}`}>{a}</span>
      <span className="cmp-stat-label">{label}</span>
      <span className={`cmp-stat-val ${clsB}`}>{b}</span>
    </div>
  )
}

function TeamColumn({ team, label }) {
  return (
    <div className="cmp-team-col">
      <h4 className="cmp-team-label">{label}</h4>
      <div className="cmp-portraits">
        {team.map((item, i) => {
          const char = charactersById[item.characterId]
          const form = getForm(item)
          if (!char || !form) return null
          return (
            <div key={`${item.characterId}-${i}`} className="cmp-portrait">
              {form.image ? (
                <img src={form.image} alt={char.name} />
              ) : (
                <div className="cmp-portrait__ph" style={{ background: char.color }}>{char.name[0]}</div>
              )}
              <span className="cmp-portrait__name">{char.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TeamCompare({ teams }) {
  const [teamAId, setTeamAId] = useState('')
  const [teamBId, setTeamBId] = useState('')

  const teamA = teams.find((t) => t.id === teamAId)
  const teamB = teams.find((t) => t.id === teamBId)

  const statsA = useMemo(() => teamA ? teamStats(teamA.team) : null, [teamA])
  const statsB = useMemo(() => teamB ? teamStats(teamB.team) : null, [teamB])

  if (teams.length < 2) {
    return (
      <div className="cmp-page">
        <div className="cmp-empty">
          <p>Save at least 2 teams to compare them side by side.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cmp-page">
      <div className="cmp-selectors">
        <select
          className="cmp-select"
          value={teamAId}
          onChange={(e) => setTeamAId(e.target.value)}
        >
          <option value="">Select Team A</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id} disabled={t.id === teamBId}>{t.name}</option>
          ))}
        </select>
        <span className="cmp-vs">VS</span>
        <select
          className="cmp-select"
          value={teamBId}
          onChange={(e) => setTeamBId(e.target.value)}
        >
          <option value="">Select Team B</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id} disabled={t.id === teamAId}>{t.name}</option>
          ))}
        </select>
      </div>

      {teamA && teamB && statsA && statsB && (
        <div className="cmp-body">
          <div className="cmp-rosters">
            <TeamColumn team={teamA.team} label={teamA.name} />
            <div className="cmp-divider" />
            <TeamColumn team={teamB.team} label={teamB.name} />
          </div>

          <div className="cmp-stats">
            <h3 className="cmp-stats-title">Stats Comparison</h3>
            <StatRow label="Team Size" valA={statsA.count} valB={statsB.count} />
            <StatRow label="DP Used" valA={statsA.dp} valB={statsB.dp} />
            <StatRow label="Total HP" valA={statsA.totalHp} valB={statsB.totalHp} />
            <StatRow label="Avg HP" valA={statsA.avgHp} valB={statsB.avgHp} />
            <StatRow label="Avg Melee" valA={statsA.avgMelee} valB={statsB.avgMelee} />
            <StatRow label="Avg Ki Blast" valA={statsA.avgKi} valB={statsB.avgKi} />
            <StatRow label="Avg Defense" valA={statsA.avgDef} valB={statsB.avgDef} />
            <StatRow label="Synergies" valA={statsA.synergies.length} valB={statsB.synergies.length} />
          </div>

          <div className="cmp-synergy-compare">
            <div className="cmp-syn-col">
              <h4 className="cmp-syn-title">{teamA.name} Synergies</h4>
              {statsA.synergies.length === 0 && <p className="cmp-syn-none">None</p>}
              {statsA.synergies.map(([tag, count]) => (
                <span key={tag} className="cmp-syn-pill">{tag} x{count}</span>
              ))}
            </div>
            <div className="cmp-syn-col">
              <h4 className="cmp-syn-title">{teamB.name} Synergies</h4>
              {statsB.synergies.length === 0 && <p className="cmp-syn-none">None</p>}
              {statsB.synergies.map(([tag, count]) => (
                <span key={tag} className="cmp-syn-pill">{tag} x{count}</span>
              ))}
            </div>
          </div>

          <div className="cmp-traits-compare">
            <div className="cmp-trait-col">
              <h4 className="cmp-trait-title">Traits</h4>
              {statsA.traits.map((t) => (
                <span key={t} className={`cmp-trait-pill ${!statsB.traits.includes(t) ? 'cmp-trait-pill--unique' : ''}`}>{t}</span>
              ))}
            </div>
            <div className="cmp-trait-col">
              <h4 className="cmp-trait-title">Traits</h4>
              {statsB.traits.map((t) => (
                <span key={t} className={`cmp-trait-pill ${!statsA.traits.includes(t) ? 'cmp-trait-pill--unique' : ''}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useMemo } from 'react'
import { charactersById } from '../data/characters.js'
import { getForm, teamDpTotal } from '../utils/dp.js'
import { ACHIEVEMENTS } from '../data/achievements.js'

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="meta-bar">
      <span className="meta-bar__label">{label}</span>
      <div className="meta-bar__track">
        <div className="meta-bar__fill" style={{ width: pct + '%', background: color }} />
      </div>
      <span className="meta-bar__val">{value}</span>
    </div>
  )
}

export default function MetaDashboard({ savedTeams, unlockedIds }) {
  const stats = useMemo(() => {
    if (savedTeams.length === 0) return null

    const charCounts = {}
    const tagCounts = {}
    const dpValues = []
    const sizeCounts = [0, 0, 0, 0, 0, 0]
    let totalFighters = 0

    for (const saved of savedTeams) {
      const dp = teamDpTotal(saved.team)
      dpValues.push(dp)
      sizeCounts[saved.team.length] = (sizeCounts[saved.team.length] || 0) + 1
      totalFighters += saved.team.length

      for (const item of saved.team) {
        charCounts[item.characterId] = (charCounts[item.characterId] || 0) + 1
        const form = getForm(item)
        if (form) {
          for (const t of form.tags || []) {
            tagCounts[t] = (tagCounts[t] || 0) + 1
          }
        }
      }
    }

    const topChars = Object.entries(charCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ char: charactersById[id], count }))
      .filter((x) => x.char)

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    const avgDp = dpValues.length > 0 ? (dpValues.reduce((s, v) => s + v, 0) / dpValues.length).toFixed(1) : 0
    const avgSize = savedTeams.length > 0 ? (totalFighters / savedTeams.length).toFixed(1) : 0
    const maxCharCount = topChars.length > 0 ? topChars[0].count : 1
    const maxTagCount = topTags.length > 0 ? topTags[0][1] : 1

    return { topChars, topTags, avgDp, avgSize, maxCharCount, maxTagCount, totalFighters, dpValues }
  }, [savedTeams])

  const unlockedCount = unlockedIds.size
  const totalBadges = ACHIEVEMENTS.length

  return (
    <div className="meta-page">
      <h2 className="meta-heading">Meta Dashboard</h2>

      <div className="meta-overview">
        <div className="meta-stat-card">
          <span className="meta-stat-card__val">{savedTeams.length}</span>
          <span className="meta-stat-card__label">Teams Saved</span>
        </div>
        <div className="meta-stat-card">
          <span className="meta-stat-card__val">{stats?.totalFighters || 0}</span>
          <span className="meta-stat-card__label">Total Fighters Used</span>
        </div>
        <div className="meta-stat-card">
          <span className="meta-stat-card__val">{stats?.avgDp || 0}</span>
          <span className="meta-stat-card__label">Avg DP / Team</span>
        </div>
        <div className="meta-stat-card">
          <span className="meta-stat-card__val">{stats?.avgSize || 0}</span>
          <span className="meta-stat-card__label">Avg Team Size</span>
        </div>
      </div>

      {stats && (
        <>
          <section className="meta-section">
            <h3 className="meta-section__title">Most Picked Fighters</h3>
            {stats.topChars.map(({ char, count }) => {
              const img = char.forms[0]?.image
              return (
                <div key={char.id} className="meta-char-bar">
                  <div className="meta-char-bar__info">
                    {img ? <img className="meta-char-bar__img" src={img} alt="" /> : (
                      <div className="meta-char-bar__ph" style={{ background: char.color }}>{char.name[0]}</div>
                    )}
                    <span className="meta-char-bar__name">{char.name}</span>
                  </div>
                  <div className="meta-bar__track">
                    <div className="meta-bar__fill" style={{ width: Math.round((count / stats.maxCharCount) * 100) + '%', background: '#ff8c00' }} />
                  </div>
                  <span className="meta-bar__val">{count}x</span>
                </div>
              )
            })}
          </section>

          <section className="meta-section">
            <h3 className="meta-section__title">Favourite Synergies</h3>
            {stats.topTags.map(([tag, count]) => (
              <Bar key={tag} label={tag} value={count} max={stats.maxTagCount} color="#3a8dff" />
            ))}
          </section>
        </>
      )}

      {!stats && (
        <p className="meta-empty">Save some teams to see your meta stats here.</p>
      )}

      <section className="meta-section">
        <h3 className="meta-section__title">
          Badges ({unlockedCount}/{totalBadges})
        </h3>
        <div className="meta-badge-grid">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id)
            return (
              <div
                key={a.id}
                className={'meta-badge' + (unlocked ? ' meta-badge--unlocked' : '') + ' meta-badge--' + a.tier}
                title={a.desc}
              >
                <span className="meta-badge__icon">{unlocked ? a.icon : '🔒'}</span>
                <span className="meta-badge__name">{a.name}</span>
                <span className="meta-badge__tier">{a.tier}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

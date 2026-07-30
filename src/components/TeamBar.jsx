import { useMemo } from 'react'
import { charactersById } from '../data/characters.js'
import { getForm, teamDpTotal, DP_LIMIT, MAX_TEAM } from '../utils/dp.js'

function Portrait({ item, index, onRemove }) {
  const character = charactersById[item.characterId]
  const form = getForm(item)
  if (!character || !form) return null

  const initials = character.name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="portrait">
      <div className="portrait__ring" style={{ background: character.color }}>
        {form.image ? (
          <img src={form.image} alt={character.name} />
        ) : (
          <span className="portrait__initials">{initials}</span>
        )}
        <button
          className="portrait__remove"
          onClick={() => onRemove(index)}
          type="button"
          aria-label={`Remove ${character.name}`}
        >
          ✕
        </button>
        <span className="portrait__dp">{form.dp}</span>
      </div>
      <div className="portrait__name">{character.name}</div>
      <div className="portrait__form">{form.form}</div>
    </div>
  )
}

export default function TeamBar({ team, onRemove }) {
  const used = teamDpTotal(team)
  const over = used > DP_LIMIT
  const pct = Math.min(100, (used / DP_LIMIT) * 100)
  const emptySlots = Math.max(0, MAX_TEAM - team.length)

  const synergies = useMemo(() => {
    if (team.length < 2) return []
    const tagCounts = {}
    team.forEach((item) => {
      const form = getForm(item)
      if (!form) return
      const tags = form.tags || []
      tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1 })
    })
    return Object.entries(tagCounts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  }, [team])

  return (
    <div className="teambar">
      <div className="teambar__stats">
        <div className="stat">
          <span className="stat__icon stat__icon--size">👥</span>
          <div>
            <div className="stat__label">Team Size</div>
            <div className="stat__value">
              {team.length}/{MAX_TEAM}
            </div>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon stat__icon--dp">⚡</span>
          <div>
            <div className="stat__label">Destruction Points</div>
            <div className={over ? 'stat__value over' : 'stat__value'}>
              {used}/{DP_LIMIT}
            </div>
          </div>
        </div>
      </div>

      <div className="teambar__progress">
        <div className={over ? 'teambar__fill over' : 'teambar__fill'} style={{ width: `${pct}%` }} />
      </div>

      <div className="teambar__roster">
        {team.map((item, i) => (
          <Portrait key={`${item.characterId}-${item.formName}-${i}`} item={item} index={i} onRemove={onRemove} />
        ))}
        {team.length === 0 && <p className="teambar__hint">Tap fighters below to build your squad →</p>}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="portrait portrait--empty">
            <div className="portrait__ring portrait__ring--empty">+</div>
          </div>
        ))}
      </div>

      {synergies.length > 0 && (
        <div className="synergy">
          <span className="synergy__label">Synergy</span>
          {synergies.map(({ tag, count }) => (
            <span key={tag} className={`synergy__tag ${count >= 3 ? 'synergy__tag--strong' : ''}`}>
              {tag} <span className="synergy__count">x{count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

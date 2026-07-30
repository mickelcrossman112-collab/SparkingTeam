import { useMemo, useRef, useState } from 'react'
import { charactersById } from '../data/characters.js'
import { getForm, teamDpTotal, DP_LIMIT, MAX_TEAM } from '../utils/dp.js'

const SYNERGY_COLORS = [
  { bg: 'rgba(255,158,44,0.18)', border: '#ff9e2c', text: '#ffb64d', glow: 'rgba(255,158,44,0.4)' },
  { bg: 'rgba(58,141,255,0.18)', border: '#3a8dff', text: '#6ab0ff', glow: 'rgba(58,141,255,0.4)' },
  { bg: 'rgba(168,85,247,0.18)', border: '#a855f7', text: '#c084fc', glow: 'rgba(168,85,247,0.4)' },
  { bg: 'rgba(34,197,94,0.18)', border: '#22c55e', text: '#4ade80', glow: 'rgba(34,197,94,0.4)' },
  { bg: 'rgba(236,72,153,0.18)', border: '#ec4899', text: '#f472b6', glow: 'rgba(236,72,153,0.4)' },
  { bg: 'rgba(251,191,36,0.18)', border: '#fbbf24', text: '#fcd34d', glow: 'rgba(251,191,36,0.4)' },
  { bg: 'rgba(20,184,166,0.18)', border: '#14b8a6', text: '#2dd4bf', glow: 'rgba(20,184,166,0.4)' },
  { bg: 'rgba(239,68,68,0.18)', border: '#ef4444', text: '#f87171', glow: 'rgba(239,68,68,0.4)' },
]

function Portrait({ item, index, onRemove, onDragStart, onDragOver, onDrop, dragging, dragOver }) {
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

  const cls = 'portrait'
    + (dragging ? ' portrait--dragging' : '')
    + (dragOver ? ' portrait--drag-over' : '')

  return (
    <div
      className={cls}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={(e) => { e.currentTarget.classList.remove('portrait--dragging') }}
    >
      <div className="portrait__ring" style={{ background: character.color }}>
        {form.image ? (
          <img src={form.image} alt={character.name} draggable={false} />
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

function SynergyBar({ synergies }) {
  if (synergies.length === 0) return null

  const maxCount = Math.max(...synergies.map((s) => s.count))

  return (
    <div className="syn">
      <div className="syn__header">
        <span className="syn__icon">⚔️</span>
        <span className="syn__title">Team Synergy</span>
        <span className="syn__count">{synergies.length} active</span>
      </div>
      <div className="syn__grid">
        {synergies.map(({ tag, count }, i) => {
          const c = SYNERGY_COLORS[i % SYNERGY_COLORS.length]
          const strength = count >= 4 ? 'max' : count >= 3 ? 'strong' : 'active'
          const barPct = (count / maxCount) * 100
          return (
            <div
              key={tag}
              className={`syn__pill syn__pill--${strength}`}
              style={{
                background: c.bg,
                borderColor: c.border,
                boxShadow: count >= 3 ? `0 0 12px ${c.glow}` : 'none',
              }}
            >
              <div className="syn__pill-top">
                <span className="syn__tag" style={{ color: c.text }}>{tag}</span>
                <span className="syn__multiplier" style={{ color: c.text }}>
                  ×{count}
                </span>
              </div>
              <div className="syn__bar-track">
                <div
                  className="syn__bar-fill"
                  style={{ width: `${barPct}%`, background: c.border }}
                />
              </div>
              {count >= 3 && <div className="syn__spark" style={{ color: c.text }}>★</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TeamBar({ team, onRemove, onReorder }) {
  const used = teamDpTotal(team)
  const over = used > DP_LIMIT
  const pct = Math.min(100, (used / DP_LIMIT) * 100)
  const emptySlots = Math.max(0, MAX_TEAM - team.length)

  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIndex(index)
  }

  const handleDrop = (e, toIndex) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== toIndex) {
      onReorder(dragIndex, toIndex)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

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

      <div className="teambar__roster" onDragOver={(e) => e.preventDefault()}>
        {team.map((item, i) => (
          <Portrait
            key={`${item.characterId}-${item.formName}-${i}`}
            item={item}
            index={i}
            onRemove={onRemove}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            dragging={dragIndex === i}
            dragOver={overIndex === i && dragIndex !== i}
          />
        ))}
        {team.length === 0 && <p className="teambar__hint">Tap fighters below to build your squad →</p>}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="portrait portrait--empty">
            <div className="portrait__ring portrait__ring--empty">+</div>
          </div>
        ))}
      </div>

      <SynergyBar synergies={synergies} />
    </div>
  )
}

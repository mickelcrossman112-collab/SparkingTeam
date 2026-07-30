import { useState } from 'react'
import { charactersById } from '../data/characters.js'
import { getForm, teamDpTotal, MAX_TEAM } from '../utils/dp.js'
import { buildShareUrl } from '../utils/share.js'

function TeamPortrait({ item }) {
  const character = charactersById[item.characterId]
  const form = getForm(item)
  if (!character || !form) return null

  return (
    <div className="st-portrait">
      <div className="st-portrait__ring">
        {form.image ? (
          <img src={form.image} alt={character.name} />
        ) : (
          <span className="st-portrait__initials">
            {character.name.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
          </span>
        )}
        <span className="st-portrait__dp">{form.dp}</span>
      </div>
      <div className="st-portrait__name">{character.name}</div>
      <div className="st-portrait__form">{form.form}</div>
    </div>
  )
}

function TeamCard({ saved, onLoad, onDelete, onUpdateNotes }) {
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(saved.notes || '')
  const dp = teamDpTotal(saved.team)

  const handleShare = async () => {
    const url = buildShareUrl(saved.team)
    try {
      await navigator.clipboard.writeText(url)
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveNotes = () => {
    if (onUpdateNotes) onUpdateNotes(saved.id, draft.trim())
    setEditing(false)
  }

  return (
    <div className="st-card">
      <div className="st-card__header">
        <h3 className="st-card__name">{saved.name}</h3>
        <div className="st-card__stats">
          <span className="st-card__stat">👥 {saved.team.length}/{MAX_TEAM}</span>
          <span className="st-card__stat">⚡ {dp} DP</span>
        </div>
      </div>

      <div className="st-card__roster">
        {saved.team.map((item, i) => (
          <TeamPortrait key={`${item.characterId}-${item.formName}-${i}`} item={item} />
        ))}
      </div>

      {(saved.notes || editing) && (
        <div className="st-card__notes">
          {editing ? (
            <div className="st-notes-edit">
              <textarea
                className="st-notes-edit__input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder="Strategy notes…"
              />
              <div className="st-notes-edit__btns">
                <button className="st-btn st-btn--small" onClick={() => setEditing(false)} type="button">Cancel</button>
                <button className="st-btn st-btn--small st-btn--primary" onClick={saveNotes} type="button">Save</button>
              </div>
            </div>
          ) : (
            <button className="st-card__notes-text" onClick={() => { setDraft(saved.notes || ''); setEditing(true) }} type="button">
              📝 {saved.notes}
            </button>
          )}
        </div>
      )}

      <div className="st-card__actions">
        <button className="st-btn st-btn--danger" onClick={() => onDelete(saved.id)} type="button">
          🗑 Delete
        </button>
        <div className="st-card__actions-right">
          {!saved.notes && !editing && (
            <button className="st-btn st-btn--secondary" onClick={() => { setDraft(''); setEditing(true) }} type="button">
              📝 Notes
            </button>
          )}
          <button className="st-btn st-btn--secondary" onClick={handleShare} type="button">
            {copied ? '✓ Copied!' : '📋 Share'}
          </button>
          <button className="st-btn st-btn--primary" onClick={() => onLoad(saved.team, saved.name, saved.notes)} type="button">
            👁 View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SavedTeams({ teams, onLoad, onDelete, onUpdateNotes, fullPage }) {
  if (!fullPage) {
    if (teams.length === 0) return null
    return (
      <section className="saved">
        <h2 className="saved__title">My Teams</h2>
        <p className="saved__subtitle">{teams.length} saved team{teams.length !== 1 ? 's' : ''}</p>
        <div className="st-list">
          {teams.map((saved) => (
            <TeamCard key={saved.id} saved={saved} onLoad={onLoad} onDelete={onDelete} onUpdateNotes={onUpdateNotes} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="st-page">
      <p className="st-page__subtitle">Manage your saved Sparking! ZERO team compositions</p>
      <p className="st-page__count">📁 {teams.length} saved team{teams.length !== 1 ? 's' : ''}</p>

      {teams.length === 0 ? (
        <div className="st-empty">
          <p>No saved teams yet. Build a team and save it to see it here.</p>
        </div>
      ) : (
        <div className="st-list">
          {teams.map((saved) => (
            <TeamCard key={saved.id} saved={saved} onLoad={onLoad} onDelete={onDelete} onUpdateNotes={onUpdateNotes} />
          ))}
        </div>
      )}
    </section>
  )
}

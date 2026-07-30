import { useState, useMemo, useCallback } from 'react'
import { characters } from '../data/characters.js'
import { tierLists as defaultTierLists } from '../data/tierList.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import CharacterDetail from './CharacterDetail.jsx'

const ADMIN_KEY = 'sparking'
const charById = Object.fromEntries(characters.map((c) => [c.id, c]))
const TIER_NAMES = ['Z', 'S', 'A', 'B', 'D']
const TIER_COLORS = { Z: '#ff4444', S: '#ff9900', A: '#ffcc00', B: '#3a8dff', D: '#888888' }

function isAdmin() {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('admin') === ADMIN_KEY
  } catch { return false }
}

function TierCard({ char, admin, onDetail, onDragStart, onCardDragOver, onCardDrop, onVote, onPlace, votes, votingChar, setVotingChar, placingChar, setPlacingChar, dragOver, isUnranked }) {
  const form = char.forms[0]
  const charVotes = votes[char.id]
  const hasVotes = charVotes && Object.values(charVotes).some((v) => v > 0)
  const showPlacePicker = admin && placingChar === char.id

  return (
    <div
      className={'tier-card-wrap' + (dragOver ? ' tier-card-wrap--drag-over' : '')}
      onDragOver={admin ? (e) => onCardDragOver(e, char.id) : undefined}
      onDrop={admin ? (e) => onCardDrop(e, char.id) : undefined}
    >
      <button
        className={'tier-card' + (admin ? ' tier-card--draggable' : '') + (isUnranked ? ' tier-card--unranked' : '')}
        onClick={() => {
          if (admin && isUnranked) { setPlacingChar(placingChar === char.id ? null : char.id) }
          else if (admin) { onDetail(char) }
          else { onDetail(char) }
        }}
        type="button"
        draggable={admin}
        onDragStart={admin ? (e) => onDragStart(e, char.id) : undefined}
      >
        {form.image ? (
          <img className="tier-card-img" src={form.image} alt={char.name} />
        ) : (
          <div className="tier-card-placeholder" style={{ background: char.color }}>
            {char.name[0]}
          </div>
        )}
        <span className="tier-card-name">{char.name}</span>
        {isUnranked && admin && <span className="tier-card-add">+ Add</span>}
        {hasVotes && admin && !isUnranked && (
          <span className="tier-card-votes" title="Community votes">
            {Object.entries(charVotes).filter(([, v]) => v > 0).map(([tier, v]) => tier + ':' + v).join(' ')}
          </span>
        )}
      </button>
      {showPlacePicker && (
        <div className="tier-vote-popup">
          <span className="tier-vote-popup__label">Add to:</span>
          {TIER_NAMES.map((t) => (
            <button
              key={t}
              className="tier-vote-popup__btn"
              style={{ background: TIER_COLORS[t] }}
              onClick={() => { onPlace(char.id, t); setPlacingChar(null) }}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      )}
      {!admin && (
        <button
          className="tier-vote-btn"
          onClick={(e) => { e.stopPropagation(); setVotingChar(votingChar === char.id ? null : char.id) }}
          type="button"
          title="Vote to move"
        >
          ▲
        </button>
      )}
      {!admin && votingChar === char.id && (
        <div className="tier-vote-popup">
          <span className="tier-vote-popup__label">Move to:</span>
          {TIER_NAMES.map((t) => (
            <button
              key={t}
              className="tier-vote-popup__btn"
              style={{ background: TIER_COLORS[t] }}
              onClick={() => { onVote(char.id, t); setVotingChar(null) }}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CharacterRankings() {
  const admin = isAdmin()
  const [activeList, setActiveList] = useState(0)
  const [selectedChar, setSelectedChar] = useState(null)
  const [customTiers, setCustomTiers] = useLocalStorage('szTierEdits', {})
  const [votes, setVotes] = useLocalStorage('szTierVotes', {})
  const [dragCharId, setDragCharId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)
  const [votingChar, setVotingChar] = useState(null)
  const [placingChar, setPlacingChar] = useState(null)
  const [copied, setCopied] = useState(false)

  const listKey = defaultTierLists[activeList]?.name || ''

  const currentTiers = useMemo(() => {
    const base = defaultTierLists[activeList]
    if (!base) return []
    const edits = customTiers[listKey]
    if (!edits) return base.tiers

    const merged = base.tiers.map((t) => ({
      ...t,
      characters: edits[t.tier] || t.characters,
    }))
    return merged
  }, [activeList, customTiers, listKey])

  const unranked = useMemo(() => {
    const placed = new Set()
    for (const t of currentTiers) {
      for (const id of t.characters) placed.add(id)
    }
    return characters.filter((c) => !placed.has(c.id))
  }, [currentTiers])

  const saveTiers = useCallback((newTiers) => {
    const editsForList = {}
    newTiers.forEach((t) => { editsForList[t.tier] = t.characters })
    setCustomTiers((prev) => ({ ...prev, [listKey]: editsForList }))
  }, [listKey, setCustomTiers])

  const resetTiers = () => {
    setCustomTiers((prev) => {
      const next = { ...prev }
      delete next[listKey]
      return next
    })
  }

  const handleDragStart = (e, charId) => {
    setDragCharId(charId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDragCharId(null)
    setDropTargetId(null)
  }

  const handleTierDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTargetId(null)
  }

  const handleCardDragOver = (e, targetCharId) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    if (targetCharId !== dragCharId) setDropTargetId(targetCharId)
  }

  const handleCardDrop = (e, targetCharId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dragCharId || dragCharId === targetCharId) { handleDragEnd(); return }

    let targetTier = null
    for (const t of currentTiers) {
      if (t.characters.includes(targetCharId)) { targetTier = t.tier; break }
    }
    if (!targetTier) { handleDragEnd(); return }

    const newTiers = currentTiers.map((t) => ({
      ...t,
      characters: t.characters.filter((id) => id !== dragCharId),
    }))

    const target = newTiers.find((t) => t.tier === targetTier)
    if (target) {
      const idx = target.characters.indexOf(targetCharId)
      target.characters.splice(idx, 0, dragCharId)
    }

    saveTiers(newTiers)
    handleDragEnd()
  }

  const handleTierDrop = (e, targetTier) => {
    e.preventDefault()
    if (!dragCharId) return

    const newTiers = currentTiers.map((t) => ({
      ...t,
      characters: t.characters.filter((id) => id !== dragCharId),
    }))

    const target = newTiers.find((t) => t.tier === targetTier)
    if (target) target.characters.push(dragCharId)

    saveTiers(newTiers)
    handleDragEnd()
  }

  const handlePlace = (charId, toTier) => {
    const newTiers = currentTiers.map((t) => ({
      ...t,
      characters: t.characters.filter((id) => id !== charId),
    }))
    const target = newTiers.find((t) => t.tier === toTier)
    if (target) target.characters.push(charId)
    saveTiers(newTiers)
  }

  const handleVote = (charId, toTier) => {
    setVotes((prev) => {
      const charVotes = { ...(prev[charId] || {}) }
      charVotes[toTier] = (charVotes[toTier] || 0) + 1
      return { ...prev, [charId]: charVotes }
    })
  }

  const exportVotes = async () => {
    const lines = []
    for (const [charId, tierVotes] of Object.entries(votes)) {
      const char = charById[charId]
      if (!char) continue
      const parts = Object.entries(tierVotes)
        .filter(([, v]) => v > 0)
        .map(([tier, count]) => tier + ' (' + count + ')')
      if (parts.length > 0) {
        lines.push(char.name + ' -> ' + parts.join(', '))
      }
    }
    if (lines.length === 0) {
      alert('No votes yet.')
      return
    }
    const text = 'Tier List Votes:\n' + lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearVotes = () => setVotes({})

  const totalVotes = Object.values(votes).reduce((sum, v) =>
    sum + Object.values(v).reduce((s, c) => s + c, 0), 0
  )

  return (
    <div className="rankings-page">
      <div className="rankings-toolbar">
        {defaultTierLists.length > 1 && (
          <div className="rankings-cats">
            {defaultTierLists.map((tl, i) => (
              <button
                key={tl.name}
                className={'rankings-cat-btn ' + (i === activeList ? 'rankings-cat-btn--active' : '')}
                onClick={() => setActiveList(i)}
                type="button"
              >
                {tl.name}
              </button>
            ))}
          </div>
        )}

        {admin && (
          <div className="rankings-admin-bar">
            <span className="rankings-admin-badge">ADMIN</span>
            <button className="rankings-admin-btn" onClick={resetTiers} type="button">
              Reset to Default
            </button>
            {totalVotes > 0 && (
              <>
                <button className="rankings-admin-btn" onClick={exportVotes} type="button">
                  {copied ? 'Copied!' : 'Export Votes (' + totalVotes + ')'}
                </button>
                <button className="rankings-admin-btn rankings-admin-btn--danger" onClick={clearVotes} type="button">
                  Clear Votes
                </button>
              </>
            )}
          </div>
        )}

        {!admin && (
          <p className="rankings-vote-hint">Click ▲ on a character to vote for a tier change</p>
        )}
      </div>

      <div className="rankings-display">
        {currentTiers.map((t) => (
          <div
            key={t.tier}
            className={'tier-row' + (admin && dragCharId ? ' tier-row--drop-target' : '')}
            onDragOver={admin ? handleTierDragOver : undefined}
            onDrop={admin ? (e) => handleTierDrop(e, t.tier) : undefined}
          >
            <div className="tier-label" style={{ background: t.color }}>
              <span className="tier-letter">{t.tier}</span>
            </div>
            <div className="tier-chars">
              {t.characters.map((id) => {
                const char = charById[id]
                if (!char) return null
                return (
                  <TierCard
                    key={char.id}
                    char={char}
                    admin={admin}
                    onDetail={setSelectedChar}
                    onDragStart={handleDragStart}
                    onCardDragOver={handleCardDragOver}
                    onCardDrop={handleCardDrop}
                    onVote={handleVote}
                    onPlace={handlePlace}
                    votes={votes}
                    votingChar={votingChar}
                    setVotingChar={setVotingChar}
                    placingChar={placingChar}
                    setPlacingChar={setPlacingChar}
                    dragOver={dropTargetId === char.id}
                    isUnranked={false}
                  />
                )
              })}
              {t.characters.length === 0 && <span className="tier-empty">Drop here</span>}
            </div>
          </div>
        ))}
      </div>

      {admin && unranked.length > 0 && (
        <div className="tier-unranked">
          <h3 className="tier-unranked__title">Unranked ({unranked.length})</h3>
          <p className="tier-unranked__hint">Click a character to pick a tier, or drag into a tier above</p>
          <div className="tier-unranked__grid">
            {unranked.map((char) => (
              <TierCard
                key={char.id}
                char={char}
                admin={admin}
                onDetail={setSelectedChar}
                onDragStart={handleDragStart}
                onCardDragOver={handleCardDragOver}
                onCardDrop={handleCardDrop}
                onVote={handleVote}
                onPlace={handlePlace}
                votes={votes}
                votingChar={votingChar}
                setVotingChar={setVotingChar}
                placingChar={placingChar}
                setPlacingChar={setPlacingChar}
                dragOver={dropTargetId === char.id}
                isUnranked={true}
              />
            ))}
          </div>
        </div>
      )}

      {selectedChar && (
        <CharacterDetail character={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </div>
  )
}

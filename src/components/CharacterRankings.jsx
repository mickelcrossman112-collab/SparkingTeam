import { useState, useMemo, useCallback } from 'react'
import { characters } from '../data/characters.js'
import { tierLists as defaultTierLists } from '../data/tierList.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import CharacterDetail from './CharacterDetail.jsx'

const charById = Object.fromEntries(characters.map((c) => [c.id, c]))
const TIER_NAMES = ['Z', 'S', 'A', 'B', 'D']
const TIER_COLORS = { Z: '#ff4444', S: '#ff9900', A: '#ffcc00', B: '#3a8dff', D: '#888888' }

function TierCard({ char, onDetail, onDragStart, onCardDragOver, onCardDrop, onPlace, onRemove, placingChar, setPlacingChar, dragOver, isUnranked }) {
  const form = char.forms[0]
  const showPlacePicker = placingChar === char.id

  return (
    <div
      className={'tier-card-wrap' + (dragOver ? ' tier-card-wrap--drag-over' : '')}
      onDragOver={(e) => onCardDragOver(e, char.id)}
      onDrop={(e) => onCardDrop(e, char.id)}
    >
      <button
        className={'tier-card tier-card--draggable' + (isUnranked ? ' tier-card--unranked' : '')}
        onClick={() => {
          if (isUnranked) setPlacingChar(placingChar === char.id ? null : char.id)
          else onDetail(char)
        }}
        type="button"
        draggable
        onDragStart={(e) => onDragStart(e, char.id)}
      >
        {form.image ? (
          <img className="tier-card-img" src={form.image} alt={char.name} />
        ) : (
          <div className="tier-card-placeholder" style={{ background: char.color }}>
            {char.name[0]}
          </div>
        )}
        <span className="tier-card-name">{char.name}</span>
        {isUnranked && <span className="tier-card-add">+ Add</span>}
      </button>
      {!isUnranked && (
        <button
          className="tier-remove-btn"
          onClick={(e) => { e.stopPropagation(); onRemove(char.id) }}
          type="button"
          title="Remove from tier"
        >
          &times;
        </button>
      )}
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
    </div>
  )
}

export default function CharacterRankings() {
  const singlesIdx = defaultTierLists.findIndex(tl => tl.name === 'Singles')
  const [activeList, setActiveList] = useState(singlesIdx >= 0 ? singlesIdx : 0)
  const [selectedChar, setSelectedChar] = useState(null)
  const [customTiers, setCustomTiers] = useLocalStorage('szTierEdits', {})
  const [dragCharId, setDragCharId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)
  const [placingChar, setPlacingChar] = useState(null)
  const [search, setSearch] = useState('')

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

  const filteredUnranked = useMemo(() => {
    if (!search) return unranked
    const q = search.toLowerCase()
    return unranked.filter((c) => c.name.toLowerCase().includes(q))
  }, [unranked, search])

  const isEdited = !!customTiers[listKey]

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

  const handleRemove = (charId) => {
    const newTiers = currentTiers.map((t) => ({
      ...t,
      characters: t.characters.filter((id) => id !== charId),
    }))
    saveTiers(newTiers)
  }

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

        <div className="rankings-actions">
          {isEdited && (
            <button className="rankings-action-btn rankings-action-btn--reset" onClick={resetTiers} type="button">
              Reset to Default
            </button>
          )}
          <span className="rankings-hint">Drag to reorder &middot; Click unranked to add</span>
        </div>
      </div>

      <div className="rankings-display" onDragEnd={handleDragEnd}>
        {currentTiers.map((t) => (
          <div
            key={t.tier}
            className={'tier-row' + (dragCharId ? ' tier-row--drop-target' : '')}
            onDragOver={handleTierDragOver}
            onDrop={(e) => handleTierDrop(e, t.tier)}
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
                    onDetail={setSelectedChar}
                    onDragStart={handleDragStart}
                    onCardDragOver={handleCardDragOver}
                    onCardDrop={handleCardDrop}
                    onPlace={handlePlace}
                    onRemove={handleRemove}
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

      <div className="tier-unranked">
        <div className="tier-unranked__header">
          <h3 className="tier-unranked__title">Unranked ({unranked.length})</h3>
          {unranked.length > 8 && (
            <input
              className="tier-unranked__search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>
        {unranked.length === 0 ? (
          <p className="tier-unranked__hint">All characters are ranked!</p>
        ) : (
          <>
            <p className="tier-unranked__hint">Click a character to pick a tier, or drag into a row above</p>
            <div className="tier-unranked__grid">
              {filteredUnranked.map((char) => (
                <TierCard
                  key={char.id}
                  char={char}
                  onDetail={setSelectedChar}
                  onDragStart={handleDragStart}
                  onCardDragOver={handleCardDragOver}
                  onCardDrop={handleCardDrop}
                  onPlace={handlePlace}
                  onRemove={handleRemove}
                  placingChar={placingChar}
                  setPlacingChar={setPlacingChar}
                  dragOver={dropTargetId === char.id}
                  isUnranked={true}
                />
              ))}
              {filteredUnranked.length === 0 && search && (
                <span className="tier-unranked__hint">No matches for "{search}"</span>
              )}
            </div>
          </>
        )}
      </div>

      {selectedChar && (
        <CharacterDetail character={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </div>
  )
}

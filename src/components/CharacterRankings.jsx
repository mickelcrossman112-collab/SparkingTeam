import { useState } from 'react'
import { characters } from '../data/characters.js'
import { tierLists } from '../data/tierList.js'
import CharacterDetail from './CharacterDetail.jsx'

const charById = Object.fromEntries(characters.map((c) => [c.id, c]))

export default function CharacterRankings() {
  const [activeList, setActiveList] = useState(0)
  const [selectedChar, setSelectedChar] = useState(null)

  const current = tierLists[activeList]

  return (
    <div className="rankings-page">
      {tierLists.length > 1 && (
        <div className="rankings-cats">
          {tierLists.map((tl, i) => (
            <button
              key={tl.name}
              className={`rankings-cat-btn ${i === activeList ? 'rankings-cat-btn--active' : ''}`}
              onClick={() => setActiveList(i)}
              type="button"
            >
              {tl.name}
            </button>
          ))}
        </div>
      )}

      <div className="rankings-display">
        {current.tiers.map((t) => (
          <div key={t.tier} className="tier-row">
            <div className="tier-label" style={{ background: t.color }}>
              <span className="tier-letter">{t.tier}</span>
            </div>
            <div className="tier-chars">
              {t.characters.map((id) => {
                const char = charById[id]
                if (!char) return null
                const form = char.forms[0]
                return (
                  <button
                    key={char.id}
                    className="tier-card"
                    onClick={() => setSelectedChar(char)}
                    type="button"
                  >
                    {form.image ? (
                      <img className="tier-card-img" src={form.image} alt={char.name} />
                    ) : (
                      <div className="tier-card-placeholder" style={{ background: char.color }}>
                        {char.name[0]}
                      </div>
                    )}
                    <span className="tier-card-name">{char.name}</span>
                  </button>
                )
              })}
              {t.characters.length === 0 && <span className="tier-empty">—</span>}
            </div>
          </div>
        ))}
      </div>

      {selectedChar && (
        <CharacterDetail character={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </div>
  )
}

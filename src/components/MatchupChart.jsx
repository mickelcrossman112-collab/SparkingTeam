import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getForm } from '../utils/dp.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { tierLists } from '../data/tierList.js'
import CharacterDetail from './CharacterDetail.jsx'

const MU = [
  { label: '--', color: '#cc2222', title: 'Hard loss' },
  { label: '-', color: '#cc6633', title: 'Slight loss' },
  { label: '=', color: '#555555', title: 'Even' },
  { label: '+', color: '#2d8a4e', title: 'Slight win' },
  { label: '++', color: '#22aa44', title: 'Hard win' },
]

function getOpponents(listIndex) {
  const tl = tierLists[listIndex]
  if (!tl) return []
  const ids = []
  tl.tiers.forEach((t) => {
    if (t.tier === 'Z' || t.tier === 'S') {
      t.characters.forEach((id) => {
        if (!ids.includes(id)) ids.push(id)
      })
    }
  })
  return ids.map((id) => charactersById[id]).filter(Boolean)
}

export default function MatchupChart({ team }) {
  const [matchups, setMatchups] = useLocalStorage('szMatchups', {})
  const [listIndex, setListIndex] = useState(0)
  const [selectedChar, setSelectedChar] = useState(null)

  const opponents = useMemo(() => getOpponents(listIndex), [listIndex])

  const cycle = (myId, oppId) => {
    const key = `${myId}:${oppId}`
    setMatchups((prev) => ({ ...prev, [key]: ((prev[key] ?? 2) + 1) % 5 }))
  }

  const val = (myId, oppId) => matchups[`${myId}:${oppId}`] ?? 2

  const teamRows = team
    .map((item) => {
      const char = charactersById[item.characterId]
      const form = getForm(item)
      return char && form ? { char, form, item } : null
    })
    .filter(Boolean)

  const coverage = useMemo(() => {
    if (teamRows.length === 0 || opponents.length === 0) return null
    let wins = 0
    let losses = 0
    let evens = 0
    opponents.forEach((opp) => {
      const best = Math.max(...teamRows.map((r) => val(r.item.characterId, opp.id)))
      if (best >= 3) wins++
      else if (best <= 1) losses++
      else evens++
    })
    return { wins, losses, evens, total: opponents.length }
  }, [teamRows, opponents, matchups])

  return (
    <div className="matchup-page">
      <div className="matchup-header">
        <div className="matchup-list-switch">
          {tierLists.map((tl, i) => (
            <button
              key={tl.name}
              type="button"
              className={i === listIndex ? 'rankings-cat-btn rankings-cat-btn--active' : 'rankings-cat-btn'}
              onClick={() => setListIndex(i)}
            >
              {tl.name}
            </button>
          ))}
        </div>
        <p className="matchup-hint">Click cells to cycle: Hard Loss → Loss → Even → Win → Hard Win</p>
      </div>

      {teamRows.length === 0 ? (
        <p className="matchup-empty">Add fighters to your team to chart matchups against the meta.</p>
      ) : (
        <>
          {coverage && (
            <div className="matchup-coverage">
              <span className="coverage-item coverage-item--win">Covered {coverage.wins}</span>
              <span className="coverage-item coverage-item--even">Even {coverage.evens}</span>
              <span className="coverage-item coverage-item--loss">Uncovered {coverage.losses}</span>
              <span className="coverage-item coverage-item--total">/ {coverage.total} threats</span>
            </div>
          )}

          <div className="matchup-grid-wrap">
            <table className="matchup-table">
              <thead>
                <tr>
                  <th className="matchup-corner">Your Team ↓ vs →</th>
                  {opponents.map((opp) => (
                    <th key={opp.id} className="matchup-col-header" onClick={() => setSelectedChar(opp)}>
                      <img src={opp.forms[0]?.image} alt="" className="matchup-thumb" />
                      <span>{opp.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamRows.map((r) => (
                  <tr key={`${r.item.characterId}-${r.item.formName}`}>
                    <td className="matchup-row-header" onClick={() => setSelectedChar(r.char)}>
                      <img src={r.form.image} alt="" className="matchup-thumb" />
                      <span>{r.char.name}</span>
                      <span className="matchup-form-label">{r.form.form}</span>
                    </td>
                    {opponents.map((opp) => {
                      const v = val(r.item.characterId, opp.id)
                      const mu = MU[v]
                      return (
                        <td
                          key={opp.id}
                          className="matchup-cell"
                          style={{ background: mu.color }}
                          title={`${r.char.name} vs ${opp.name}: ${mu.title}`}
                          onClick={() => cycle(r.item.characterId, opp.id)}
                        >
                          {mu.label}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedChar && (
        <CharacterDetail character={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </div>
  )
}

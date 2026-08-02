import { useState, useMemo } from 'react'
import { characters } from '../data/characters.js'
import { combatData } from '../data/combatData.js'

function getAllUltimates() {
  const ults = []
  for (const char of characters) {
    for (const form of char.forms) {
      const combat = combatData[char.name]?.[form.form]
      if (!combat?.ultimate) continue
      const u = combat.ultimate
      if (!u.name || u.damage === 0) continue
      ults.push({
        charId: char.id,
        charName: char.name,
        formName: form.form,
        dp: form.dp,
        image: form.image,
        color: char.color,
        name: u.name,
        damage: u.damage || 0,
        boostedDmg: u.boostedDmg || Math.round((u.damage || 0) * 1.3),
        type: u.type || 'Unknown',
        blockable: u.blockable !== false,
        unblockable: u.unblockable === true,
        affectsGiants: u.affectsGiants !== false,
        selfDestruct: u.selfDestruct === true,
        movable: u.movable === true,
      })
    }
  }
  return ults
}

const TYPE_CATEGORIES = {
  'Beam': t => t.toLowerCase().includes('beam'),
  'Dash': t => t.toLowerCase().includes('dash'),
  'Death Ball': t => t.toLowerCase().includes('death ball'),
  'Explosive Wave': t => t.toLowerCase().includes('explosive wave') && !t.toLowerCase().includes('death'),
  'Grab': t => t.toLowerCase().includes('grab'),
  'Ki Blast': t => t.toLowerCase().includes('ki blast') || t.toLowerCase().includes('ki saw'),
  'Other': () => true,
}

function getTypeCategory(type) {
  for (const [cat, test] of Object.entries(TYPE_CATEGORIES)) {
    if (test(type)) return cat
  }
  return 'Other'
}

export default function UltimateDatabase() {
  const [sort, setSort] = useState('damage-desc')
  const [typeFilter, setTypeFilter] = useState('')
  const [propFilter, setPropFilter] = useState('')
  const [search, setSearch] = useState('')

  const allUlts = useMemo(getAllUltimates, [])

  const filtered = useMemo(() => {
    let list = allUlts

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(u => u.charName.toLowerCase().includes(q) || u.name.toLowerCase().includes(q))
    }

    if (typeFilter) {
      const test = TYPE_CATEGORIES[typeFilter]
      if (typeFilter === 'Other') {
        const otherTests = Object.entries(TYPE_CATEGORIES).filter(([k]) => k !== 'Other').map(([, t]) => t)
        list = list.filter(u => !otherTests.some(t => t(u.type)))
      } else if (test) {
        list = list.filter(u => test(u.type))
      }
    }

    if (propFilter === 'unblockable') list = list.filter(u => u.unblockable)
    if (propFilter === 'blockable') list = list.filter(u => u.blockable && !u.unblockable)
    if (propFilter === 'selfDestruct') list = list.filter(u => u.selfDestruct)
    if (propFilter === 'movable') list = list.filter(u => u.movable)
    if (propFilter === 'giants') list = list.filter(u => u.affectsGiants)

    const [key, dir] = sort.split('-')
    list = [...list].sort((a, b) => {
      let va, vb
      if (key === 'damage') { va = a.damage; vb = b.damage }
      else if (key === 'boosted') { va = a.boostedDmg; vb = b.boostedDmg }
      else if (key === 'name') { va = a.charName; vb = b.charName }
      else if (key === 'ultName') { va = a.name; vb = b.name }
      else { va = a.damage; vb = b.damage }
      if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return dir === 'asc' ? va - vb : vb - va
    })

    return list
  }, [allUlts, search, typeFilter, propFilter, sort])

  const typeCounts = useMemo(() => {
    const counts = {}
    for (const u of allUlts) {
      const cat = getTypeCategory(u.type)
      counts[cat] = (counts[cat] || 0) + 1
    }
    return counts
  }, [allUlts])

  const maxDmg = useMemo(() => Math.max(...allUlts.map(u => u.damage), 1), [allUlts])

  return (
    <div className="ultdb">
      <p className="ultdb-intro">
        Every ultimate attack in the game. {allUlts.length} ultimates across all characters and forms.
      </p>

      <div className="ultdb-controls">
        <input
          className="ultdb-search"
          type="text"
          placeholder="Search character or ultimate..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="ultdb-filters">
          <div className="ultdb-filter-group">
            <span className="ultdb-filter-label">Type</span>
            <div className="ultdb-filter-chips">
              <button
                className={'ultdb-chip' + (!typeFilter ? ' ultdb-chip--active' : '')}
                type="button"
                onClick={() => setTypeFilter('')}
              >All</button>
              {Object.keys(TYPE_CATEGORIES).map(cat => (
                <button
                  key={cat}
                  className={'ultdb-chip' + (typeFilter === cat ? ' ultdb-chip--active' : '')}
                  type="button"
                  onClick={() => setTypeFilter(typeFilter === cat ? '' : cat)}
                >
                  {cat} <span className="ultdb-chip__count">{typeCounts[cat] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ultdb-filter-group">
            <span className="ultdb-filter-label">Property</span>
            <div className="ultdb-filter-chips">
              <button
                className={'ultdb-chip' + (!propFilter ? ' ultdb-chip--active' : '')}
                type="button"
                onClick={() => setPropFilter('')}
              >All</button>
              {[
                ['unblockable', 'Unblockable'],
                ['blockable', 'Blockable'],
                ['selfDestruct', 'Self-Destruct'],
                ['movable', 'Movable'],
                ['giants', 'Hits Giants'],
              ].map(([val, label]) => (
                <button
                  key={val}
                  className={'ultdb-chip' + (propFilter === val ? ' ultdb-chip--active' : '')}
                  type="button"
                  onClick={() => setPropFilter(propFilter === val ? '' : val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ultdb-sort">
          <span className="ultdb-filter-label">Sort</span>
          <select className="ultdb-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="damage-desc">Damage (High → Low)</option>
            <option value="damage-asc">Damage (Low → High)</option>
            <option value="boosted-desc">Boosted Dmg (High → Low)</option>
            <option value="boosted-asc">Boosted Dmg (Low → High)</option>
            <option value="name-asc">Character (A → Z)</option>
            <option value="ultName-asc">Ultimate Name (A → Z)</option>
          </select>
        </div>
      </div>

      <div className="ultdb-count">{filtered.length} results</div>

      <div className="ultdb-list">
        {filtered.map((u, i) => (
          <div key={`${u.charId}-${u.formName}-${i}`} className="ultdb-card">
            <div className="ultdb-card__left">
              {u.image ? (
                <img className="ultdb-card__img" src={u.image} alt="" />
              ) : (
                <div className="ultdb-card__ph" style={{ background: u.color }}>{u.charName[0]}</div>
              )}
              <div className="ultdb-card__info">
                <div className="ultdb-card__char">{u.charName}</div>
                <div className="ultdb-card__form">{u.formName} · {u.dp} DP</div>
                <div className="ultdb-card__ult-name">{u.name}</div>
              </div>
            </div>

            <div className="ultdb-card__mid">
              <div className="ultdb-card__dmg-row">
                <div className="ultdb-card__dmg-bar-wrap">
                  <div
                    className="ultdb-card__dmg-bar"
                    style={{ width: `${(u.damage / maxDmg) * 100}%` }}
                  />
                </div>
                <span className="ultdb-card__dmg-val">{u.damage.toLocaleString()}</span>
              </div>
              {u.boostedDmg > u.damage && (
                <div className="ultdb-card__boosted">
                  Boosted: {u.boostedDmg.toLocaleString()}
                </div>
              )}
            </div>

            <div className="ultdb-card__right">
              <span className={'ultdb-tag ultdb-tag--type'}>{getTypeCategory(u.type)}</span>
              {u.unblockable && <span className="ultdb-tag ultdb-tag--unblockable">Unblockable</span>}
              {u.selfDestruct && <span className="ultdb-tag ultdb-tag--selfdestruct">Self-Destruct</span>}
              {u.movable && <span className="ultdb-tag ultdb-tag--movable">Movable</span>}
              {!u.affectsGiants && <span className="ultdb-tag ultdb-tag--nogiant">No Giants</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { characters } from '../data/characters.js'
import { combatData } from '../data/combatData.js'

const MOVE_TYPES = ['All', 'Skills', 'Supers', 'Ultimates', 'Rush']

// Flatten every form's move data into one searchable list.
function buildEntries() {
  const out = []
  for (const c of characters) {
    const charData = combatData[c.name]
    if (!charData) continue
    for (const f of c.forms) {
      const d = charData[f.form]
      if (!d) continue
      out.push({
        charId: c.id,
        charName: c.name,
        color: c.color,
        image: f.image,
        form: f.form,
        dp: f.dp,
        health: f.health,
        kiBars: f.kiBars,
        skillPoints: f.skillPoints,
        ...d,
      })
    }
  }
  return out
}

function moveNames(e) {
  return [e.skill1, e.skill2, e.super1?.name, e.super2?.name, e.ultimate?.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export default function MoveList() {
  const [search, setSearch] = useState('')
  const [moveType, setMoveType] = useState('All')
  const [sort, setSort] = useState('name')
  const [expanded, setExpanded] = useState(null)

  const entries = useMemo(buildEntries, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = entries.filter(e => {
      if (!q) return true
      return e.charName.toLowerCase().includes(q)
        || e.form.toLowerCase().includes(q)
        || moveNames(e).includes(q)
    })

    if (moveType === 'Skills') list = list.filter(e => e.skill1 || e.skill2)
    else if (moveType === 'Supers') list = list.filter(e => e.super1 || e.super2)
    else if (moveType === 'Ultimates') list = list.filter(e => e.ultimate)
    else if (moveType === 'Rush') list = list.filter(e => e.rush5)

    const sorted = [...list]
    if (sort === 'name') sorted.sort((a, b) => a.charName.localeCompare(b.charName) || a.dp - b.dp)
    else if (sort === 'melee') sorted.sort((a, b) => (b.meleeDmg || 0) - (a.meleeDmg || 0))
    else if (sort === 'rush') sorted.sort((a, b) => (b.rush5 || 0) - (a.rush5 || 0))
    else if (sort === 'super') sorted.sort((a, b) => (b.super2?.damage || b.super1?.damage || 0) - (a.super2?.damage || a.super1?.damage || 0))
    else if (sort === 'ult') sorted.sort((a, b) => (b.ultimate?.damage || 0) - (a.ultimate?.damage || 0))
    else if (sort === 'defense') sorted.sort((a, b) => (b.defense || 0) - (a.defense || 0))
    else if (sort === 'dp') sorted.sort((a, b) => b.dp - a.dp)
    return sorted
  }, [entries, search, moveType, sort])

  const key = (e) => e.charId + '::' + e.form

  return (
    <div className="movelist">
      <div className="movelist-head">
        <h2 className="movelist-head__title">Move List</h2>
        <p className="movelist-head__sub">
          Every fighter's skills, supers, ultimates and damage numbers. Search by character or move name.
        </p>
      </div>

      <div className="movelist-controls">
        <input
          className="movelist-search"
          type="text"
          placeholder="Search character or move (e.g. Kamehameha)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="movelist-chips">
          {MOVE_TYPES.map(t => (
            <button
              key={t}
              className={'movelist-chip' + (moveType === t ? ' movelist-chip--active' : '')}
              type="button"
              onClick={() => setMoveType(t)}
            >{t}</button>
          ))}
        </div>
        <select className="movelist-sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="dp">Sort: DP (high)</option>
          <option value="melee">Sort: Melee Damage</option>
          <option value="rush">Sort: Rush Combo</option>
          <option value="super">Sort: Best Super</option>
          <option value="ult">Sort: Ultimate</option>
          <option value="defense">Sort: Defense</option>
        </select>
      </div>

      <p className="movelist-count">{filtered.length} forms</p>

      <div className="movelist-grid">
        {filtered.map(e => {
          const k = key(e)
          const isOpen = expanded === k
          return (
            <div key={k} className={'movecard' + (isOpen ? ' movecard--open' : '')}>
              <button className="movecard__head" type="button" onClick={() => setExpanded(isOpen ? null : k)}>
                {e.image
                  ? <img className="movecard__img" src={e.image} alt="" />
                  : <div className="movecard__ph" style={{ background: e.color }}>{e.charName[0]}</div>}
                <div className="movecard__id">
                  <span className="movecard__name">{e.charName}</span>
                  <span className="movecard__form">{e.form}</span>
                </div>
                <span className="movecard__dp">{e.dp} DP</span>
                <span className="movecard__caret">{isOpen ? '▴' : '▾'}</span>
              </button>

              <div className="movecard__quick">
                {e.super2?.damage != null && <span className="movecard__quick-item">Super {e.super2.damage.toLocaleString()}</span>}
                {e.ultimate?.damage != null && <span className="movecard__quick-item movecard__quick-item--ult">Ult {e.ultimate.damage.toLocaleString()}</span>}
                {e.rush5 != null && <span className="movecard__quick-item">Rush {e.rush5.toLocaleString()}</span>}
              </div>

              {isOpen && (
                <div className="movecard__body">
                  <div className="movecard__stats">
                    {e.class && <Stat label="Class" value={e.class} />}
                    {e.defense != null && <Stat label="Defense" value={e.defense.toLocaleString()} />}
                    {e.health != null && <Stat label="Health" value={e.health.toLocaleString()} />}
                    {e.kiBars != null && <Stat label="Ki Bars" value={e.kiBars} />}
                    {e.skillPoints != null && <Stat label="Skill Pts" value={e.skillPoints} />}
                    {e.switchTime && <Stat label="Switch" value={e.switchTime} />}
                    {e.meleeDmg != null && <Stat label="Melee" value={e.meleeDmg.toLocaleString()} />}
                    {e.kiBlastDmg != null && <Stat label="Ki Blast" value={e.kiBlastDmg.toLocaleString()} />}
                    {e.kiBlastCost && <Stat label="Ki Cost" value={e.kiBlastCost} />}
                    {e.throwDmg != null && <Stat label="Throw" value={e.throwDmg.toLocaleString()} />}
                    {e.rush1 != null && <Stat label="Rush 1st" value={e.rush1.toLocaleString()} />}
                    {e.rush5 != null && <Stat label="Rush 5th" value={e.rush5.toLocaleString()} />}
                  </div>

                  {(e.skill1 || e.skill2) && (
                    <div className="movecard__section">
                      <h4 className="movecard__section-title">Skills</h4>
                      <div className="movecard__moves">
                        {e.skill1 && <Move name={e.skill1} tag="Skill 1" />}
                        {e.skill2 && <Move name={e.skill2} tag="Skill 2" />}
                      </div>
                    </div>
                  )}

                  {(e.super1 || e.super2) && (
                    <div className="movecard__section">
                      <h4 className="movecard__section-title">Super Attacks</h4>
                      <div className="movecard__moves">
                        {e.super1 && <Move name={e.super1.name} tag="Super 1" dmg={e.super1.damage} />}
                        {e.super2 && <Move name={e.super2.name} tag="Super 2" dmg={e.super2.damage} />}
                      </div>
                    </div>
                  )}

                  {e.ultimate && (
                    <div className="movecard__section">
                      <h4 className="movecard__section-title">Ultimate</h4>
                      <div className="movecard__moves">
                        <Move name={e.ultimate.name} tag="Ultimate" dmg={e.ultimate.damage} ult />
                      </div>
                      <div className="movecard__ult-meta">
                        {e.ultimate.boostedDmg != null && (
                          <span className="movecard__tag movecard__tag--boost">Boosted {e.ultimate.boostedDmg.toLocaleString()}</span>
                        )}
                        {e.ultimate.type && <span className="movecard__tag">{e.ultimate.type}</span>}
                        {e.ultimate.unblockable && <span className="movecard__tag movecard__tag--warn">Unblockable</span>}
                        {e.ultimate.selfDestruct && <span className="movecard__tag movecard__tag--warn">Self Destruct</span>}
                        {e.ultimate.movable && <span className="movecard__tag">Movable</span>}
                        {e.ultimate.affectsGiants && <span className="movecard__tag">Hits Giants</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="movelist-empty"><p>No moves match that search.</p></div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="movestat">
      <span className="movestat__label">{label}</span>
      <span className="movestat__val">{value}</span>
    </div>
  )
}

function Move({ name, tag, dmg, ult }) {
  return (
    <div className={'movemove' + (ult ? ' movemove--ult' : '')}>
      <span className="movemove__tag">{tag}</span>
      <span className="movemove__name">{name}</span>
      {dmg != null && <span className="movemove__dmg">{dmg.toLocaleString()}</span>}
    </div>
  )
}

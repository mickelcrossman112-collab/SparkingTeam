import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'

const SUPER_ARMOUR_DP = 7
const GOOD_SKILLS = ['Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage', 'Full Power', 'Super Explosive Wave']
const RUSH_SKILLS = ['Rush Attack', 'Instant Transmission', 'False Courage']

function getFormChain(char, form) {
  const idx = char.forms.findIndex(f => f.form === form.form)
  if (idx === -1) return char.forms
  return char.forms.slice(idx)
}

function getProfile(char, form) {
  const chain = getFormChain(char, form)
  const traits = new Set()
  const skills = new Set()
  let bestDp = 0, peakHp = 0, peakMelee = 0, peakUltDmg = 0, ultName = ''
  for (const f of chain) {
    for (const t of f.traits) traits.add(t)
    if (f.dp > bestDp) bestDp = f.dp
    if (f.health > peakHp) peakHp = f.health
    const combat = getCombatData(char.name, f.form)
    if (combat) {
      if (combat.skill1) skills.add(combat.skill1)
      if (combat.skill2) skills.add(combat.skill2)
      if (combat.meleeDmg > peakMelee) peakMelee = combat.meleeDmg
      if (combat.ultimate?.damage > peakUltDmg) {
        peakUltDmg = combat.ultimate.damage
        ultName = combat.ultimate.name || ''
      }
    }
  }
  return { traits, skills, bestDp, startDp: form.dp, peakHp, peakMelee, peakUltDmg, ultName, transformRange: bestDp - form.dp }
}

function analyseMatchup(charA, formA, charB, formB) {
  const a = getProfile(charA, formA)
  const b = getProfile(charB, formB)
  const points = []

  if (a.bestDp > SUPER_ARMOUR_DP && b.bestDp <= SUPER_ARMOUR_DP)
    points.push({ side: 'a', text: `Gets super armour (${a.bestDp} DP vs ${b.bestDp} DP)`, weight: 3 })
  if (b.bestDp > SUPER_ARMOUR_DP && a.bestDp <= SUPER_ARMOUR_DP)
    points.push({ side: 'b', text: `Gets super armour (${b.bestDp} DP vs ${a.bestDp} DP)`, weight: 3 })

  if (a.traits.has('Dodge Skill') && b.traits.has('Instant Spark'))
    points.push({ side: 'a', text: 'Dodge Skill counters Instant Spark pressure', weight: 2 })
  if (b.traits.has('Dodge Skill') && a.traits.has('Instant Spark'))
    points.push({ side: 'b', text: 'Dodge Skill counters Instant Spark pressure', weight: 2 })

  if (a.traits.has('Unblockable Ultimate') && !b.traits.has('Instant Spark'))
    points.push({ side: 'a', text: 'Unblockable Ultimate with no Instant Spark to dodge it', weight: 2 })
  if (b.traits.has('Unblockable Ultimate') && !a.traits.has('Instant Spark'))
    points.push({ side: 'b', text: 'Unblockable Ultimate with no Instant Spark to dodge it', weight: 2 })

  if (a.skills.has('Explosive Wave') && b.traits.has('Dodge Skill'))
    points.push({ side: 'a', text: 'Explosive Wave punishes Dodge Skill', weight: 1 })
  if (b.skills.has('Explosive Wave') && a.traits.has('Dodge Skill'))
    points.push({ side: 'b', text: 'Explosive Wave punishes Dodge Skill', weight: 1 })

  if (a.traits.has('Health Regeneration'))
    points.push({ side: 'a', text: 'Health Regeneration extends fights', weight: 1 })
  if (b.traits.has('Health Regeneration'))
    points.push({ side: 'b', text: 'Health Regeneration extends fights', weight: 1 })

  if (a.peakHp > b.peakHp + 5000)
    points.push({ side: 'a', text: `Higher HP pool (${a.peakHp.toLocaleString()} vs ${b.peakHp.toLocaleString()})`, weight: 1 })
  if (b.peakHp > a.peakHp + 5000)
    points.push({ side: 'b', text: `Higher HP pool (${b.peakHp.toLocaleString()} vs ${a.peakHp.toLocaleString()})`, weight: 1 })

  if (a.peakMelee > b.peakMelee + 1500)
    points.push({ side: 'a', text: `Stronger melee damage (${a.peakMelee.toLocaleString()} vs ${b.peakMelee.toLocaleString()})`, weight: 1 })
  if (b.peakMelee > a.peakMelee + 1500)
    points.push({ side: 'b', text: `Stronger melee damage (${b.peakMelee.toLocaleString()} vs ${a.peakMelee.toLocaleString()})`, weight: 1 })

  if (a.peakUltDmg > 18000 && b.peakUltDmg <= 15000)
    points.push({ side: 'a', text: `Devastating ultimate (${a.peakUltDmg.toLocaleString()} dmg)`, weight: 1 })
  if (b.peakUltDmg > 18000 && a.peakUltDmg <= 15000)
    points.push({ side: 'b', text: `Devastating ultimate (${b.peakUltDmg.toLocaleString()} dmg)`, weight: 1 })

  if (a.transformRange >= 3)
    points.push({ side: 'a', text: `Strong transformation chain (+${a.transformRange} DP range)`, weight: 1 })
  if (b.transformRange >= 3)
    points.push({ side: 'b', text: `Strong transformation chain (+${b.transformRange} DP range)`, weight: 1 })

  for (const s of a.skills) {
    if (GOOD_SKILLS.includes(s) && !b.skills.has(s))
      points.push({ side: 'a', text: `Has ${s}`, weight: 0.5 })
  }
  for (const s of b.skills) {
    if (GOOD_SKILLS.includes(s) && !a.skills.has(s))
      points.push({ side: 'b', text: `Has ${s}`, weight: 0.5 })
  }

  for (const s of a.skills) {
    if (RUSH_SKILLS.includes(s) && !b.traits.has('Dodge Skill'))
      points.push({ side: 'a', text: `${s} is hard to escape without Dodge Skill`, weight: 0.5 })
  }
  for (const s of b.skills) {
    if (RUSH_SKILLS.includes(s) && !a.traits.has('Dodge Skill'))
      points.push({ side: 'b', text: `${s} is hard to escape without Dodge Skill`, weight: 0.5 })
  }

  const scoreA = points.filter(p => p.side === 'a').reduce((s, p) => s + p.weight, 0)
  const scoreB = points.filter(p => p.side === 'b').reduce((s, p) => s + p.weight, 0)

  let verdict
  const diff = scoreA - scoreB
  if (diff >= 4) verdict = { text: `${charA.name} dominates`, cls: 'h2h-verdict--a' }
  else if (diff >= 2) verdict = { text: `${charA.name} favoured`, cls: 'h2h-verdict--a' }
  else if (diff > -2) verdict = { text: 'Even matchup', cls: 'h2h-verdict--even' }
  else if (diff > -4) verdict = { text: `${charB.name} favoured`, cls: 'h2h-verdict--b' }
  else verdict = { text: `${charB.name} dominates`, cls: 'h2h-verdict--b' }

  return { points, scoreA, scoreB, verdict, profileA: a, profileB: b }
}

function CharPicker({ label, value, form, onPick, onFormPick }) {
  const [search, setSearch] = useState('')
  const results = useMemo(() => {
    if (!search.trim()) return []
    const q = search.trim().toLowerCase()
    return characters.filter(c => c.name.toLowerCase().includes(q)).slice(0, 6)
  }, [search])

  return (
    <div className="h2h-picker">
      <span className="h2h-picker__label">{label}</span>
      {!value ? (
        <div className="h2h-picker__search-wrap">
          <input
            className="h2h-picker__input"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {results.length > 0 && (
            <div className="h2h-picker__results">
              {results.map(c => (
                <button key={c.id} className="h2h-picker__result" type="button" onClick={() => { onPick(c); setSearch('') }}>
                  {c.forms[0]?.image ? <img className="h2h-picker__thumb" src={c.forms[0].image} alt="" /> : <div className="h2h-picker__thumb-ph" style={{ background: c.color }}>{c.name[0]}</div>}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h2h-picker__selected">
          <div className="h2h-picker__char">
            {form?.image ? <img className="h2h-picker__portrait" src={form.image} alt="" /> : <div className="h2h-picker__portrait-ph" style={{ background: value.color }}>{value.name[0]}</div>}
            <div>
              <div className="h2h-picker__name">{value.name}</div>
              <div className="h2h-picker__dp">{form?.dp} DP</div>
            </div>
            <button className="h2h-picker__clear" type="button" onClick={() => onPick(null)}>&times;</button>
          </div>
          {value.forms.length > 1 && (
            <div className="h2h-picker__forms">
              {value.forms.map((f, i) => (
                <button
                  key={f.form}
                  className={'h2h-form-btn' + (f.form === form?.form ? ' h2h-form-btn--active' : '')}
                  type="button"
                  onClick={() => onFormPick(i)}
                >
                  {f.form} ({f.dp})
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HeadToHead() {
  const [charA, setCharA] = useState(null)
  const [charB, setCharB] = useState(null)
  const [formIdxA, setFormIdxA] = useState(0)
  const [formIdxB, setFormIdxB] = useState(0)

  const formA = charA?.forms[formIdxA] || charA?.forms[0]
  const formB = charB?.forms[formIdxB] || charB?.forms[0]

  const analysis = useMemo(() => {
    if (!charA || !charB || !formA || !formB) return null
    return analyseMatchup(charA, formA, charB, formB)
  }, [charA, charB, formIdxA, formIdxB])

  return (
    <div className="h2h">
      <p className="h2h-intro">Pick two fighters to see a detailed 1v1 matchup breakdown.</p>
      <div className="h2h-pickers">
        <CharPicker label="Your Fighter" value={charA} form={formA} onPick={c => { setCharA(c); setFormIdxA(0) }} onFormPick={setFormIdxA} />
        <div className="h2h-vs">VS</div>
        <CharPicker label="Opponent" value={charB} form={formB} onPick={c => { setCharB(c); setFormIdxB(0) }} onFormPick={setFormIdxB} />
      </div>

      {analysis && (
        <div className="h2h-result">
          <div className={'h2h-verdict ' + analysis.verdict.cls}>
            {analysis.verdict.text}
          </div>

          <div className="h2h-score-bar">
            <div className="h2h-score-bar__a" style={{ flex: Math.max(analysis.scoreA, 0.5) }}>
              {analysis.scoreA.toFixed(1)}
            </div>
            <div className="h2h-score-bar__b" style={{ flex: Math.max(analysis.scoreB, 0.5) }}>
              {analysis.scoreB.toFixed(1)}
            </div>
          </div>
          <div className="h2h-score-names">
            <span>{charA.name}</span>
            <span>{charB.name}</span>
          </div>

          <div className="h2h-stats-compare">
            <div className="h2h-stat-row">
              <span className="h2h-stat-val">{analysis.profileA.peakHp.toLocaleString()}</span>
              <span className="h2h-stat-label">Peak HP</span>
              <span className="h2h-stat-val">{analysis.profileB.peakHp.toLocaleString()}</span>
            </div>
            <div className="h2h-stat-row">
              <span className="h2h-stat-val">{analysis.profileA.bestDp}</span>
              <span className="h2h-stat-label">Best DP</span>
              <span className="h2h-stat-val">{analysis.profileB.bestDp}</span>
            </div>
            <div className="h2h-stat-row">
              <span className="h2h-stat-val">{analysis.profileA.peakMelee.toLocaleString()}</span>
              <span className="h2h-stat-label">Melee Dmg</span>
              <span className="h2h-stat-val">{analysis.profileB.peakMelee.toLocaleString()}</span>
            </div>
            <div className="h2h-stat-row">
              <span className="h2h-stat-val">{analysis.profileA.peakUltDmg.toLocaleString()}</span>
              <span className="h2h-stat-label">Ult Dmg</span>
              <span className="h2h-stat-val">{analysis.profileB.peakUltDmg.toLocaleString()}</span>
            </div>
          </div>

          <div className="h2h-breakdown">
            <h3 className="h2h-breakdown__title">Why?</h3>
            <div className="h2h-breakdown__cols">
              <div className="h2h-breakdown__col h2h-breakdown__col--a">
                <h4 className="h2h-breakdown__side">{charA.name}</h4>
                {analysis.points.filter(p => p.side === 'a').sort((a, b) => b.weight - a.weight).map((p, i) => (
                  <div key={i} className="h2h-point">
                    <span className="h2h-point__weight">{'+'.repeat(Math.ceil(p.weight))}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
                {analysis.points.filter(p => p.side === 'a').length === 0 && <span className="h2h-point__none">No advantages</span>}
              </div>
              <div className="h2h-breakdown__col h2h-breakdown__col--b">
                <h4 className="h2h-breakdown__side">{charB.name}</h4>
                {analysis.points.filter(p => p.side === 'b').sort((a, b) => b.weight - a.weight).map((p, i) => (
                  <div key={i} className="h2h-point">
                    <span className="h2h-point__weight">{'+'.repeat(Math.ceil(p.weight))}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
                {analysis.points.filter(p => p.side === 'b').length === 0 && <span className="h2h-point__none">No advantages</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

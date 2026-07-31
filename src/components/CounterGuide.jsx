import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { getForm } from '../utils/dp.js'
import { tierLists } from '../data/tierList.js'
import { ARCHETYPES, CHARACTER_TIPS } from '../data/counterStrategies.js'
import CharacterDetail from './CharacterDetail.jsx'

const TIER_SCORES = { Z: 8, S: 6, A: 4, B: 2, D: 0 }
const GOOD_SKILLS = ['Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage', 'Full Power', 'Full Power Charge', 'Super Explosive Wave']

function getTierBonus(charId) {
  let best = 0
  for (const list of tierLists) {
    for (const t of list.tiers) {
      if (t.characters.includes(charId)) {
        const val = TIER_SCORES[t.tier] ?? 0
        if (val > best) best = val
      }
    }
  }
  return best
}

function analyzeEnemy(char) {
  const weaknesses = []
  const strengths = []
  let bestForm = char.forms[0]
  let bestDp = 0

  for (const form of char.forms) {
    if (form.dp > bestDp) { bestDp = form.dp; bestForm = form }
  }

  const allTraits = new Set()
  const allSkills = new Set()
  let peakHp = 0
  let peakMelee = 0
  let peakKi = 0
  let peakDef = 0
  let peakUlt = 0
  let slowestSwitch = 0

  for (const form of char.forms) {
    for (const t of form.traits) allTraits.add(t)
    if (form.health > peakHp) peakHp = form.health

    const combat = getCombatData(char.name, form.form)
    if (combat) {
      if (combat.skill1) allSkills.add(combat.skill1)
      if (combat.skill2) allSkills.add(combat.skill2)
      if (combat.meleeDmg > peakMelee) peakMelee = combat.meleeDmg
      if (combat.kiBlastDmg > peakKi) peakKi = combat.kiBlastDmg
      if (combat.defense > peakDef) peakDef = combat.defense
      if (combat.ultimate?.damage > peakUlt) peakUlt = combat.ultimate.damage
      if (combat.switchTime > slowestSwitch) slowestSwitch = combat.switchTime
    }
  }

  if (peakMelee > 4500) strengths.push('Very high melee damage')
  if (peakUlt > 20000) strengths.push('Devastating ultimate attack')
  if (peakHp >= 28000) strengths.push('Massive health pool')
  if (peakDef >= 4000) strengths.push('High defence — hard to damage')
  if (peakKi > 3500) strengths.push('Strong ki blasts — dangerous at range')
  if (char.forms.length >= 4) strengths.push(`${char.forms.length} forms — very versatile`)
  if (bestDp >= 8) strengths.push(`High cost (${bestDp} DP) — powerful but expensive`)

  if (peakHp < 22000) weaknesses.push('Low health — can be burst down')
  if (peakDef < 3000) weaknesses.push('Low defence — takes more damage')
  if (slowestSwitch > 4) weaknesses.push('Slow switch time — punishable on swap')
  if (bestDp >= 7) weaknesses.push(`Expensive (${bestDp} DP) — limits team options`)
  if (peakKi < 2500) weaknesses.push('Weak ki blasts — poor at range')
  if (peakMelee < 3500) weaknesses.push('Low melee damage — struggles up close')
  if (char.forms.length === 1) weaknesses.push('Only 1 form — no transformation options')

  const archetypeMatches = []
  for (const arch of ARCHETYPES) {
    let match = 0
    if (arch.id === 'rush-spam' && peakMelee > 4000) match += 2
    if (arch.id === 'high-dp-duo' && bestDp >= 7) match += 3
    if (arch.id === 'tanky-chip' && peakHp >= 25000 && peakDef >= 3500) match += 2
    if (arch.id === 'zoner' && peakKi > 3500) match += 2
    if (arch.id === 'fusion-spam' && char.forms.some(f => f.tags?.includes('Fusion'))) match += 3
    if (arch.id === 'regen-stall' && peakHp >= 26000) match += 2
    if (arch.id === 'ultra-instinct' && bestDp >= 8) match += 1
    if (arch.id === 'giant' && peakHp >= 30000) match += 2
    if (match > 0) archetypeMatches.push({ ...arch, match })
  }
  archetypeMatches.sort((a, b) => b.match - a.match)

  return { weaknesses, strengths, bestForm, bestDp, allTraits, allSkills, peakHp, peakMelee, peakKi, peakDef, peakUlt, archetypeMatches }
}

function scoreCounter(counterChar, enemyAnalysis) {
  let score = 0
  const allSkills = new Set()
  let peakHp = 0
  let peakMelee = 0

  for (const form of counterChar.forms) {
    if (form.health > peakHp) peakHp = form.health

    const combat = getCombatData(counterChar.name, form.form)
    if (combat) {
      if (combat.skill1) allSkills.add(combat.skill1)
      if (combat.skill2) allSkills.add(combat.skill2)
      if (combat.meleeDmg > peakMelee) peakMelee = combat.meleeDmg
    }
  }

  if (enemyAnalysis.peakMelee > 4000 && peakHp >= 25000) score += 4
  if (enemyAnalysis.peakHp >= 28000 && peakMelee > 4000) score += 4
  if (enemyAnalysis.bestDp >= 7 && counterChar.forms.length >= 3) score += 3
  if (enemyAnalysis.peakKi > 3500 && peakMelee > 4000) score += 3
  if (enemyAnalysis.peakDef >= 4000 && peakMelee > 4500) score += 3
  if (peakMelee > 4000) score += 3

  for (const skill of allSkills) {
    if (GOOD_SKILLS.includes(skill)) score += 2
  }

  score += getTierBonus(counterChar.id)
  score += peakHp / 5000
  score += peakMelee / 1500

  return { score, allSkills }
}

export default function CounterGuide() {
  const [search, setSearch] = useState('')
  const [selectedEnemy, setSelectedEnemy] = useState(null)
  const [activeArch, setActiveArch] = useState(null)
  const [detailChar, setDetailChar] = useState(null)

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return characters
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 12)
  }, [search])

  const enemyAnalysis = useMemo(() => {
    if (!selectedEnemy) return null
    return analyzeEnemy(selectedEnemy)
  }, [selectedEnemy])

  const counterPicks = useMemo(() => {
    if (!selectedEnemy || !enemyAnalysis) return []
    const results = []
    for (const char of characters) {
      if (char.id === selectedEnemy.id) continue
      const { score, allSkills } = scoreCounter(char, enemyAnalysis)
      let bestForm = char.forms[0]
      let bestDp = 0
      for (const f of char.forms) { if (f.dp > bestDp) { bestDp = f.dp; bestForm = f } }
      const tierBonus = getTierBonus(char.id)
      const tierLabel = tierBonus >= 8 ? 'Z' : tierBonus >= 6 ? 'S' : tierBonus >= 4 ? 'A' : tierBonus >= 2 ? 'B' : 'D'
      results.push({ char, form: bestForm, score, allSkills, tierLabel })
    }
    results.sort((a, b) => b.score - a.score)
    return results.slice(0, 12)
  }, [selectedEnemy, enemyAnalysis])

  const charTips = selectedEnemy ? CHARACTER_TIPS[selectedEnemy.id] : null

  const selectEnemy = (char) => {
    setSelectedEnemy(char)
    setSearch('')
    setActiveArch(null)
  }

  return (
    <div className="cg-page">
      <div className="cg-intro">
        <h3 className="cg-title">Counter Guide</h3>
        <p className="cg-sub">Search for an enemy character or pick a playstyle to counter.</p>
      </div>

      <div className="cg-search-wrap">
        <input
          className="cg-search"
          type="text"
          placeholder="Search enemy character..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="cg-dropdown">
            {searchResults.map(c => {
              const bestForm = c.forms.reduce((a, b) => b.dp > a.dp ? b : a, c.forms[0])
              return (
                <button
                  key={c.id}
                  className="cg-dropdown__item"
                  type="button"
                  onClick={() => selectEnemy(c)}
                >
                  {bestForm.image ? (
                    <img className="cg-dropdown__img" src={bestForm.image} alt={c.name} />
                  ) : (
                    <div className="cg-dropdown__ph" style={{ background: c.color }}>{c.name[0]}</div>
                  )}
                  <span className="cg-dropdown__name">{c.name}</span>
                  <span className="cg-dropdown__dp">{bestForm.dp} DP</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedEnemy && enemyAnalysis && (
        <div className="cg-enemy-panel">
          <div className="cg-enemy-header">
            {enemyAnalysis.bestForm.image ? (
              <img className="cg-enemy__img" src={enemyAnalysis.bestForm.image} alt={selectedEnemy.name} />
            ) : (
              <div className="cg-enemy__ph" style={{ background: selectedEnemy.color }}>{selectedEnemy.name[0]}</div>
            )}
            <div className="cg-enemy__info">
              <h3 className="cg-enemy__name">{selectedEnemy.name}</h3>
              <span className="cg-enemy__dp">{enemyAnalysis.bestDp} DP (strongest form)</span>
              <div className="cg-enemy__forms">{selectedEnemy.forms.length} form{selectedEnemy.forms.length !== 1 ? 's' : ''}</div>
            </div>
            <button className="cg-enemy__close" type="button" onClick={() => setSelectedEnemy(null)}>Clear</button>
          </div>

          {charTips && (
            <div className="cg-tips-box cg-tips-box--danger">
              <h4 className="cg-tips-label">Why They're Dangerous</h4>
              <p className="cg-tips-danger">{charTips.danger}</p>
              <h4 className="cg-tips-label">How to Beat Them</h4>
              <ul className="cg-tips-list">
                {charTips.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}

          <div className="cg-analysis-grid">
            <div className="cg-analysis-col">
              <h4 className="cg-analysis-title cg-analysis-title--red">Strengths</h4>
              {enemyAnalysis.strengths.length > 0 ? (
                <ul className="cg-analysis-list">
                  {enemyAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : (
                <p className="cg-analysis-none">No major strengths detected</p>
              )}
            </div>
            <div className="cg-analysis-col">
              <h4 className="cg-analysis-title cg-analysis-title--green">Weaknesses</h4>
              {enemyAnalysis.weaknesses.length > 0 ? (
                <ul className="cg-analysis-list">
                  {enemyAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              ) : (
                <p className="cg-analysis-none">No major weaknesses detected</p>
              )}
            </div>
          </div>

          {enemyAnalysis.archetypeMatches.length > 0 && (
            <div className="cg-arch-matches">
              <h4 className="cg-arch-matches__title">Matching Playstyles</h4>
              <div className="cg-arch-matches__pills">
                {enemyAnalysis.archetypeMatches.map(a => (
                  <button
                    key={a.id}
                    className={'cg-arch-pill' + (activeArch?.id === a.id ? ' cg-arch-pill--active' : '')}
                    type="button"
                    onClick={() => setActiveArch(activeArch?.id === a.id ? null : a)}
                  >
                    {a.icon} {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cg-counters">
            <h4 className="cg-counters__title">Best Counters vs {selectedEnemy.name}</h4>
            <div className="cg-counters__grid">
              {counterPicks.map(({ char, form, score, allSkills, tierLabel }) => (
                <button
                  key={char.id}
                  className="cg-counter-card"
                  type="button"
                  onClick={() => setDetailChar(char)}
                >
                  <div className="cg-counter-card__img-wrap">
                    {form.image ? (
                      <img src={form.image} alt={char.name} />
                    ) : (
                      <div className="cg-counter-card__ph" style={{ background: char.color }}>{char.name[0]}</div>
                    )}
                    <span className="cg-counter-card__dp">{form.dp} DP</span>
                    <span className={'cg-counter-card__tier cg-counter-card__tier--' + tierLabel.toLowerCase()}>{tierLabel}</span>
                  </div>
                  <h5 className="cg-counter-card__name">{char.name}</h5>
                  <div className="cg-counter-card__tags">
                    {[...allSkills].filter(s => GOOD_SKILLS.includes(s)).map(s => (
                      <span key={s} className="cg-tag cg-tag--skill">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeArch && (
        <div className="cg-arch-detail">
          <div className="cg-arch-detail__header">
            <span className="cg-arch-detail__icon">{activeArch.icon}</span>
            <div>
              <h4 className="cg-arch-detail__name">{activeArch.name}</h4>
              <p className="cg-arch-detail__desc">{activeArch.desc}</p>
            </div>
          </div>
          <ul className="cg-arch-detail__list">
            {activeArch.counters.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          <div className="cg-arch-detail__tags">
            <span className="cg-arch-detail__label">Good Traits:</span>
            {activeArch.goodTraits.map(t => <span key={t} className="cg-tag cg-tag--trait">{t}</span>)}
          </div>
          <div className="cg-arch-detail__tags">
            <span className="cg-arch-detail__label">Good Skills:</span>
            {activeArch.goodSkills.map(s => <span key={s} className="cg-tag cg-tag--skill">{s}</span>)}
          </div>
        </div>
      )}

      {!selectedEnemy && (
        <div className="cg-archetypes">
          <h3 className="cg-arch-title">Common Enemy Playstyles</h3>
          <p className="cg-arch-sub">Tap a playstyle to see how to counter it.</p>
          <div className="cg-arch-grid">
            {ARCHETYPES.map(arch => (
              <button
                key={arch.id}
                className={'cg-arch-card' + (activeArch?.id === arch.id ? ' cg-arch-card--active' : '')}
                type="button"
                onClick={() => setActiveArch(activeArch?.id === arch.id ? null : arch)}
              >
                <span className="cg-arch-card__icon">{arch.icon}</span>
                <h4 className="cg-arch-card__name">{arch.name}</h4>
                <p className="cg-arch-card__desc">{arch.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {detailChar && (
        <CharacterDetail character={detailChar} onClose={() => setDetailChar(null)} />
      )}
    </div>
  )
}

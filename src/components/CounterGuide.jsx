import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { getForm } from '../utils/dp.js'
import { tierLists } from '../data/tierList.js'
import { ARCHETYPES, CHARACTER_TIPS, RANKED_META } from '../data/counterStrategies.js'
import CharacterDetail from './CharacterDetail.jsx'

const TIER_SCORES = { Z: 8, S: 6, A: 4, B: 2, D: 0 }
const GOOD_SKILLS = ['Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage', 'Full Power', 'Full Power Charge', 'Super Explosive Wave']
const GOOD_TRAITS = ['Instant Spark', 'Dodge Skill', 'Health Regeneration', 'Unblockable Ultimate']

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

function getTransformRange(char) {
  if (char.forms.length <= 1) return 0
  let minDp = Infinity, maxDp = 0
  for (const f of char.forms) {
    if (f.dp < minDp) minDp = f.dp
    if (f.dp > maxDp) maxDp = f.dp
  }
  return maxDp - minDp
}

function analyzeEnemy(char) {
  const weaknesses = []
  const strengths = []
  const rankedWarnings = []
  let bestForm = char.forms[0]
  let bestDp = 0
  let lowestDp = Infinity

  for (const form of char.forms) {
    if (form.dp > bestDp) { bestDp = form.dp; bestForm = form }
    if (form.dp < lowestDp) lowestDp = form.dp
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

  // Trait-based strengths
  if (allTraits.has('Instant Spark')) strengths.push('Has Instant Spark — can escape combos')
  if (allTraits.has('Dodge Skill')) strengths.push('Has Dodge Skill — auto-dodges attacks')
  if (allTraits.has('Unblockable Ultimate')) strengths.push('Unblockable Ultimate — bypasses guard')
  if (allTraits.has('Health Regeneration')) strengths.push('Health Regeneration — heals over time')

  // Stat-based strengths
  if (peakMelee > 4500) strengths.push('Very high melee damage')
  if (peakUlt > 20000) strengths.push('Devastating ultimate attack')
  if (peakHp >= 28000) strengths.push('Massive health pool')
  if (peakKi > 3500) strengths.push('Strong ki blasts — dangerous at range')
  if (bestDp >= 8) strengths.push(`High cost (${bestDp} DP) — powerful but expensive`)

  // Super armour mechanic
  if (bestDp > RANKED_META.superArmourThreshold) {
    strengths.push(`Super armour vs characters below ${RANKED_META.superArmourThreshold} DP`)
    rankedWarnings.push(`Gets super armour against characters below ${RANKED_META.superArmourThreshold} DP — your low DP characters will bounce off. Match their DP or use cheese moves to survive.`)
  }

  // Transformation threat
  const transformRange = getTransformRange(char)
  if (transformRange >= 4) {
    strengths.push(`Transformation threat — goes from ${lowestDp} to ${bestDp} DP`)
    rankedWarnings.push(`Starts cheap at ${lowestDp} DP but transforms to ${bestDp} DP. Kill them before they power up or you will face a monster.`)
  } else if (transformRange >= 2 && bestDp >= 7) {
    strengths.push(`Can transform up to ${bestDp} DP`)
  }

  // Ranked meta awareness
  if (RANKED_META.passiveCrutch.includes(char.id)) {
    rankedWarnings.push('Common ranked crutch pick — players abuse a specific gimmick with this character. Learn the counter or you will struggle.')
  }
  if (RANKED_META.cheesePicks.includes(char.id)) {
    rankedWarnings.push('Popular low DP cheese pick in ranked. Annoying but beatable once you know the tricks.')
  }
  if (RANKED_META.androidIds.includes(char.id)) {
    rankedWarnings.push('Android character — cannot charge ki, must land hits to build meter. Expect non-stop aggression.')
  }

  // Weaknesses
  if (!allTraits.has('Dodge Skill')) weaknesses.push('No Dodge Skill — cannot auto-dodge')
  if (!allTraits.has('Instant Spark')) weaknesses.push('No Instant Spark — stuck in combos')
  if (peakHp < 22000) weaknesses.push('Low health — can be burst down')
  if (peakDef < 3000) weaknesses.push('Low defence — takes more damage')
  if (slowestSwitch > 4) weaknesses.push('Slow switch time — punishable on swap')
  if (bestDp >= 7) weaknesses.push(`Expensive (${bestDp} DP) — limits team options`)
  if (peakKi < 2500) weaknesses.push('Weak ki blasts — poor at range')
  if (char.forms.length === 1) weaknesses.push('Only 1 form — no transformation options')
  if (bestDp <= RANKED_META.superArmourThreshold && bestDp >= 3) {
    weaknesses.push('Vulnerable to super armour from high DP characters')
  }

  // Archetype matching
  const archetypeMatches = []
  for (const arch of ARCHETYPES) {
    let match = 0
    if (arch.id === 'rush-spam' && peakMelee > 4000) match += 2
    if (arch.id === 'high-dp-duo' && bestDp >= 8) match += 3
    if (arch.id === 'low-dp-cheese' && bestDp <= 4 && (allSkills.has('Afterimage Strike') || allSkills.has('Explosive Wave'))) match += 3
    if (arch.id === 'low-dp-cheese' && RANKED_META.cheesePicks.includes(char.id)) match += 3
    if (arch.id === 'transform-team' && transformRange >= 3) match += 3
    if (arch.id === 'transform-team' && RANKED_META.transformThreat.includes(char.id)) match += 2
    if (arch.id === 'passive-crutch' && RANKED_META.passiveCrutch.includes(char.id)) match += 4
    if (arch.id === 'android-aggro' && RANKED_META.androidIds.includes(char.id)) match += 4
    if (arch.id === 'fusion-spam' && char.forms.some(f => f.tags?.includes('Fusion Warrior'))) match += 3
    if (arch.id === 'regen-stall' && allTraits.has('Health Regeneration')) match += 3
    if (arch.id === 'ultra-instinct' && allTraits.has('Dodge Skill')) match += 3
    if (arch.id === 'giant' && peakHp >= 30000) match += 2
    if (match > 0) archetypeMatches.push({ ...arch, match })
  }
  archetypeMatches.sort((a, b) => b.match - a.match)

  return { weaknesses, strengths, rankedWarnings, bestForm, bestDp, lowestDp, allTraits, allSkills, peakHp, peakMelee, peakKi, peakDef, peakUlt, archetypeMatches, transformRange }
}

function scoreCounter(counterChar, enemyAnalysis) {
  let score = 0
  const allTraits = new Set()
  const allSkills = new Set()
  let peakHp = 0
  let peakMelee = 0
  let bestDp = 0

  for (const form of counterChar.forms) {
    for (const t of form.traits) allTraits.add(t)
    if (form.health > peakHp) peakHp = form.health
    if (form.dp > bestDp) bestDp = form.dp

    const combat = getCombatData(counterChar.name, form.form)
    if (combat) {
      if (combat.skill1) allSkills.add(combat.skill1)
      if (combat.skill2) allSkills.add(combat.skill2)
      if (combat.meleeDmg > peakMelee) peakMelee = combat.meleeDmg
    }
  }

  // Trait-based counter scoring
  if (enemyAnalysis.allTraits.has('Instant Spark') && allTraits.has('Dodge Skill')) score += 5
  if (enemyAnalysis.allTraits.has('Dodge Skill') && allSkills.has('Explosive Wave')) score += 5
  if (enemyAnalysis.allTraits.has('Health Regeneration') && peakMelee > 4000) score += 4
  if (enemyAnalysis.allTraits.has('Unblockable Ultimate') && allTraits.has('Dodge Skill')) score += 4
  if (enemyAnalysis.bestDp >= 7 && allTraits.has('Unblockable Ultimate')) score += 4
  if (enemyAnalysis.peakMelee > 4000 && allTraits.has('Instant Spark')) score += 3
  if (!enemyAnalysis.allTraits.has('Dodge Skill') && peakMelee > 4000) score += 3
  if (!enemyAnalysis.allTraits.has('Instant Spark') && allTraits.has('Unblockable Ultimate')) score += 3

  // Super armour awareness: if enemy is high DP, prefer counters that also hit the threshold
  if (enemyAnalysis.bestDp > RANKED_META.superArmourThreshold) {
    if (bestDp > RANKED_META.superArmourThreshold) score += 5
    else if (bestDp <= 4) score -= 3
  }

  // Against cheese squads, prefer high DP characters with super armour
  if (RANKED_META.cheesePicks.includes(counterChar.id)) {
    if (enemyAnalysis.bestDp > RANKED_META.superArmourThreshold) score -= 4
  }
  if (enemyAnalysis.bestDp <= 4 && bestDp > RANKED_META.superArmourThreshold) score += 4

  // Against transformation teams, prefer aggressive characters that can pressure early
  if (enemyAnalysis.transformRange >= 4 && peakMelee > 4000) score += 3

  // Against androids, reward zoning and dodge
  if (RANKED_META.androidIds.includes(counterChar.id) && enemyAnalysis.allTraits.has('Dodge Skill')) {
    score -= 2
  }

  // Skill and trait bonuses
  for (const skill of allSkills) {
    if (GOOD_SKILLS.includes(skill)) score += 2
  }
  for (const trait of allTraits) {
    if (GOOD_TRAITS.includes(trait)) score += 1.5
  }

  score += getTierBonus(counterChar.id)
  score += peakHp / 5000
  score += peakMelee / 1500

  return { score, allTraits, allSkills, bestDp }
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
      const { score, allTraits, allSkills, bestDp } = scoreCounter(char, enemyAnalysis)
      let bestForm = char.forms[0]
      let formBestDp = 0
      for (const f of char.forms) { if (f.dp > formBestDp) { formBestDp = f.dp; bestForm = f } }
      const tierBonus = getTierBonus(char.id)
      const tierLabel = tierBonus >= 8 ? 'Z' : tierBonus >= 6 ? 'S' : tierBonus >= 4 ? 'A' : tierBonus >= 2 ? 'B' : 'D'
      results.push({ char, form: bestForm, score, allTraits, allSkills, tierLabel, bestDp })
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

          {enemyAnalysis.rankedWarnings.length > 0 && (
            <div className="cg-tips-box cg-tips-box--ranked">
              <h4 className="cg-tips-label">Ranked Meta Intel</h4>
              <ul className="cg-tips-list">
                {enemyAnalysis.rankedWarnings.map((w, i) => <li key={i}>{w}</li>)}
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
              {counterPicks.map(({ char, form, score, allTraits, allSkills, tierLabel, bestDp }) => (
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
                    {[...allTraits].filter(t => GOOD_TRAITS.includes(t)).map(t => (
                      <span key={t} className="cg-tag cg-tag--trait">{t}</span>
                    ))}
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

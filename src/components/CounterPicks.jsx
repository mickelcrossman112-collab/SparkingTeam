import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { getForm } from '../utils/dp.js'
import { tierLists } from '../data/tierList.js'
import CharacterDetail from './CharacterDetail.jsx'

const TIER_SCORES = { Z: 8, S: 6, A: 4, B: 2, D: 0 }

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

const GOOD_SKILLS = ['Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage', 'Full Power', 'Full Power Charge', 'Super Explosive Wave']
const GOOD_TRAITS = ['Instant Spark', 'Dodge Skill', 'Health Regeneration', 'Unblockable Ultimate']

function analyzeTeam(team) {
  const tags = {}
  let totalHp = 0
  let totalDmg = 0
  let hasRange = false
  let hasDodge = false
  let bestUltDmg = 0
  let count = 0

  for (const item of team) {
    const char = charactersById[item.characterId]
    if (!char) continue

    for (const form of char.forms) {
      for (const t of form.tags || []) tags[t] = (tags[t] || 0) + 1
      if (form.traits.includes('Dodge Skill') || form.traits.includes('Instant Spark')) hasDodge = true

      const combat = getCombatData(char.name, form.form)
      if (combat) {
        if (combat.kiBlastDmg > 3000) hasRange = true
        if (combat.ultimate?.damage > bestUltDmg) bestUltDmg = combat.ultimate.damage
      }
    }

    const selectedForm = getForm(item)
    if (selectedForm) {
      count++
      totalHp += selectedForm.health
      const combat = getCombatData(char.name, selectedForm.form)
      if (combat) totalDmg += combat.meleeDmg
    }
  }

  const avgHp = count > 0 ? totalHp / count : 0
  const avgDmg = count > 0 ? totalDmg / count : 0
  const isRush = count >= 4
  const isPower = count <= 2 && avgDmg > 4000

  return { tags, avgHp, avgDmg, hasRange, hasDodge, isRush, isPower, bestUltDmg, count }
}

function scoreCharacter(char, analysis) {
  let score = 0
  const allTraits = new Set()
  const allSkills = new Set()
  let peakHp = 0
  let peakMelee = 0
  let peakKi = 0
  let peakDef = 0
  let peakUlt = 0
  let formCount = char.forms.length

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
    }
  }

  if (analysis.isPower) {
    score += peakHp / 3000
    if (allTraits.has('Dodge Skill')) score += 5
    if (allTraits.has('Health Regeneration')) score += 4
    if (allTraits.has('Instant Spark')) score += 3
    if (allTraits.has('Unblockable Ultimate')) score += 2
  }

  if (analysis.isRush) {
    score += peakMelee / 800
    if (peakUlt > 0) score += peakUlt / 3000
    if (allTraits.has('Unblockable Ultimate')) score += 4
  }

  if (!analysis.hasDodge) {
    if (allTraits.has('Instant Spark')) score += 3
  }

  if (!analysis.hasRange && peakKi > 3000) {
    score += 3
  }

  for (const skill of allSkills) {
    if (GOOD_SKILLS.includes(skill)) score += 3
  }
  score += peakDef / 400

  if (formCount > 1) score += formCount * 0.5

  score += getTierBonus(char.id)

  const oppTags = Object.keys(analysis.tags)
  const charTags = new Set()
  for (const form of char.forms) {
    for (const t of form.tags || []) charTags.add(t)
  }
  let uniqueTags = 0
  for (const t of charTags) {
    if (!oppTags.includes(t)) uniqueTags++
  }
  score += uniqueTags * 0.5

  score += peakHp / 5000
  score += peakMelee / 1200

  return { score, allTraits, allSkills, peakHp, peakMelee, peakDef, formCount }
}

function getBestDisplayForm(char) {
  let best = char.forms[0]
  let bestDp = 0
  for (const f of char.forms) {
    if (f.dp > bestDp) { bestDp = f.dp; best = f }
  }
  return best
}

export default function CounterPicks({ team }) {
  const [selectedChar, setSelectedChar] = useState(null)

  const analysis = useMemo(() => analyzeTeam(team), [team])

  const counters = useMemo(() => {
    if (team.length === 0) return []
    const usedIds = new Set(team.map((t) => t.characterId))
    const results = []

    for (const char of characters) {
      if (usedIds.has(char.id)) continue
      const { score, allTraits, allSkills, formCount } = scoreCharacter(char, analysis)
      const displayForm = getBestDisplayForm(char)
      const tierBonus = getTierBonus(char.id)
      const tierLabel = tierBonus >= 8 ? 'Z' : tierBonus >= 6 ? 'S' : tierBonus >= 4 ? 'A' : tierBonus >= 2 ? 'B' : 'D'
      results.push({ char, form: displayForm, score, allTraits, allSkills, formCount, tierLabel })
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, 15)
  }, [team, analysis])

  const weaknesses = useMemo(() => {
    const w = []
    if (analysis.count === 0) return w
    if (!analysis.hasDodge) w.push({ label: 'No Dodge/Spark', desc: 'No form across your team has Dodge Skill or Instant Spark — vulnerable to pressure' })
    if (!analysis.hasRange) w.push({ label: 'No Range', desc: 'No form has strong ki blasts — weak to zoners' })
    if (analysis.isRush) w.push({ label: 'Rush Team', desc: 'Many low-DP fighters — vulnerable to high-damage opponents' })
    if (analysis.isPower) w.push({ label: 'Power Team', desc: 'Few fighters — if one goes down, recovery is hard' })
    if (analysis.avgHp < 22000) w.push({ label: 'Low HP', desc: 'Below average health — can be burst down quickly' })
    return w
  }, [analysis])

  return (
    <div className="cp-page">
      {team.length === 0 ? (
        <div className="cp-empty">
          <p>Add fighters to your team first, then come here to see counter picks against it.</p>
        </div>
      ) : (
        <>
          {weaknesses.length > 0 && (
            <div className="cp-weaknesses">
              <h3 className="cp-section-title">
                <span className="cp-section-icon">⚠️</span> Team Weaknesses
              </h3>
              <div className="cp-weakness-list">
                {weaknesses.map((w) => (
                  <div key={w.label} className="cp-weakness">
                    <span className="cp-weakness__label">{w.label}</span>
                    <span className="cp-weakness__desc">{w.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cp-counters">
            <h3 className="cp-section-title">
              <span className="cp-section-icon">🎯</span> Recommended Counters
            </h3>
            <p className="cp-hint">Scored across all forms — skills, traits, and stats from every transformation</p>
            <div className="cp-grid">
              {counters.map(({ char, form, score, allTraits, allSkills, formCount, tierLabel }) => (
                <button
                  key={char.id}
                  className="cp-card"
                  onClick={() => setSelectedChar(char)}
                  type="button"
                >
                  <div className="cp-card__image">
                    {form.image ? (
                      <img src={form.image} alt={char.name} />
                    ) : (
                      <div className="cp-card__placeholder" style={{ background: char.color }}>
                        {char.name[0]}
                      </div>
                    )}
                    <span className="cp-card__dp">⚡ {form.dp}</span>
                    <span className="cp-card__score">{score.toFixed(1)}</span>
                    <span className={'cp-card__tier cp-card__tier--' + tierLabel.toLowerCase()}>{tierLabel}</span>
                  </div>
                  <div className="cp-card__body">
                    <h4 className="cp-card__name">{char.name}</h4>
                    <p className="cp-card__form">
                      {formCount} form{formCount !== 1 ? 's' : ''}
                      {' · '}{form.form}
                    </p>
                    <div className="cp-card__reasons">
                      {[...allTraits].filter((t) => GOOD_TRAITS.includes(t)).map((t) => (
                        <span key={t} className="cp-card__reason cp-card__reason--trait">{t}</span>
                      ))}
                      {[...allSkills].filter((s) => GOOD_SKILLS.includes(s)).map((s) => (
                        <span key={s} className="cp-card__reason cp-card__reason--skill">{s}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedChar && (
        <CharacterDetail character={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </div>
  )
}

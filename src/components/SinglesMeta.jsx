import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { tierLists } from '../data/tierList.js'
import CharacterDetail from './CharacterDetail.jsx'

const SUPER_ARMOUR_DP = 7

function getKeyStrengths(char) {
  const strengths = []
  const topForm = char.forms[char.forms.length - 1]
  const traits = new Set()
  for (const f of char.forms) for (const t of f.traits) traits.add(t)

  if (traits.has('Instant Spark')) strengths.push('Instant Spark')
  if (traits.has('Dodge Skill')) strengths.push('Dodge Skill')
  if (traits.has('Unblockable Ultimate')) strengths.push('UU')
  if (traits.has('Health Regeneration')) strengths.push('Regen')
  if (topForm.dp > SUPER_ARMOUR_DP) strengths.push('Super Armour')

  const combat = getCombatData(char.name, topForm.form)
  if (combat) {
    if (combat.skill1 === 'Afterimage Strike' || combat.skill2 === 'Afterimage Strike') strengths.push('Afterimage')
    if (combat.skill1 === 'Explosive Wave' || combat.skill2 === 'Explosive Wave') strengths.push('Exp. Wave')
  }

  const range = topForm.dp - char.forms[0].dp
  if (range >= 3) strengths.push(`+${range} DP chain`)

  return strengths.slice(0, 4)
}

function getCounterTraits(char) {
  const tips = []
  const traits = new Set()
  for (const f of char.forms) for (const t of f.traits) traits.add(t)
  const topForm = char.forms[char.forms.length - 1]

  if (traits.has('Instant Spark')) tips.push('Use Dodge Skill or bait the Spark')
  if (traits.has('Dodge Skill')) tips.push('Explosive Wave punishes Dodge Skill')
  if (traits.has('Unblockable Ultimate')) tips.push('Need Instant Spark to dodge the ult')
  if (topForm.dp > SUPER_ARMOUR_DP) tips.push('Match their DP to negate super armour')
  if (traits.has('Health Regeneration')) tips.push('Apply pressure — don\'t let them regen')
  if (!traits.has('Dodge Skill')) tips.push('Rush moves are effective')

  return tips.slice(0, 3)
}

export default function SinglesMeta() {
  const [detailChar, setDetailChar] = useState(null)

  const singlesIdx = tierLists.findIndex(tl => tl.name === 'Singles')
  const listIdx = singlesIdx >= 0 ? singlesIdx : 0
  const list = tierLists[listIdx]

  const tiers = useMemo(() => {
    if (!list) return []
    return list.tiers.filter(t => t.tier === 'Z' || t.tier === 'S' || t.tier === 'A').map(t => ({
      ...t,
      chars: t.characters.map(id => charactersById[id]).filter(Boolean).map(c => ({
        char: c,
        strengths: getKeyStrengths(c),
        counters: getCounterTraits(c),
        topDp: c.forms[c.forms.length - 1].dp,
      }))
    }))
  }, [list])

  const threatCount = tiers.reduce((s, t) => s + t.chars.length, 0)

  const traitFreq = useMemo(() => {
    const freq = {}
    for (const t of tiers) {
      for (const { char } of t.chars) {
        for (const f of char.forms) {
          for (const trait of f.traits) {
            freq[trait] = (freq[trait] || 0) + 1
          }
        }
      }
    }
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [tiers])

  return (
    <div className="smeta">
      <p className="smeta-intro">
        What you'll face in ranked singles. {threatCount} top-tier characters and how to beat them.
      </p>

      <div className="smeta-traits">
        <h3 className="smeta-section">Most Common Traits in Meta</h3>
        <div className="smeta-trait-list">
          {traitFreq.map(([trait, count]) => (
            <div key={trait} className="smeta-trait">
              <span className="smeta-trait__name">{trait}</span>
              <div className="smeta-trait__bar">
                <div className="smeta-trait__fill" style={{ width: `${(count / threatCount) * 100}%` }} />
              </div>
              <span className="smeta-trait__count">{count}/{threatCount}</span>
            </div>
          ))}
        </div>
      </div>

      {tiers.map(t => (
        <div key={t.tier} className="smeta-tier">
          <h3 className="smeta-section">
            <span className={'smeta-tier-badge smeta-tier-badge--' + t.tier.toLowerCase()}>{t.tier}</span>
            Tier ({t.chars.length} fighters)
          </h3>
          <div className="smeta-cards">
            {t.chars.map(({ char, strengths, counters, topDp }) => (
              <button key={char.id} className="smeta-card" type="button" onClick={() => setDetailChar(char)}>
                <div className="smeta-card__top">
                  {char.forms[0]?.image ? (
                    <img className="smeta-card__img" src={char.forms[0].image} alt="" />
                  ) : (
                    <div className="smeta-card__ph" style={{ background: char.color }}>{char.name[0]}</div>
                  )}
                  <div className="smeta-card__info">
                    <div className="smeta-card__name">{char.name}</div>
                    <div className="smeta-card__dp">{topDp} DP</div>
                    <div className="smeta-card__strengths">
                      {strengths.map(s => <span key={s} className="smeta-strength">{s}</span>)}
                    </div>
                  </div>
                </div>
                <div className="smeta-card__counters">
                  <span className="smeta-card__counter-label">How to beat:</span>
                  {counters.map((c, i) => <span key={i} className="smeta-counter-tip">{c}</span>)}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {detailChar && <CharacterDetail character={detailChar} onClose={() => setDetailChar(null)} />}
    </div>
  )
}

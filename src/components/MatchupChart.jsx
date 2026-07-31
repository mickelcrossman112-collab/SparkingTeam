import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'
import { getForm } from '../utils/dp.js'
import { tierLists } from '../data/tierList.js'
import { RANKED_META } from '../data/counterStrategies.js'
import CharacterDetail from './CharacterDetail.jsx'

const GOOD_TRAITS = ['Instant Spark', 'Dodge Skill', 'Unblockable Ultimate', 'Health Regeneration']
const GOOD_SKILLS = ['Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage', 'Full Power', 'Super Explosive Wave']

function getCharTraitsAndSkills(char) {
  const traits = new Set()
  const skills = new Set()
  let bestDp = 0
  let peakHp = 0
  let peakMelee = 0
  for (const form of char.forms) {
    for (const t of form.traits) traits.add(t)
    if (form.dp > bestDp) bestDp = form.dp
    if (form.health > peakHp) peakHp = form.health
    const combat = getCombatData(char.name, form.form)
    if (combat) {
      if (combat.skill1) skills.add(combat.skill1)
      if (combat.skill2) skills.add(combat.skill2)
      if (combat.meleeDmg > peakMelee) peakMelee = combat.meleeDmg
    }
  }
  return { traits, skills, bestDp, peakHp, peakMelee }
}

function scoreMatchup(myChar, myForm, enemyChar) {
  const my = getCharTraitsAndSkills(myChar)
  const enemy = getCharTraitsAndSkills(enemyChar)
  let score = 0

  if (enemy.traits.has('Instant Spark') && my.traits.has('Dodge Skill')) score += 2
  if (enemy.traits.has('Dodge Skill') && my.skills.has('Explosive Wave')) score += 2
  if (enemy.traits.has('Health Regeneration') && my.peakMelee > 4000) score += 1
  if (!enemy.traits.has('Dodge Skill') && my.peakMelee > 4000) score += 1
  if (!enemy.traits.has('Instant Spark') && my.traits.has('Unblockable Ultimate')) score += 2

  if (enemy.traits.has('Instant Spark') && !my.traits.has('Dodge Skill')) score -= 2
  if (enemy.traits.has('Dodge Skill') && !my.skills.has('Explosive Wave')) score -= 1
  if (enemy.traits.has('Unblockable Ultimate') && !my.traits.has('Instant Spark')) score -= 2
  if (enemy.traits.has('Health Regeneration')) score -= 1

  if (enemy.bestDp > RANKED_META.superArmourThreshold && my.bestDp <= RANKED_META.superArmourThreshold) score -= 4
  if (my.bestDp > RANKED_META.superArmourThreshold && enemy.bestDp <= RANKED_META.superArmourThreshold) score += 2

  const dpDiff = my.bestDp - enemy.bestDp
  if (dpDiff >= 2) score += 1
  if (dpDiff <= -2) score -= 1
  if (dpDiff <= -4) score -= 2

  if (my.peakHp < enemy.peakHp - 5000) score -= 1
  if (enemy.peakMelee > my.peakMelee + 2000) score -= 1

  let skillBonus = 0
  for (const s of my.skills) {
    if (GOOD_SKILLS.includes(s)) skillBonus += 0.5
  }
  score += Math.min(skillBonus, 1.5)

  return score
}

function getMetaThreats(listIndex) {
  const tl = tierLists[listIndex]
  if (!tl) return []
  const threats = []
  for (const t of tl.tiers) {
    if (t.tier === 'Z' || t.tier === 'S' || t.tier === 'A') {
      for (const id of t.characters) {
        const char = charactersById[id]
        if (char && !threats.find(th => th.char.id === id)) {
          threats.push({ char, tier: t.tier })
        }
      }
    }
  }
  return threats
}

function getRating(score) {
  if (score >= 7) return { label: 'Easy', cls: 'mu-easy', icon: '++' }
  if (score >= 4) return { label: 'Favoured', cls: 'mu-fav', icon: '+' }
  if (score >= 1) return { label: 'Even', cls: 'mu-even', icon: '=' }
  if (score >= -2) return { label: 'Tough', cls: 'mu-tough', icon: '-' }
  return { label: 'Hard', cls: 'mu-hard', icon: '--' }
}

export default function MatchupChart({ team }) {
  const [listIndex, setListIndex] = useState(0)
  const [detailChar, setDetailChar] = useState(null)
  const [filter, setFilter] = useState('all')

  const teamRows = team
    .map(item => {
      const char = charactersById[item.characterId]
      const form = getForm(item)
      return char && form ? { char, form, item } : null
    })
    .filter(Boolean)

  const threats = useMemo(() => getMetaThreats(listIndex), [listIndex])

  const analysis = useMemo(() => {
    if (teamRows.length === 0 || threats.length === 0) return null

    const results = threats.map(({ char: enemy, tier }) => {
      let bestScore = -Infinity
      let bestChar = null
      let bestForm = null
      const scores = []

      for (const row of teamRows) {
        const s = scoreMatchup(row.char, row.form, enemy)
        scores.push({ char: row.char, form: row.form, score: s })
        if (s > bestScore) {
          bestScore = s
          bestChar = row.char
          bestForm = row.form
        }
      }

      const enemyData = getCharTraitsAndSkills(enemy)
      const bestEnemyForm = enemy.forms.reduce((a, b) => b.dp > a.dp ? b : a, enemy.forms[0])
      const rating = getRating(bestScore)

      return {
        enemy,
        enemyData,
        bestEnemyForm,
        tier,
        bestScore,
        bestChar,
        bestForm,
        rating,
        scores,
      }
    })

    results.sort((a, b) => a.bestScore - b.bestScore)

    const covered = results.filter(r => r.bestScore >= 4).length
    const even = results.filter(r => r.bestScore >= 1 && r.bestScore < 4).length
    const struggling = results.filter(r => r.bestScore < 1).length

    return { results, covered, even, struggling, total: results.length }
  }, [teamRows, threats])

  const teamSummary = useMemo(() => {
    if (teamRows.length === 0) return null
    const traits = new Set()
    const skills = new Set()
    let totalDp = 0
    let highDpCount = 0
    let lowDpCount = 0

    for (const row of teamRows) {
      totalDp += row.form.dp
      if (row.form.dp > RANKED_META.superArmourThreshold) highDpCount++
      if (row.form.dp <= 4) lowDpCount++
      for (const t of row.form.traits) traits.add(t)
      const combat = getCombatData(row.char.name, row.form.form)
      if (combat) {
        if (combat.skill1) skills.add(combat.skill1)
        if (combat.skill2) skills.add(combat.skill2)
      }
    }

    const gaps = []
    if (!traits.has('Dodge Skill')) gaps.push('No Dodge Skill — vulnerable to rushdown and combos')
    if (!traits.has('Instant Spark')) gaps.push('No Instant Spark — cannot escape enemy combos')
    if (!traits.has('Unblockable Ultimate')) gaps.push('No Unblockable Ultimate — tanky enemies can wall you')
    if (highDpCount === 0 && teamRows.length > 0) gaps.push('No characters above 7 DP — vulnerable to super armour')
    if (lowDpCount === teamRows.length && teamRows.length > 1) gaps.push('All low DP — high DP enemies will have super armour against your entire team')
    if (!skills.has('Explosive Wave') && !skills.has('Super Explosive Wave')) gaps.push('No Explosive Wave — weak against Dodge Skill abusers')
    if (!skills.has('Afterimage Strike') && !skills.has('Wild Sense')) gaps.push('No evasion skills (Afterimage/Wild Sense) — less survivability')

    return { traits, skills, totalDp, highDpCount, lowDpCount, gaps }
  }, [teamRows])

  const filteredResults = analysis?.results.filter(r => {
    if (filter === 'all') return true
    if (filter === 'struggling') return r.bestScore < 1
    if (filter === 'even') return r.bestScore >= 1 && r.bestScore < 4
    if (filter === 'covered') return r.bestScore >= 4
    return true
  }) ?? []

  return (
    <div className="mu-page">
      <div className="mu-header">
        <div className="mu-list-switch">
          {tierLists.map((tl, i) => (
            <button
              key={tl.name}
              type="button"
              className={i === listIndex ? 'rankings-cat-btn rankings-cat-btn--active' : 'rankings-cat-btn'}
              onClick={() => setListIndex(i)}
            >
              {tl.name} Meta
            </button>
          ))}
        </div>
      </div>

      {teamRows.length === 0 ? (
        <div className="mu-empty">
          <div className="mu-empty__icon">vs</div>
          <h3 className="mu-empty__title">Team Matchup Analysis</h3>
          <p className="mu-empty__text">Add fighters to your team to see how you match up against the meta.</p>
          <p className="mu-empty__hint">Go to Team Builder, add some characters, then come back here.</p>
        </div>
      ) : (
        <>
          {teamSummary && (
            <div className="mu-summary">
              <div className="mu-summary__team">
                <h4 className="mu-summary__label">Your Team</h4>
                <div className="mu-summary__fighters">
                  {teamRows.map(r => (
                    <div key={`${r.item.characterId}-${r.item.formName}`} className="mu-summary__fighter">
                      {r.form.image ? (
                        <img src={r.form.image} alt={r.char.name} />
                      ) : (
                        <div className="mu-summary__ph" style={{ background: r.char.color }}>{r.char.name[0]}</div>
                      )}
                      <div className="mu-summary__fighter-info">
                        <span className="mu-summary__fighter-name">{r.char.name}</span>
                        <span className="mu-summary__fighter-dp">{r.form.dp} DP</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mu-summary__traits">
                  {[...teamSummary.traits].filter(t => GOOD_TRAITS.includes(t)).map(t => (
                    <span key={t} className="cg-tag cg-tag--trait">{t}</span>
                  ))}
                  {[...teamSummary.skills].filter(s => GOOD_SKILLS.includes(s)).map(s => (
                    <span key={s} className="cg-tag cg-tag--skill">{s}</span>
                  ))}
                </div>
              </div>

              {teamSummary.gaps.length > 0 && (
                <div className="mu-gaps">
                  <h4 className="mu-gaps__label">Team Gaps</h4>
                  <ul className="mu-gaps__list">
                    {teamSummary.gaps.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {analysis && (
            <>
              <div className="mu-score-bar">
                <button
                  className={`mu-score-pill mu-score-pill--green${filter === 'covered' ? ' mu-score-pill--active' : ''}`}
                  type="button" onClick={() => setFilter(filter === 'covered' ? 'all' : 'covered')}
                >
                  Covered {analysis.covered}
                </button>
                <button
                  className={`mu-score-pill mu-score-pill--yellow${filter === 'even' ? ' mu-score-pill--active' : ''}`}
                  type="button" onClick={() => setFilter(filter === 'even' ? 'all' : 'even')}
                >
                  Even {analysis.even}
                </button>
                <button
                  className={`mu-score-pill mu-score-pill--red${filter === 'struggling' ? ' mu-score-pill--active' : ''}`}
                  type="button" onClick={() => setFilter(filter === 'struggling' ? 'all' : 'struggling')}
                >
                  Struggling {analysis.struggling}
                </button>
                <span className="mu-score-total">/ {analysis.total} meta threats</span>
              </div>

              <div className="mu-threats">
                {filteredResults.map(r => (
                  <div key={r.enemy.id} className={`mu-threat ${r.rating.cls}`}>
                    <div className="mu-threat__enemy" onClick={() => setDetailChar(r.enemy)}>
                      {r.bestEnemyForm.image ? (
                        <img className="mu-threat__img" src={r.bestEnemyForm.image} alt={r.enemy.name} />
                      ) : (
                        <div className="mu-threat__ph" style={{ background: r.enemy.color }}>{r.enemy.name[0]}</div>
                      )}
                      <div className="mu-threat__info">
                        <span className="mu-threat__name">{r.enemy.name}</span>
                        <span className="mu-threat__dp">{r.enemyData.bestDp} DP</span>
                        <span className={`mu-threat__tier mu-threat__tier--${r.tier.toLowerCase()}`}>{r.tier}</span>
                      </div>
                    </div>

                    <div className="mu-threat__traits">
                      {[...r.enemyData.traits].filter(t => GOOD_TRAITS.includes(t)).map(t => (
                        <span key={t} className="mu-threat__trait">{t}</span>
                      ))}
                      {r.enemyData.bestDp > RANKED_META.superArmourThreshold && (
                        <span className="mu-threat__trait mu-threat__trait--armour">Super Armour</span>
                      )}
                    </div>

                    <div className={`mu-threat__verdict ${r.rating.cls}`}>
                      <span className="mu-threat__icon">{r.rating.icon}</span>
                      <span className="mu-threat__label">{r.rating.label}</span>
                    </div>

                    <div className="mu-threat__answer">
                      <span className="mu-threat__answer-label">Best answer:</span>
                      {r.bestForm?.image ? (
                        <img className="mu-threat__answer-img" src={r.bestForm.image} alt={r.bestChar?.name} />
                      ) : (
                        <div className="mu-threat__answer-ph" style={{ background: r.bestChar?.color }}>{r.bestChar?.name[0]}</div>
                      )}
                      <span className="mu-threat__answer-name">{r.bestChar?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {detailChar && (
        <CharacterDetail character={detailChar} onClose={() => setDetailChar(null)} />
      )}
    </div>
  )
}

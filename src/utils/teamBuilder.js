import { characters, DP_LIMIT, MAX_TEAM } from '../data/characters.js'
import { combatData } from '../data/combatData.js'

const GOOD_SKILLS = [
  'Wild Sense', 'Explosive Wave', 'Afterimage Strike', 'Afterimage',
  'Full Power', 'Full Power Charge', 'Super Explosive Wave',
]

const GOOD_TRAITS = ['Instant Spark', 'Dodge Skill', 'Health Regeneration', 'Unblockable Ultimate']

function getCombat(name, form) {
  return combatData[name]?.[form] || null
}

function scoreForm(char, form) {
  let score = 0
  const combat = getCombat(char.name, form.form)

  // Stat scoring
  score += form.health / 5000
  score += form.kiBars * 0.5
  score += form.skillPoints * 0.3

  // Trait scoring
  for (const t of form.traits) {
    if (t === 'Instant Spark') score += 4
    else if (GOOD_TRAITS.includes(t)) score += 2
  }

  // Combat data skill scoring
  if (combat) {
    if (GOOD_SKILLS.includes(combat.skill1)) score += 3
    if (GOOD_SKILLS.includes(combat.skill2)) score += 3
    score += combat.meleeDmg / 1000
    if (combat.ultimate?.damage) score += combat.ultimate.damage / 5000
    if (combat.defense) score += combat.defense / 500
  }

  return score
}

function tagSynergyScore(team, newTags) {
  let bonus = 0
  const existing = {}
  for (const item of team) {
    const char = characters.find((c) => c.id === item.characterId)
    if (!char) continue
    const form = char.forms.find((f) => f.form === item.formName)
    if (!form) continue
    for (const t of form.tags || []) {
      existing[t] = (existing[t] || 0) + 1
    }
  }
  for (const t of newTags) {
    if (existing[t]) bonus += existing[t] * 2
  }
  return bonus
}

function pickBestForm(char, budget, team, preferHigh) {
  const affordable = char.forms.filter((f) => f.dp <= budget)
  if (affordable.length === 0) return null

  let best = null
  let bestScore = -Infinity
  for (const f of affordable) {
    if (preferHigh && f.dp < budget * 0.6 && affordable.some((o) => o.dp > f.dp)) continue
    let s = scoreForm(char, f)
    s += tagSynergyScore(team, f.tags || [])
    if (preferHigh) s += f.dp * 1.5
    if (s > bestScore) {
      bestScore = s
      best = f
    }
  }
  return best || affordable[affordable.length - 1]
}

function buildTeam(strategy) {
  const team = []
  let budget = DP_LIMIT
  const usedIds = new Set()

  const targetSize = strategy === 'rush' ? 5
    : strategy === 'power' ? 2
    : Math.random() < 0.5 ? 3 : 4

  const preferHigh = strategy === 'power'

  const pool = characters.map((c) => {
    const bestForm = c.forms.reduce((best, f) => scoreForm(c, f) > scoreForm(c, best) ? f : best, c.forms[0])
    return { char: c, baseScore: scoreForm(c, bestForm) }
  }).sort((a, b) => b.baseScore - a.baseScore)

  let guard = 0
  while (guard++ < 200 && team.length < targetSize && budget >= 1) {
    const candidates = pool.filter((p) => {
      if (usedIds.has(p.char.id)) return false
      const cheapest = Math.min(...p.char.forms.map((f) => f.dp))
      if (cheapest > budget) return false
      const slotsLeft = targetSize - team.length
      if (slotsLeft > 1) {
        const reservePerSlot = strategy === 'rush' ? 2 : 3
        if (cheapest > budget - (slotsLeft - 1) * reservePerSlot) return false
      }
      return true
    })

    if (candidates.length === 0) break

    // Weighted random selection favoring higher scores + synergy
    const scored = candidates.map((c) => {
      const form = pickBestForm(c.char, budget, team, preferHigh)
      if (!form) return null
      let total = scoreForm(c.char, form) + tagSynergyScore(team, form.tags || [])
      if (preferHigh) total += form.dp * 2
      return { char: c.char, form, total }
    }).filter(Boolean)

    if (scored.length === 0) break

    scored.sort((a, b) => b.total - a.total)

    // Pick from top candidates with some randomness
    const topN = Math.min(scored.length, strategy === 'power' ? 3 : 5)
    const pick = scored[Math.floor(Math.random() * topN)]

    team.push({ characterId: pick.char.id, formName: pick.form.form })
    usedIds.add(pick.char.id)
    budget -= pick.form.dp
  }

  // Fill remaining budget if we have slots
  while (team.length < MAX_TEAM && budget >= 1) {
    const fillers = pool.filter((p) => {
      if (usedIds.has(p.char.id)) return false
      return p.char.forms.some((f) => f.dp <= budget)
    })
    if (fillers.length === 0) break

    const scored = fillers.map((c) => {
      const form = pickBestForm(c.char, budget, team, false)
      if (!form) return null
      return { char: c.char, form, total: scoreForm(c.char, form) + tagSynergyScore(team, form.tags || []) }
    }).filter(Boolean)

    if (scored.length === 0) break
    scored.sort((a, b) => b.total - a.total)
    const pick = scored[Math.floor(Math.random() * Math.min(scored.length, 5))]
    team.push({ characterId: pick.char.id, formName: pick.form.form })
    usedIds.add(pick.char.id)
    budget -= pick.form.dp
  }

  return team
}

function computeSynergies(team) {
  const tagCounts = {}
  for (const item of team) {
    const char = characters.find((c) => c.id === item.characterId)
    if (!char) continue
    const form = char.forms.find((f) => f.form === item.formName)
    if (!form) continue
    for (const t of form.tags || []) {
      tagCounts[t] = (tagCounts[t] || 0) + 1
    }
  }
  return Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))
}

export function generateSmartTeam() {
  const strategies = ['rush', 'power', 'balanced']
  const strategy = strategies[Math.floor(Math.random() * strategies.length)]

  let bestTeam = null
  let bestSynergyScore = -1

  // Generate a few candidates and pick the one with best synergy
  for (let i = 0; i < 5; i++) {
    const team = buildTeam(strategy)
    const synergies = computeSynergies(team)
    const synergyScore = synergies.reduce((sum, s) => sum + s.count, 0)
    if (synergyScore > bestSynergyScore) {
      bestSynergyScore = synergyScore
      bestTeam = team
    }
  }

  return { team: bestTeam || [], strategy }
}

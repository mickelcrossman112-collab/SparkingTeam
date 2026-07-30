import { DP_LIMIT, MAX_TEAM, charactersById } from '../data/characters.js'

export { DP_LIMIT, MAX_TEAM }

// Is the team already at the maximum number of fighters?
export function isTeamFull(team) {
  return team.length >= MAX_TEAM
}

// Resolve a team item ({ characterId, formName }) to its form object.
export function getForm(item) {
  const character = charactersById[item.characterId]
  if (!character) return null
  return character.forms.find((f) => f.form === item.formName) || null
}

// Total DP currently used by a team.
export function teamDpTotal(team) {
  return team.reduce((sum, item) => {
    const form = getForm(item)
    return sum + (form ? form.dp : 0)
  }, 0)
}

// DP still available.
export function remainingDp(team) {
  return DP_LIMIT - teamDpTotal(team)
}

// Can a form of the given DP cost be added without breaking the budget?
export function canAdd(team, dpCost) {
  return teamDpTotal(team) + dpCost <= DP_LIMIT
}

// Cheapest form DP for a character — used for the grid badge and "fits" checks.
export function cheapestDp(character) {
  return Math.min(...character.forms.map((f) => f.dp))
}

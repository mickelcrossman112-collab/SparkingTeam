import { charactersById } from './characters.js'
import { getForm, teamDpTotal } from '../utils/dp.js'

export const ACHIEVEMENTS = [
  { id: 'first-save', name: 'First Squad', icon: '🏅', desc: 'Save your first team', tier: 'bronze' },
  { id: 'five-saves', name: 'Collector', icon: '📦', desc: 'Save 5 teams', tier: 'silver' },
  { id: 'ten-saves', name: 'Team Hoarder', icon: '🏆', desc: 'Save 10 teams', tier: 'gold' },
  { id: 'full-house', name: 'Full House', icon: '🖐️', desc: 'Build a 5-member team', tier: 'bronze' },
  { id: 'solo-warrior', name: 'One-Man Army', icon: '💪', desc: 'Build a team with only 1 fighter', tier: 'silver' },
  { id: 'max-power', name: 'Max Power', icon: '⚡', desc: 'Use exactly 15/15 DP', tier: 'gold' },
  { id: 'budget-king', name: 'Budget King', icon: '💰', desc: 'Build a team under 10 DP', tier: 'silver' },
  { id: 'pure-saiyan', name: 'Pure Saiyan', icon: '🐵', desc: 'Every member has the Saiyans tag', tier: 'silver' },
  { id: 'fusion-master', name: 'Fusion Master', icon: '🔗', desc: '3+ Fusion Warriors on one team', tier: 'silver' },
  { id: 'god-squad', name: 'God Squad', icon: '👼', desc: '3+ God Ki fighters', tier: 'gold' },
  { id: 'earthling-pride', name: 'Earthling Pride', icon: '🌍', desc: 'Every member is an Earthling', tier: 'silver' },
  { id: 'girl-power', name: 'Girl Power', icon: '👑', desc: 'Every member has the Girls tag', tier: 'gold' },
  { id: 'gt-gang', name: 'GT Gang', icon: '🐉', desc: '3+ GT fighters', tier: 'silver' },
  { id: 'villain-squad', name: "Villain's Paradise", icon: '😈', desc: '3+ Powerful Opponents', tier: 'gold' },
  { id: 'super-saiyan', name: 'Super Saiyan Squad', icon: '🔥', desc: '3+ Super Saiyans', tier: 'silver' },
  { id: 'regen-station', name: 'Regen Station', icon: '💚', desc: '3+ Regeneration fighters', tier: 'silver' },
  { id: 'movie-stars', name: 'Movie Stars', icon: '🎬', desc: '3+ from Sagas from the Movies', tier: 'silver' },
  { id: 'future-sight', name: 'Future Sight', icon: '🔮', desc: '3+ Future fighters', tier: 'silver' },
  { id: 'ten-faves', name: 'Fan Club', icon: '⭐', desc: 'Favorite 10 characters', tier: 'bronze' },
  { id: 'synergy-king', name: 'Synergy King', icon: '🧬', desc: 'Build a team with 4+ synergies', tier: 'gold' },
]

const TIER_ORDER = { bronze: 0, silver: 1, gold: 2 }
export const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])

function getTeamTags(team) {
  const memberTags = []
  for (const item of team) {
    const form = getForm(item)
    if (form) memberTags.push(new Set(form.tags || []))
  }
  return memberTags
}

function countTag(team, tag) {
  const tags = getTeamTags(team)
  return tags.filter((s) => s.has(tag)).length
}

function allHaveTag(team, tag) {
  if (team.length === 0) return false
  const tags = getTeamTags(team)
  return tags.every((s) => s.has(tag))
}

function countEpisode(team, ep) {
  let count = 0
  for (const item of team) {
    const form = getForm(item)
    if (form && (form.episodes || []).includes(ep)) count++
  }
  return count
}

function countSynergies(team) {
  const tagCounts = {}
  for (const item of team) {
    const form = getForm(item)
    if (!form) continue
    for (const t of form.tags || []) tagCounts[t] = (tagCounts[t] || 0) + 1
  }
  return Object.values(tagCounts).filter((c) => c >= 2).length
}

export function checkAchievements(team, savedTeams, favorites) {
  const earned = new Set()
  const dp = teamDpTotal(team)

  if (savedTeams.length >= 1) earned.add('first-save')
  if (savedTeams.length >= 5) earned.add('five-saves')
  if (savedTeams.length >= 10) earned.add('ten-saves')

  if (team.length === 5) earned.add('full-house')
  if (team.length === 1) earned.add('solo-warrior')
  if (team.length > 0 && dp === 15) earned.add('max-power')
  if (team.length > 0 && dp < 10) earned.add('budget-king')

  if (allHaveTag(team, 'Saiyans')) earned.add('pure-saiyan')
  if (allHaveTag(team, 'Earthling')) earned.add('earthling-pride')
  if (allHaveTag(team, 'Girls')) earned.add('girl-power')

  if (countTag(team, 'Fusion Warrior') >= 3) earned.add('fusion-master')
  if (countTag(team, 'God Ki') >= 3) earned.add('god-squad')
  if (countTag(team, 'GT') >= 3) earned.add('gt-gang')
  if (countTag(team, 'Powerful Opponent') >= 3) earned.add('villain-squad')
  if (countTag(team, 'Super Saiyans') >= 3) earned.add('super-saiyan')
  if (countTag(team, 'Regeneration') >= 3) earned.add('regen-station')
  if (countTag(team, 'Future') >= 3) earned.add('future-sight')

  if (countEpisode(team, 'Sagas from the Movies') >= 3) earned.add('movie-stars')

  if ((favorites || []).length >= 10) earned.add('ten-faves')
  if (countSynergies(team) >= 4) earned.add('synergy-king')

  for (const saved of savedTeams) {
    const sdp = teamDpTotal(saved.team)
    if (saved.team.length === 5) earned.add('full-house')
    if (saved.team.length === 1) earned.add('solo-warrior')
    if (sdp === 15) earned.add('max-power')
    if (sdp > 0 && sdp < 10) earned.add('budget-king')
    if (allHaveTag(saved.team, 'Saiyans')) earned.add('pure-saiyan')
    if (allHaveTag(saved.team, 'Earthling')) earned.add('earthling-pride')
    if (allHaveTag(saved.team, 'Girls')) earned.add('girl-power')
    if (countTag(saved.team, 'Fusion Warrior') >= 3) earned.add('fusion-master')
    if (countTag(saved.team, 'God Ki') >= 3) earned.add('god-squad')
    if (countTag(saved.team, 'GT') >= 3) earned.add('gt-gang')
    if (countTag(saved.team, 'Powerful Opponent') >= 3) earned.add('villain-squad')
    if (countTag(saved.team, 'Super Saiyans') >= 3) earned.add('super-saiyan')
    if (countTag(saved.team, 'Regeneration') >= 3) earned.add('regen-station')
    if (countTag(saved.team, 'Future') >= 3) earned.add('future-sight')
    if (countEpisode(saved.team, 'Sagas from the Movies') >= 3) earned.add('movie-stars')
    if (countSynergies(saved.team) >= 4) earned.add('synergy-king')
  }

  return earned
}

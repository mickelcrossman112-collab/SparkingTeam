import { charactersById } from '../data/characters.js'

// A team is encoded as a compact string so it fits comfortably in a URL:
//   characterId~formName , characterId~formName , ...
// characterId and formName are URI-component encoded to survive special chars.

export function encodeTeam(team) {
  return team
    .map((item) => `${encodeURIComponent(item.characterId)}~${encodeURIComponent(item.formName)}`)
    .join(',')
}

export function decodeTeam(str) {
  if (!str) return []
  return str
    .split(',')
    .map((chunk) => {
      const [idPart, formPart] = chunk.split('~')
      if (!idPart || !formPart) return null
      const characterId = decodeURIComponent(idPart)
      const formName = decodeURIComponent(formPart)
      // Drop anything that no longer exists in the roster.
      const character = charactersById[characterId]
      if (!character || !character.forms.some((f) => f.form === formName)) return null
      return { characterId, formName }
    })
    .filter(Boolean)
}

// Build a full shareable URL for the current team.
export function buildShareUrl(team) {
  const url = new URL(window.location.href)
  url.searchParams.set('team', encodeTeam(team))
  return url.toString()
}

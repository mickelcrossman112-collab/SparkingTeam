import { useEffect, useState } from 'react'
import { decodeTeam, encodeTeam } from '../utils/share.js'

// Team state that stays in sync with the ?team= URL param, so any team is a
// shareable link and opening a link restores that exact team.
export function useShareableTeam() {
  const [team, setTeam] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return decodeTeam(params.get('team'))
  })

  // Reflect team changes back into the URL (without adding history entries).
  useEffect(() => {
    const url = new URL(window.location.href)
    if (team.length > 0) {
      url.searchParams.set('team', encodeTeam(team))
    } else {
      url.searchParams.delete('team')
    }
    window.history.replaceState(null, '', url)
  }, [team])

  return [team, setTeam]
}

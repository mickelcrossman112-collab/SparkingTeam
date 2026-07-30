import { useMemo, useState } from 'react'
import { characters, DP_LIMIT, MAX_TEAM } from './data/characters.js'
import { cheapestDp, remainingDp, isTeamFull } from './utils/dp.js'
import { buildShareUrl } from './utils/share.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useShareableTeam } from './hooks/useShareableTeam.js'
import CharacterData from './components/CharacterData.jsx'
import CharacterRankings from './components/CharacterRankings.jsx'
import TeamBar from './components/TeamBar.jsx'
import FilterBar from './components/FilterBar.jsx'
import CharacterGrid from './components/CharacterGrid.jsx'
import FormPicker from './components/FormPicker.jsx'
import ActionBar from './components/ActionBar.jsx'
import SavedTeams from './components/SavedTeams.jsx'
import MatchupChart from './components/MatchupChart.jsx'

export default function App() {
  const [team, setTeam] = useShareableTeam()
  const [savedTeams, setSavedTeams] = useLocalStorage('szTeams', [])

  const [view, setView] = useState('builder')
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [episode, setEpisode] = useState('')
  const [maxDp, setMaxDp] = useState('')
  const [fitsOnly, setFitsOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [picking, setPicking] = useState(null) // character whose forms are open
  const [teamName, setTeamName] = useState('')
  const [shareLabel, setShareLabel] = useState(false)

  const resetFilters = () => {
    setSearch('')
    setTag('')
    setEpisode('')
    setMaxDp('')
    setFitsOnly(false)
  }

  const remaining = remainingDp(team)
  const full = isTeamFull(team)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const dpCap = maxDp ? Number(maxDp) : Infinity
    return characters.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false
      if (tag && !c.forms.some((f) => f.tags?.includes(tag))) return false
      if (episode && !c.forms.some((f) => f.episodes?.includes(episode))) return false
      if (cheapestDp(c) > dpCap) return false
      if (fitsOnly && cheapestDp(c) > remaining) return false
      return true
    })
  }, [search, tag, episode, maxDp, fitsOnly, remaining])

  // A card is unclickable if the team is full, or even its cheapest form
  // can't fit the DP still available given who's already on the team.
  const isDisabled = (character) => full || cheapestDp(character) > remaining

  const addForm = (character, form) => {
    // Guard again at add time (form picker may show forms near the limit).
    if (full || form.dp > remaining) return
    setTeam((t) => [...t, { characterId: character.id, formName: form.form }])
    setPicking(null)
  }

  const removeAt = (index) => setTeam((t) => t.filter((_, i) => i !== index))

  const clearTeam = () => setTeam([])

  const saveTeam = () => {
    if (team.length === 0) return
    const name = teamName.trim() || `Squad ${savedTeams.length + 1}`
    setSavedTeams((list) => [{ id: Date.now().toString(36), name, team }, ...list])
    setTeamName('')
  }

  const deleteSaved = (id) => setSavedTeams((list) => list.filter((s) => s.id !== id))

  const loadSaved = (savedTeam, name) => {
    setTeam(savedTeam)
    if (name) setTeamName(name)
  }

  const shareTeam = async () => {
    if (team.length === 0) return
    const url = buildShareUrl(team)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard blocked — the URL bar already holds the shareable link.
    }
    setShareLabel(true)
    setTimeout(() => setShareLabel(false), 2000)
  }

  // Random team: greedily add affordable fighters up to MAX_TEAM and the budget.
  const randomTeam = () => {
    const pool = [...characters]
    const next = []
    let budget = DP_LIMIT
    const cheapestOverall = Math.min(...characters.map(cheapestDp))
    let guard = 0
    while (guard++ < 100 && next.length < MAX_TEAM && budget >= cheapestOverall) {
      const affordable = pool.filter((c) => cheapestDp(c) <= budget)
      if (affordable.length === 0) break
      const c = affordable[Math.floor(Math.random() * affordable.length)]
      const forms = c.forms.filter((f) => f.dp <= budget)
      const form = forms[Math.floor(Math.random() * forms.length)]
      next.push({ characterId: c.id, formName: form.form })
      budget -= form.dp
      pool.splice(pool.indexOf(c), 1)
    }
    setTeam(next)
  }

  return (
    <div className="app">
      <TeamBar team={team} onRemove={removeAt} />

      <main className="main">
        <div className="brand">
          <h1>
            Sparking! <span className="accent">Zero</span>{' '}
            {view === 'builder' ? 'Team Builder' : view === 'data' ? 'Character Data' : view === 'matchups' ? 'Matchups' : 'Rankings'}
          </h1>
          <nav className="view-tabs">
            <button
              className={view === 'builder' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('builder')}
              type="button"
            >
              Team Builder
            </button>
            <button
              className={view === 'data' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('data')}
              type="button"
            >
              Character Data
            </button>
            <button
              className={view === 'matchups' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('matchups')}
              type="button"
            >
              Matchups
            </button>
            <button
              className={view === 'rankings' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('rankings')}
              type="button"
            >
              Rankings
            </button>
          </nav>
        </div>

        {view === 'builder' ? (
          <>
            {showFilters && (
              <FilterBar
                search={search}
                onSearch={setSearch}
                tag={tag}
                onTag={setTag}
                episode={episode}
                onEpisode={setEpisode}
                maxDp={maxDp}
                onMaxDp={setMaxDp}
                fitsOnly={fitsOnly}
                onFitsOnly={setFitsOnly}
                onReset={resetFilters}
                resultCount={filtered.length}
              />
            )}

            <CharacterGrid characters={filtered} isDisabled={isDisabled} onPick={setPicking} />

            <SavedTeams teams={savedTeams} onLoad={loadSaved} onDelete={deleteSaved} />
          </>
        ) : view === 'matchups' ? (
          <MatchupChart team={team} />
        ) : view === 'data' ? (
          <CharacterData />
        ) : (
          <CharacterRankings />
        )}
      </main>

      <footer className="footer">
        <p>
          Fan-made team builder for Dragon Ball: Sparking! Zero. Not affiliated with Bandai Namco.
          DP values are starter estimates — verify against the game.
        </p>
      </footer>

      <ActionBar
        teamName={teamName}
        onTeamName={setTeamName}
        onRandom={randomTeam}
        onShare={shareTeam}
        onSave={saveTeam}
        onToggleFilters={() => setShowFilters((v) => !v)}
        filtersOpen={showFilters}
        canSave={team.length > 0}
        shareLabel={shareLabel}
      />

      {picking && (
        <FormPicker
          character={picking}
          remaining={remaining}
          onAdd={addForm}
          onClose={() => setPicking(null)}
        />
      )}
    </div>
  )
}

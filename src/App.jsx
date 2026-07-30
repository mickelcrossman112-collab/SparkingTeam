import { useMemo, useState } from 'react'
import { characters, DP_LIMIT, MAX_TEAM } from './data/characters.js'
import { cheapestDp, remainingDp, isTeamFull } from './utils/dp.js'
import { generateSmartTeam } from './utils/teamBuilder.js'
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
import TeamCompare from './components/TeamCompare.jsx'
import CounterPicks from './components/CounterPicks.jsx'

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
  const [teamNotes, setTeamNotes] = useState('')
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

  const reorderTeam = (fromIndex, toIndex) => {
    setTeam((t) => {
      const next = [...t]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const clearTeam = () => setTeam([])

  const saveTeam = () => {
    if (team.length === 0) return
    const name = teamName.trim() || `Squad ${savedTeams.length + 1}`
    const notes = teamNotes.trim()
    setSavedTeams((list) => [{ id: Date.now().toString(36), name, team, notes }, ...list])
    setTeamName('')
    setTeamNotes('')
  }

  const deleteSaved = (id) => setSavedTeams((list) => list.filter((s) => s.id !== id))

  const loadSaved = (savedTeam, name, notes) => {
    setTeam(savedTeam)
    if (name) setTeamName(name)
    if (notes) setTeamNotes(notes)
    setView('builder')
  }

  const updateSavedNotes = (id, notes) => {
    setSavedTeams((list) => list.map((s) => s.id === id ? { ...s, notes } : s))
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

  const randomTeam = () => {
    const { team: smartTeam } = generateSmartTeam()
    setTeam(smartTeam)
  }

  return (
    <div className="app">
      <TeamBar team={team} onRemove={removeAt} onReorder={reorderTeam} />

      <main className="main">
        <div className="brand">
          <h1>
            Sparking! <span className="accent">Zero</span>{' '}
            {view === 'builder' ? 'Team Builder' : view === 'teams' ? 'My Teams' : view === 'data' ? 'Character Data' : view === 'matchups' ? 'Matchups' : view === 'rankings' ? 'Rankings' : view === 'counter' ? 'Counter Picks' : 'Compare'}
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
              className={view === 'teams' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('teams')}
              type="button"
            >
              My Teams{savedTeams.length > 0 ? ` (${savedTeams.length})` : ''}
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
            <button
              className={view === 'counter' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('counter')}
              type="button"
            >
              Counter Picks
            </button>
            <button
              className={view === 'compare' ? 'view-tab view-tab--active' : 'view-tab'}
              onClick={() => setView('compare')}
              type="button"
            >
              Compare
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
          </>
        ) : view === 'teams' ? (
          <SavedTeams teams={savedTeams} onLoad={loadSaved} onDelete={deleteSaved} onUpdateNotes={updateSavedNotes} fullPage />
        ) : view === 'matchups' ? (
          <MatchupChart team={team} />
        ) : view === 'data' ? (
          <CharacterData />
        ) : view === 'rankings' ? (
          <CharacterRankings />
        ) : view === 'counter' ? (
          <CounterPicks team={team} />
        ) : (
          <TeamCompare teams={savedTeams} />
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
        teamNotes={teamNotes}
        onTeamNotes={setTeamNotes}
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

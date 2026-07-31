import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { characters, DP_LIMIT, MAX_TEAM } from './data/characters.js'
import { cheapestDp, remainingDp, isTeamFull } from './utils/dp.js'
import { generateSmartTeam } from './utils/teamBuilder.js'
import { buildShareUrl } from './utils/share.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useShareableTeam } from './hooks/useShareableTeam.js'
import { checkAchievements, ACHIEVEMENTS } from './data/achievements.js'
import { playAdd, playRemove, playSave, playBadge, playRandom, playPreset } from './utils/sounds.js'
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
import CounterGuide from './components/CounterGuide.jsx'
import News from './components/News.jsx'
import MetaDashboard from './components/MetaDashboard.jsx'
import BadgeNotification from './components/BadgeNotification.jsx'
import CharacterSpotlight from './components/CharacterSpotlight.jsx'
import PresetTeams from './components/PresetTeams.jsx'

const VIEW_LABELS = {
  builder: 'Team Builder',
  teams: 'My Teams',
  data: 'Character Data',
  matchups: 'Matchups',
  rankings: 'Rankings',
  counter: 'Counter Picks',
  guide: 'Counter Guide',
  compare: 'Compare',
  news: 'News',
  meta: 'Meta',
}

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
  const [picking, setPicking] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [teamNotes, setTeamNotes] = useState('')
  const [shareLabel, setShareLabel] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('szFavorites', [])
  const [seenBadges, setSeenBadges] = useLocalStorage('szSeenBadges', [])
  const [notifQueue, setNotifQueue] = useState([])
  const [showPresets, setShowPresets] = useState(false)

  const unlockedIds = useMemo(
    () => checkAchievements(team, savedTeams, favorites),
    [team, savedTeams, favorites]
  )

  const prevUnlockedRef = useRef(seenBadges)
  useEffect(() => {
    const prevSeen = new Set(prevUnlockedRef.current)
    const newBadges = []
    for (const id of unlockedIds) {
      if (!prevSeen.has(id)) newBadges.push(id)
    }
    if (newBadges.length > 0) {
      const badgeObjects = newBadges
        .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
        .filter(Boolean)
      setNotifQueue((q) => [...q, ...badgeObjects])
      setSeenBadges((prev) => [...new Set([...prev, ...newBadges])])
      prevUnlockedRef.current = [...new Set([...prevUnlockedRef.current, ...newBadges])]
      playBadge()
    }
  }, [unlockedIds, setSeenBadges])

  const dismissNotif = useCallback(() => {
    setNotifQueue((q) => q.slice(1))
  }, [])

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

  const isDisabled = (character) => full || cheapestDp(character) > remaining

  const addForm = (character, form) => {
    if (full || form.dp > remaining) return
    setTeam((t) => [...t, { characterId: character.id, formName: form.form }])
    setPicking(null)
    playAdd()
  }

  const removeAt = (index) => {
    setTeam((t) => t.filter((_, i) => i !== index))
    playRemove()
  }

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
    playSave()
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
    } catch {}
    setShareLabel(true)
    setTimeout(() => setShareLabel(false), 2000)
  }

  const toggleFavorite = (charId) => {
    setFavorites((prev) =>
      prev.includes(charId) ? prev.filter((id) => id !== charId) : [...prev, charId]
    )
  }

  const randomTeam = () => {
    const { team: smartTeam } = generateSmartTeam()
    setTeam(smartTeam)
    playRandom()
  }

  const loadPreset = (presetTeam) => {
    setTeam(presetTeam)
    setShowPresets(false)
    playPreset()
  }

  return (
    <div className="app">
      <TeamBar team={team} onRemove={removeAt} onReorder={reorderTeam} />

      <main className="main">
        <div className="brand">
          <h1>
            Sparking! <span className="accent">Zero</span>{' '}
            {VIEW_LABELS[view] || view}
          </h1>
          <nav className="view-tabs">
            {Object.entries(VIEW_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={view === key ? 'view-tab view-tab--active' : 'view-tab'}
                onClick={() => setView(key)}
                type="button"
              >
                {key === 'teams' && savedTeams.length > 0 ? `${label} (${savedTeams.length})` : label}
              </button>
            ))}
          </nav>
        </div>

        {view === 'builder' ? (
          <>
            <CharacterSpotlight />
            <div className="preset-toggle-row">
              <button
                className="preset-toggle-btn"
                type="button"
                onClick={() => setShowPresets((v) => !v)}
              >
                {showPresets ? 'Hide Iconic Teams' : 'Iconic Teams'}
              </button>
            </div>
            {showPresets && <PresetTeams onLoad={loadPreset} />}
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
            <CharacterGrid characters={filtered} isDisabled={isDisabled} onPick={setPicking} favorites={favorites} onToggleFav={toggleFavorite} />
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
        ) : view === 'guide' ? (
          <CounterGuide />
        ) : view === 'compare' ? (
          <TeamCompare teams={savedTeams} />
        ) : view === 'news' ? (
          <News />
        ) : (
          <MetaDashboard savedTeams={savedTeams} unlockedIds={unlockedIds} />
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

      {notifQueue.length > 0 && (
        <BadgeNotification key={notifQueue[0].id} badge={notifQueue[0]} onDone={dismissNotif} />
      )}
    </div>
  )
}

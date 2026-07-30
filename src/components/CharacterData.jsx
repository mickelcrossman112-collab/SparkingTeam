import { useMemo, useState } from 'react'
import { characters, allTags, allEpisodes } from '../data/characters.js'
import CharacterDetail from './CharacterDetail.jsx'

const allForms = characters.flatMap((c) =>
  c.forms.map((f) => ({
    id: c.id + '|' + f.form,
    charId: c.id,
    name: c.name,
    form: f.form,
    dp: f.dp,
    health: f.health,
    kiBars: f.kiBars,
    skillPoints: f.skillPoints,
    traits: f.traits,
    tags: f.tags || [],
    episodes: f.episodes || [],
    image: f.image,
    color: c.color,
  }))
)

const charById = Object.fromEntries(characters.map((c) => [c.id, c]))

const COLUMNS = [
  { key: 'name', label: 'Character', sortable: true },
  { key: 'form', label: 'Form', sortable: true },
  { key: 'dp', label: 'DP', sortable: true },
  { key: 'health', label: 'Health', sortable: true },
  { key: 'kiBars', label: 'Ki Bars', sortable: true },
  { key: 'skillPoints', label: 'Skill Pts', sortable: true },
  { key: 'traits', label: 'Traits', sortable: false },
  { key: 'tags', label: 'Tags', sortable: false },
]

export default function CharacterData() {
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [episode, setEpisode] = useState('')
  const [sortKey, setSortKey] = useState('dp')
  const [sortDir, setSortDir] = useState('desc')
  const [selectedChar, setSelectedChar] = useState(null)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'form' ? 'asc' : 'desc')
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = allForms.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.form.toLowerCase().includes(q)) return false
      if (tag && !r.tags.includes(tag)) return false
      if (episode && !r.episodes.includes(episode)) return false
      return true
    })
    rows.sort((a, b) => {
      let av = a[sortKey]
      let bv = b[sortKey]
      if (typeof av === 'string') {
        const cmp = av.localeCompare(bv)
        return sortDir === 'asc' ? cmp : -cmp
      }
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return rows
  }, [search, tag, episode, sortKey, sortDir])

  const openDetail = (row) => {
    const char = charById[row.charId]
    if (char) setSelectedChar(char)
  }

  const resetFilters = () => {
    setSearch('')
    setTag('')
    setEpisode('')
  }

  const hasFilters = search || tag || episode

  return (
    <div className="data-page">
      <div className="data-filters">
        <input
          className="filterbar__search"
          type="search"
          placeholder="Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search characters"
        />
        <select
          className="filterbar__select"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="filterbar__select"
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          aria-label="Filter by episode"
        >
          <option value="">All episodes</option>
          {allEpisodes.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <span className="filterbar__count">{filtered.length} forms</span>
        {hasFilters && (
          <button className="filterbar__reset" onClick={resetFilters} type="button">
            Reset filters
          </button>
        )}
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="data-row-clickable" onClick={() => openDetail(row)}>
                <td className="data-char-cell">
                  {row.image ? (
                    <img className="data-thumb" src={row.image} alt="" />
                  ) : (
                    <span className="data-thumb-placeholder" style={{ background: row.color }} />
                  )}
                  <span>{row.name}</span>
                </td>
                <td>{row.form}</td>
                <td className="num">{row.dp}</td>
                <td className="num">{row.health.toLocaleString()}</td>
                <td className="num">{row.kiBars}</td>
                <td className="num">{row.skillPoints}</td>
                <td>
                  <div className="trait-pills">
                    {row.traits.map((t) => (
                      <span key={t} className="trait-pill">{t}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="tag-pills">
                    {row.tags.slice(0, 3).map((t) => (
                      <span key={t} className="tag-pill">{t}</span>
                    ))}
                    {row.tags.length > 3 && <span className="tag-pill tag-more">+{row.tags.length - 3}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedChar && (
        <CharacterDetail character={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </div>
  )
}

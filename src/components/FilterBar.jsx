import { allTags, allEpisodes } from '../data/characters.js'

export default function FilterBar({
  search,
  onSearch,
  tag,
  onTag,
  episode,
  onEpisode,
  maxDp,
  onMaxDp,
  fitsOnly,
  onFitsOnly,
  onReset,
  resultCount,
}) {
  const hasFilters = search || tag || episode || maxDp || fitsOnly
  return (
    <div className="filterbar">
      <input
        className="filterbar__search"
        type="search"
        placeholder="Search fighters…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search fighters"
      />

      <select
        className="filterbar__select"
        value={tag}
        onChange={(e) => onTag(e.target.value)}
        aria-label="Filter by tag"
      >
        <option value="">All tags</option>
        {allTags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        className="filterbar__select"
        value={episode}
        onChange={(e) => onEpisode(e.target.value)}
        aria-label="Filter by episode"
      >
        <option value="">All episodes</option>
        {allEpisodes.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <select
        className="filterbar__select"
        value={maxDp}
        onChange={(e) => onMaxDp(e.target.value)}
        aria-label="Filter by max DP"
      >
        <option value="">Any DP</option>
        {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            ≤ {n} DP
          </option>
        ))}
      </select>

      <label className="filterbar__check">
        <input
          type="checkbox"
          checked={fitsOnly}
          onChange={(e) => onFitsOnly(e.target.checked)}
        />
        Fits on team
      </label>

      <span className="filterbar__count">{resultCount} shown</span>

      {hasFilters && (
        <button className="filterbar__reset" onClick={onReset} type="button">
          Reset filters
        </button>
      )}
    </div>
  )
}

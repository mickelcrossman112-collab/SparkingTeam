import { useState } from 'react'

export default function ActionBar({
  teamName,
  onTeamName,
  teamNotes,
  onTeamNotes,
  onRandom,
  onShare,
  onSave,
  onToggleFilters,
  filtersOpen,
  canSave,
  shareLabel,
}) {
  const [showNotes, setShowNotes] = useState(false)

  return (
    <div className="actionbar">
      <button
        className={filtersOpen ? 'iconbtn iconbtn--on' : 'iconbtn'}
        onClick={onToggleFilters}
        type="button"
        title="Filters"
        aria-label="Toggle filters"
        aria-pressed={filtersOpen}
      >
        ⚙
      </button>

      <button className="btn btn--random" onClick={onRandom} type="button">
        🔀 Random
      </button>

      <input
        className="actionbar__name"
        type="text"
        placeholder="Enter team name…"
        value={teamName}
        onChange={(e) => onTeamName(e.target.value)}
        aria-label="Team name"
      />

      <button
        className={showNotes ? 'iconbtn iconbtn--on' : 'iconbtn'}
        onClick={() => setShowNotes((v) => !v)}
        type="button"
        title="Add strategy notes"
        aria-label="Toggle notes"
      >
        📝
      </button>

      <button
        className="iconbtn iconbtn--share"
        onClick={onShare}
        type="button"
        disabled={!canSave}
        title="Copy shareable link"
        aria-label="Share team"
      >
        {shareLabel ? '✓' : '🔗'}
      </button>

      <button className="btn btn--save" onClick={onSave} type="button" disabled={!canSave}>
        💾 Save Team
      </button>

      {showNotes && (
        <textarea
          className="actionbar__notes"
          placeholder="Strategy notes — e.g. lead with Vegito, swap to Broly for cleanup…"
          value={teamNotes}
          onChange={(e) => onTeamNotes(e.target.value)}
          rows={2}
        />
      )}
    </div>
  )
}

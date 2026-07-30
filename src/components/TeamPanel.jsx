import TeamSlot from './TeamSlot.jsx'
import { teamDpTotal, DP_LIMIT } from '../utils/dp.js'

export default function TeamPanel({ team, onRemove, onClear, onSave, onShare, shareLabel }) {
  const used = teamDpTotal(team)

  return (
    <aside className="teampanel">
      <div className="teampanel__head">
        <h2>Your Team</h2>
        <span className="teampanel__dp">
          {used}/{DP_LIMIT} DP
        </span>
      </div>

      {team.length === 0 ? (
        <p className="teampanel__empty">
          Pick fighters from the grid to build a squad. Each form costs DP — stay under {DP_LIMIT}.
        </p>
      ) : (
        <ul className="teampanel__list">
          {team.map((item, i) => (
            <TeamSlot key={`${item.characterId}-${item.formName}-${i}`} item={item} index={i} onRemove={onRemove} />
          ))}
        </ul>
      )}

      <div className="teampanel__actions">
        <button className="btn btn--save" onClick={onSave} disabled={team.length === 0} type="button">
          💾 Save team
        </button>
        <button className="btn btn--share" onClick={onShare} disabled={team.length === 0} type="button">
          {shareLabel || '🔗 Share link'}
        </button>
        <button className="btn btn--clear" onClick={onClear} disabled={team.length === 0} type="button">
          🗑 Clear
        </button>
      </div>
    </aside>
  )
}

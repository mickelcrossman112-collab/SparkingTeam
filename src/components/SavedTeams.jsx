import { charactersById } from '../data/characters.js'
import { teamDpTotal } from '../utils/dp.js'

export default function SavedTeams({ teams, onLoad, onDelete }) {
  if (teams.length === 0) return null

  return (
    <section className="saved">
      <h2 className="saved__title">My Teams</h2>
      <ul className="saved__list">
        {teams.map((saved) => (
          <li key={saved.id} className="saved__item">
            <div className="saved__swatches">
              {saved.team.map((item, i) => {
                const c = charactersById[item.characterId]
                return (
                  <span
                    key={i}
                    className="saved__swatch"
                    style={{ background: c ? c.color : '#555' }}
                    title={c ? c.name : 'Unknown'}
                  />
                )
              })}
            </div>
            <div className="saved__meta">
              <span className="saved__name">{saved.name}</span>
              <span className="saved__dp">
                {saved.team.length} fighters · {teamDpTotal(saved.team)} DP
              </span>
            </div>
            <div className="saved__buttons">
              <button className="btn btn--sm" onClick={() => onLoad(saved.team, saved.name)} type="button">
                Load
              </button>
              <button className="btn btn--sm btn--danger" onClick={() => onDelete(saved.id)} type="button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

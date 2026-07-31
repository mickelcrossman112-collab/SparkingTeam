import { PRESETS } from '../data/presets.js'
import { charactersById } from '../data/characters.js'
import { getForm, teamDpTotal } from '../utils/dp.js'

function PresetPortrait({ item }) {
  const char = charactersById[item.characterId]
  const form = getForm(item)
  if (!char) return null
  return form?.image ? (
    <img className="preset__portrait" src={form.image} alt={char.name} title={`${char.name} (${item.formName})`} />
  ) : (
    <div className="preset__portrait preset__portrait--ph" style={{ background: char.color }} title={char.name}>
      {char.name[0]}
    </div>
  )
}

export default function PresetTeams({ onLoad }) {
  return (
    <div className="preset-list">
      <h3 className="preset-list__title">Iconic Teams</h3>
      <p className="preset-list__sub">Load a classic squad with one tap.</p>
      <div className="preset-grid">
        {PRESETS.map((p) => (
          <button key={p.id} className="preset-card" type="button" onClick={() => onLoad(p.team)}>
            <div className="preset-card__header">
              <span className="preset-card__icon">{p.icon}</span>
              <span className="preset-card__name">{p.name}</span>
              <span className="preset-card__dp">{teamDpTotal(p.team)} DP</span>
            </div>
            <p className="preset-card__desc">{p.desc}</p>
            <div className="preset-card__portraits">
              {p.team.map((item, i) => (
                <PresetPortrait key={i} item={item} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

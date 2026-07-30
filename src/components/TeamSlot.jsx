import { charactersById } from '../data/characters.js'
import { getForm } from '../utils/dp.js'

export default function TeamSlot({ item, index, onRemove }) {
  const character = charactersById[item.characterId]
  const form = getForm(item)
  if (!character || !form) return null

  return (
    <li className="slot">
      <span className="slot__swatch" style={{ background: character.color }} />
      <div className="slot__info">
        <span className="slot__name">{character.name}</span>
        <span className="slot__form">{form.form}</span>
      </div>
      <span className="slot__dp">{form.dp} DP</span>
      <button
        className="slot__remove"
        onClick={() => onRemove(index)}
        type="button"
        aria-label={`Remove ${character.name}`}
      >
        ✕
      </button>
    </li>
  )
}

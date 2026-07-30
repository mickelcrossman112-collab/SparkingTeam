import { cheapestDp } from '../utils/dp.js'

export default function CharacterCard({ character, disabled, onClick }) {
  const dp = cheapestDp(character)
  const cardImage = character.forms[0]?.image
  const initials = character.name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <button
      className={disabled ? 'card card--disabled' : 'card'}
      onClick={() => onClick(character)}
      disabled={disabled}
      type="button"
      title={disabled ? 'Not enough DP left for any form' : `Add ${character.name}`}
    >
      <div className="card__art" style={{ background: character.color }}>
        {cardImage ? (
          <img src={cardImage} alt={character.name} loading="lazy" />
        ) : (
          <span className="card__initials">{initials}</span>
        )}
        <span className="card__dp">{dp}+ DP</span>
      </div>
      <div className="card__name">{character.name}</div>
      <div className="card__tags">{(character.forms[0]?.tags || []).slice(0, 2).join(' · ')}</div>
    </button>
  )
}

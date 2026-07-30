import CharacterCard from './CharacterCard.jsx'

export default function CharacterGrid({ characters, isDisabled, onPick, favorites, onToggleFav }) {
  if (characters.length === 0) {
    return <p className="grid__empty">No fighters match your filters.</p>
  }

  const favSet = new Set(favorites || [])
  const favs = characters.filter((c) => favSet.has(c.id))
  const rest = characters.filter((c) => !favSet.has(c.id))
  const sorted = [...favs, ...rest]

  return (
    <div className="grid">
      {sorted.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          disabled={isDisabled(character)}
          onClick={onPick}
          isFav={favSet.has(character.id)}
          onToggleFav={onToggleFav}
        />
      ))}
    </div>
  )
}

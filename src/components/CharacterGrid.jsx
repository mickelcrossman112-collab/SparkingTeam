import CharacterCard from './CharacterCard.jsx'

export default function CharacterGrid({ characters, isDisabled, onPick }) {
  if (characters.length === 0) {
    return <p className="grid__empty">No fighters match your filters.</p>
  }

  return (
    <div className="grid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          disabled={isDisabled(character)}
          onClick={onPick}
        />
      ))}
    </div>
  )
}

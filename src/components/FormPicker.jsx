import { useEffect } from 'react'

// Modal to choose which form/transformation of a character to add to the team.
export default function FormPicker({ character, remaining, onAdd, onClose }) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!character) return null

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Choose a form for ${character.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2>{character.name}</h2>
          <button className="modal__close" onClick={onClose} type="button" aria-label="Close">
            ✕
          </button>
        </div>
        <p className="modal__sub">{[...new Set(character.forms.flatMap((f) => f.tags || []))].slice(0, 4).join(' · ')}</p>

        <ul className="forms">
          {character.forms.map((form) => {
            const fits = form.dp <= remaining
            return (
              <li key={form.form} className={fits ? 'form' : 'form form--nofit'}>
                <div className="form__header">
                  {form.image && (
                    <img className="form__thumb" src={form.image} alt={form.form} loading="lazy" />
                  )}
                  <div className="form__main">
                    <span className="form__name">{form.form}</span>
                    <span className="form__dp">{form.dp} DP</span>
                  </div>
                </div>
                <div className="form__stats">
                  <span>❤ {form.health.toLocaleString()}</span>
                  <span>🔵 {form.kiBars} Ki</span>
                  <span>✦ {form.skillPoints} SP</span>
                </div>
                {form.traits.length > 0 && (
                  <div className="form__traits">
                    {form.traits.map((t) => (
                      <span key={t} className="trait">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn--add"
                  disabled={!fits}
                  onClick={() => onAdd(character, form)}
                  type="button"
                >
                  {fits ? 'Add to team' : `Needs ${form.dp} DP (${remaining} left)`}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

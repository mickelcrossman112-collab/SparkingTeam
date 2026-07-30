import { useState } from 'react'
import { characters } from '../data/characters.js'
import { getCombatData } from '../data/combatData.js'

export default function CharacterDetail({ character, onClose, initialFormIndex }) {
  const [activeFormIndex, setActiveFormIndex] = useState(initialFormIndex || 0)
  const form = character.forms[activeFormIndex]
  const combat = getCombatData(character.name, form.form)

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} type="button">
          &times;
        </button>

        <div className="detail-top">
          <div className="detail-image-wrap">
            {form.image ? (
              <img className="detail-image" src={form.image} alt={character.name} />
            ) : (
              <div
                className="detail-image-placeholder"
                style={{ background: character.color }}
              >
                {character.name[0]}
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-header">
              <h2 className="detail-name">{character.name}</h2>
              <span className="detail-dp">{form.dp} DP</span>
            </div>
            <p className="detail-form-label">{form.form}</p>
            {combat && <p className="detail-class">{combat.class}</p>}

            <div className="detail-stats-grid">
              <div className="detail-stat-box">
                <span className="detail-stat-label">Health</span>
                <span className="detail-stat-value">{form.health.toLocaleString()}</span>
              </div>
              <div className="detail-stat-box">
                <span className="detail-stat-label">Starting Ki</span>
                <span className="detail-stat-value">{form.kiBars}</span>
              </div>
              <div className="detail-stat-box">
                <span className="detail-stat-label">Skill Points</span>
                <span className="detail-stat-value">{form.skillPoints}</span>
              </div>
              {combat && (
                <div className="detail-stat-box">
                  <span className="detail-stat-label">Defense</span>
                  <span className="detail-stat-value">{combat.defense.toLocaleString()}</span>
                </div>
              )}
            </div>

            {form.traits.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Special Abilities</h3>
                <div className="detail-pills">
                  {form.traits.map((t) => (
                    <span key={t} className="detail-trait-pill">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {character.forms.length > 1 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Forms</h3>
                <div className="detail-forms">
                  {character.forms.map((f, i) => (
                    <button
                      key={f.form}
                      className={`detail-form-btn ${i === activeFormIndex ? 'detail-form-btn--active' : ''}`}
                      onClick={() => setActiveFormIndex(i)}
                      type="button"
                    >
                      {f.image ? (
                        <img className="detail-form-thumb" src={f.image} alt={f.form} />
                      ) : (
                        <span
                          className="detail-form-thumb-placeholder"
                          style={{ background: character.color }}
                        />
                      )}
                      <span className="detail-form-dp">{f.dp}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {combat && (
          <div className="detail-bottom">
            <div className="detail-combat-section">
              <h3 className="detail-combat-title">
                <span className="detail-title-bar" />
                Combat Stats
              </h3>
              <div className="detail-combat-list">
                <div className="detail-combat-row">
                  <span>Melee Damage</span>
                  <span>{combat.meleeDmg.toLocaleString()}</span>
                </div>
                <div className="detail-combat-row">
                  <span>Ki Blast Damage</span>
                  <span>{combat.kiBlastDmg.toLocaleString()}</span>
                </div>
                <div className="detail-combat-row">
                  <span>Throw Damage</span>
                  <span>{combat.throwDmg.toLocaleString()}</span>
                </div>
                <div className="detail-combat-row">
                  <span>Rush (1 Hit)</span>
                  <span>{combat.rush1.toLocaleString()}</span>
                </div>
                <div className="detail-combat-row">
                  <span>Rush (5 Hits)</span>
                  <span>{combat.rush5.toLocaleString()}</span>
                </div>
                <div className="detail-combat-row">
                  <span>Switch Time</span>
                  <span>{combat.switchTime}</span>
                </div>
              </div>
            </div>

            <div className="detail-combat-section">
              <h3 className="detail-combat-title">
                <span className="detail-title-bar" />
                Skills
              </h3>
              <div className="detail-skills">
                {combat.skill1 && (
                  <div className="detail-skill-card">
                    <span className="detail-skill-name">{combat.skill1}</span>
                  </div>
                )}
                {combat.skill2 && (
                  <div className="detail-skill-card">
                    <span className="detail-skill-name">{combat.skill2}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-combat-section detail-supers-section">
              <h3 className="detail-combat-title">
                <span className="detail-title-bar" />
                Super Attacks
              </h3>
              <div className="detail-supers">
                {combat.super1 && (
                  <div className="detail-super-card">
                    <span className="detail-super-label">Super 1</span>
                    <span className="detail-super-name">{combat.super1.name}</span>
                    {combat.super1.damage > 0 && (
                      <span className="detail-super-dmg">{combat.super1.damage.toLocaleString()} dmg</span>
                    )}
                  </div>
                )}
                {combat.super2 && (
                  <div className="detail-super-card">
                    <span className="detail-super-label">Super 2</span>
                    <span className="detail-super-name">{combat.super2.name}</span>
                    {combat.super2.damage > 0 && (
                      <span className="detail-super-dmg">{combat.super2.damage.toLocaleString()} dmg</span>
                    )}
                  </div>
                )}
                {combat.ultimate && (
                  <div className="detail-super-card detail-super-card--ult">
                    <span className="detail-super-label detail-super-label--ult">Ultimate</span>
                    <span className="detail-super-name">{combat.ultimate.name}</span>
                    {combat.ultimate.damage > 0 && (
                      <span className="detail-super-dmg">{combat.ultimate.damage.toLocaleString()} dmg</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(form.tags?.length > 0 || form.episodes?.length > 0) && (
          <div className="detail-tags-section">
            {form.tags?.length > 0 && (
              <div className="detail-tag-row">
                {form.tags.map((t) => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
            )}
            {form.episodes?.length > 0 && (
              <div className="detail-tag-row">
                {form.episodes.map((e) => (
                  <span key={e} className="detail-episode-pill">{e}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

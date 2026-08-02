import { useState, useMemo } from 'react'
import { characters, charactersById } from '../data/characters.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { loadRecords } from '../utils/matchLog.js'

const CATEGORIES = ['Matchup', 'Combo', 'Defense', 'Ki Management', 'Mental', 'Other']

export default function TrainingPlanner() {
  const [goals, setGoals] = useLocalStorage('szTrainingGoals', [])
  const [main] = useLocalStorage('szMainFighter', null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Matchup')
  const [target, setTarget] = useState('')
  const [charId, setCharId] = useState('')
  const [showDone, setShowDone] = useState(false)

  const records = useMemo(loadRecords, [])

  const suggestions = useMemo(() => {
    const weak = Object.entries(records)
      .map(([id, rec]) => {
        const char = charactersById[id]
        const total = rec.w + rec.l
        if (!char || total < 3) return null
        return { id, char, winRate: Math.round((rec.w / total) * 100), total }
      })
      .filter(Boolean)
      .filter(o => o.winRate < 50)
      .sort((a, b) => a.winRate - b.winRate)
      .slice(0, 4)

    const existing = new Set(goals.map(g => g.title.toLowerCase()))
    return weak
      .map(o => ({
        title: `Beat ${o.char.name} 5 times`,
        category: 'Matchup',
        target: 5,
        charId: main || '',
        hint: `${o.winRate}% win rate over ${o.total} matches`,
      }))
      .filter(s => !existing.has(s.title.toLowerCase()))
  }, [records, goals, main])

  const addGoal = (preset) => {
    const t = (preset?.title ?? title).trim()
    if (!t) return
    const goal = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: t,
      category: preset?.category ?? category,
      target: Number(preset?.target ?? target) || 0,
      progress: 0,
      charId: preset?.charId ?? charId,
      done: false,
      createdAt: Date.now(),
    }
    setGoals(prev => [goal, ...prev])
    if (!preset) { setTitle(''); setTarget('') }
  }

  const bump = (id, delta) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g
      const progress = Math.max(0, g.progress + delta)
      const done = g.target > 0 ? progress >= g.target : g.done
      return { ...g, progress, done }
    }))
  }

  const toggleDone = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g))
  }

  const remove = (id) => setGoals(prev => prev.filter(g => g.id !== id))

  const active = goals.filter(g => !g.done)
  const completed = goals.filter(g => g.done)
  const visible = showDone ? completed : active

  return (
    <div className="training">
      <div className="training-head">
        <h2 className="training-head__title">Training Planner</h2>
        <p className="training-head__sub">Set concrete goals and tick them off as you grind. Progress saves automatically.</p>
      </div>

      <div className="training-stats">
        <div className="training-stat">
          <span className="training-stat__val">{active.length}</span>
          <span className="training-stat__label">Active</span>
        </div>
        <div className="training-stat">
          <span className="training-stat__val training-stat__val--good">{completed.length}</span>
          <span className="training-stat__label">Completed</span>
        </div>
        <div className="training-stat">
          <span className="training-stat__val">
            {goals.length > 0 ? Math.round((completed.length / goals.length) * 100) : 0}%
          </span>
          <span className="training-stat__label">Done Rate</span>
        </div>
      </div>

      <div className="training-add">
        <input
          className="training-add__title"
          type="text"
          placeholder="What do you want to work on?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addGoal() }}
        />
        <div className="training-add__row">
          <select className="training-add__select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="training-add__select" value={charId} onChange={e => setCharId(e.target.value)}>
            <option value="">Any fighter</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            className="training-add__target"
            type="number"
            min="0"
            placeholder="Reps"
            value={target}
            onChange={e => setTarget(e.target.value)}
          />
          <button className="training-add__btn" type="button" onClick={() => addGoal()}>Add Goal</button>
        </div>
      </div>

      {suggestions.length > 0 && !showDone && (
        <div className="training-section">
          <h3 className="training-section__title">Suggested From Your Journal</h3>
          <div className="training-suggestions">
            {suggestions.map(s => (
              <button key={s.title} className="training-suggestion" type="button" onClick={() => addGoal(s)}>
                <span className="training-suggestion__title">{s.title}</span>
                <span className="training-suggestion__hint">{s.hint}</span>
                <span className="training-suggestion__add">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="training-toggle-row">
        <button
          className={'training-toggle' + (!showDone ? ' training-toggle--active' : '')}
          type="button"
          onClick={() => setShowDone(false)}
        >Active ({active.length})</button>
        <button
          className={'training-toggle' + (showDone ? ' training-toggle--active' : '')}
          type="button"
          onClick={() => setShowDone(true)}
        >Completed ({completed.length})</button>
      </div>

      {visible.length === 0 ? (
        <div className="training-empty">
          <p>{showDone ? 'Nothing completed yet.' : 'No active goals. Add one above or pick a suggestion.'}</p>
        </div>
      ) : (
        <div className="training-list">
          {visible.map(g => {
            const char = g.charId ? charactersById[g.charId] : null
            const pct = g.target > 0 ? Math.min(100, Math.round((g.progress / g.target) * 100)) : (g.done ? 100 : 0)
            return (
              <div key={g.id} className={'training-goal' + (g.done ? ' training-goal--done' : '')}>
                <button
                  className={'training-goal__check' + (g.done ? ' training-goal__check--on' : '')}
                  type="button"
                  onClick={() => toggleDone(g.id)}
                  aria-label="Toggle complete"
                >{g.done ? '✓' : ''}</button>

                <div className="training-goal__body">
                  <div className="training-goal__top">
                    <span className="training-goal__title">{g.title}</span>
                    <span className="training-goal__cat">{g.category}</span>
                  </div>
                  <div className="training-goal__meta">
                    {char && (
                      <span className="training-goal__char">
                        {char.forms[0]?.image
                          ? <img className="training-goal__char-img" src={char.forms[0].image} alt="" />
                          : <span className="training-goal__char-ph" style={{ background: char.color }}>{char.name[0]}</span>}
                        {char.name}
                      </span>
                    )}
                    {g.target > 0 && <span className="training-goal__count">{g.progress} / {g.target}</span>}
                  </div>
                  {g.target > 0 && (
                    <div className="training-goal__bar">
                      <div className="training-goal__bar-fill" style={{ width: pct + '%' }} />
                    </div>
                  )}
                </div>

                <div className="training-goal__actions">
                  {g.target > 0 && !g.done && (
                    <>
                      <button className="training-goal__btn" type="button" onClick={() => bump(g.id, -1)}>−</button>
                      <button className="training-goal__btn training-goal__btn--plus" type="button" onClick={() => bump(g.id, 1)}>+</button>
                    </>
                  )}
                  <button className="training-goal__btn training-goal__btn--del" type="button" onClick={() => remove(g.id)}>×</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

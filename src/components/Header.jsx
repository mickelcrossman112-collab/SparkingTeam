import { DP_LIMIT } from '../utils/dp.js'

export default function Header({ used }) {
  const remaining = DP_LIMIT - used
  const pct = Math.min(100, (used / DP_LIMIT) * 100)
  const over = used > DP_LIMIT

  return (
    <header className="header">
      <div className="header__title">
        <h1>
          Sparking! <span className="accent">Zero</span> Team Builder
        </h1>
        <p className="header__tagline">Assemble your ultimate squad within the {DP_LIMIT} DP limit.</p>
      </div>

      <div className="header__budget" aria-label="DP budget">
        <div className="budget__numbers">
          <span className={over ? 'budget__used over' : 'budget__used'}>{used}</span>
          <span className="budget__slash">/</span>
          <span className="budget__limit">{DP_LIMIT} DP</span>
        </div>
        <div className="budget__bar">
          <div
            className={over ? 'budget__fill over' : 'budget__fill'}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="budget__remaining">{remaining} DP remaining</div>
      </div>
    </header>
  )
}

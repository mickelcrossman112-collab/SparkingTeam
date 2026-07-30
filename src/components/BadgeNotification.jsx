import { useEffect, useState } from 'react'

export default function BadgeNotification({ badge, onDone }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 50)
    const t2 = setTimeout(() => setPhase('exit'), 3000)
    const t3 = setTimeout(onDone, 3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div className={'badge-notif badge-notif--' + phase + ' badge-notif--' + badge.tier}>
      <span className="badge-notif__icon">{badge.icon}</span>
      <div className="badge-notif__text">
        <span className="badge-notif__label">Badge Unlocked!</span>
        <span className="badge-notif__name">{badge.name}</span>
        <span className="badge-notif__desc">{badge.desc}</span>
      </div>
    </div>
  )
}

import { news } from '../data/news.js'

const CAT_COLORS = {
  DLC: '#ff4444',
  Patch: '#ff9900',
  'Coming Soon': '#3a8dff',
  Release: '#22cc88',
  Gameplay: '#bb66ff',
  Trailer: '#e05a30',
}

export default function News() {
  return (
    <div className="news-page">
      <h2 className="news-title">Intel Feed</h2>
      <p className="news-subtitle">Latest Sparking! Zero news from Bandai Namco</p>
      <div className="news-list">
        {news.map((item) => (
          <a
            key={item.id}
            className="news-card"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.image && (
              <div className="news-card__img">
                <img src={item.image} alt="" loading="lazy" />
              </div>
            )}
            <div className="news-card__content">
              <div className="news-card__header">
                <span
                  className="news-card__cat"
                  style={{ background: CAT_COLORS[item.category] || '#888' }}
                >
                  {item.category}
                </span>
                <time className="news-card__date">{formatDate(item.date)}</time>
              </div>
              <h3 className="news-card__title">{item.title}</h3>
            </div>
          </a>
        ))}
      </div>
      <p className="news-source">
        Source: <a href="https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero/news" target="_blank" rel="noopener noreferrer">Bandai Namco</a>
      </p>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

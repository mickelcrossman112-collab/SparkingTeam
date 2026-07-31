import { useMemo } from 'react'
import { characters } from '../data/characters.js'

const TIPS = {
  'goku-z-early': 'A solid starter pick — low DP, decent stats, and Dodge Skill makes him slippery.',
  'goku-z-mid': 'Super Saiyan form brings Instant Spark for devastating combos.',
  'goku-z-end': 'SS3 form hits like a truck with Unblockable Ultimate. Worth the 7 DP.',
  'goku-super': 'God and Blue forms give access to God Ki synergies. Versatile across many teams.',
  'goku-super-ui': 'The most expensive character in the game — but Ultra Instinct dodges speak for themselves.',
  'goku-gt': 'SS4 form is a powerhouse. Great anchor for GT-themed teams.',
  'vegeta-z-scouter': 'Budget Saiyan pick at 4 DP. Pairs well with Nappa for Saiyan Saga nostalgia.',
  'vegeta-z-early': 'Super Vegeta form is an underrated pick at 6 DP.',
  'vegeta-z-end': 'Majin Vegeta is one of the most popular forms — raw power and attitude.',
  'vegeta-super': 'Blue Evolution is a premium pick at 8 DP but brings God Ki and Vegeta Family synergy.',
  'gohan-teen': 'SS2 Teen Gohan is iconic. 7 DP for Unblockable Ultimate is a tournament staple.',
  'gohan-kid': 'Cheap entry into Son Family and Hybrid Saiyan teams.',
  'piccolo': 'Regeneration tag and solid stats make Piccolo a reliable team filler.',
  'krillin': 'The ultimate budget pick at 2 DP. Fits anywhere and enables Earthling teams.',
  'frieza-z': 'Final Form Frieza at 7 DP is devastating. Golden Frieza is endgame material.',
  'cell': 'Semi-Perfect to Perfect evolution in one slot. Android and Regeneration synergy.',
  'perfect-cell': 'Perfect Cell is a fan favourite. High stats justify the 7 DP cost.',
  'kid-buu': 'Pure chaos. High DP but Regeneration trait and Unblockable Ultimate make him deadly.',
  'broly-z': 'The Legendary Super Saiyan. Raw stats that overpower most matchups.',
  'broly-super': 'DBS Broly brings Movie Saga synergy and ridiculous damage output.',
  'beerus': 'God of Destruction. God Ki anchor with top-tier stats at 8 DP.',
  'hit': 'Time Skip trait is unique. Universal Rep synergy with Goku Super and Jiren.',
  'jiren': 'The wall. Highest raw stats in the game if you can afford 9 DP.',
  'vegito': 'Fusion of Goku and Vegeta. Fusion Warrior synergy with incredible versatility.',
  'gogeta-super': 'Blue Gogeta is a powerhouse. Fusion Warrior and God Ki in one slot.',
  'super-gogeta-z': 'The OG fusion. Great value at 7 DP with Movie Saga synergy.',
  'gotenks': 'Cheap fusion option. SS3 form at 6 DP punches above its weight.',
  'future-trunks': 'Sword of Hope form is a Future timeline anchor at 7 DP.',
  'android-18': 'Android and Girls dual tags. Solid budget pick for themed teams.',
  'android-17-super': 'MVP of the Tournament of Power. Universal Rep and Android synergy.',
  'mr-satan': 'The champ! Cheapest character in the game at 1 DP. Meme legend.',
  'trunks-sword': 'SS form brings Future synergy. Fan-favourite design.',
  'goku-black': 'Rose form at 7 DP brings Future and God Ki. Villain teams love him.',
  'kefla': 'Fusion of Caulifla and Kale. Fusion Warrior, Girls, and Universal Rep all in one.',
  'master-roshi': 'The original martial arts master. Earthling teams start here.',
  'yamcha': 'Budget Earthling pick. Surprisingly effective in low-DP teams.',
  'tien': 'Tri-Beam specialist. Earthling teams need him.',
}

const FALLBACK_TIPS = [
  'A solid pick for themed teams. Check their tags for synergy options!',
  'Try building a team around this fighter — you might unlock a badge.',
  'Every fighter has a role. This one could be the key to your next squad.',
  'Mix and match forms to find the perfect DP balance for your team.',
]

export default function CharacterSpotlight() {
  const { char, form, tip } = useMemo(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const idx = seed % characters.length
    const c = characters[idx]
    const f = c.forms[0]
    const t = TIPS[c.id] || FALLBACK_TIPS[seed % FALLBACK_TIPS.length]
    return { char: c, form: f, tip: t }
  }, [])

  return (
    <div className="spotlight">
      <div className="spotlight__badge">Fighter of the Day</div>
      <div className="spotlight__content">
        <div className="spotlight__portrait">
          {form?.image ? (
            <img className="spotlight__img" src={form.image} alt={char.name} />
          ) : (
            <div className="spotlight__ph" style={{ background: char.color }}>{char.name[0]}</div>
          )}
        </div>
        <div className="spotlight__info">
          <h3 className="spotlight__name">{char.name}</h3>
          <div className="spotlight__tags">
            {(form?.tags || []).slice(0, 4).map((t) => (
              <span key={t} className="spotlight__tag">{t}</span>
            ))}
          </div>
          <p className="spotlight__tip">{tip}</p>
          <div className="spotlight__stats">
            <span>DP: {form?.dp}</span>
            <span>HP: {(form?.health || 0).toLocaleString()}</span>
            <span>Ki: {form?.kiBars}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

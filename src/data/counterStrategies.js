export const ARCHETYPES = [
  {
    id: 'rush-spam',
    name: 'Rush Spammers',
    desc: 'Players who spam rush attacks and close-range pressure non-stop.',
    icon: '👊',
    counters: [
      'Use characters with Dodge Skill — they can vanish out of rush strings.',
      'Instant Spark lets you escape combos and punish the recovery.',
      'Step-dash sideways to avoid linear rush attacks, then punish the whiff.',
      'Characters with counter-moves (like Explosive Wave) shut down rushdown cold.',
      'Keep your distance and zone with ki blasts — rush spammers hate range.',
      'Swap characters mid-combo to reset pressure and surprise them.',
    ],
    goodTraits: ['Dodge Skill', 'Instant Spark'],
    goodSkills: ['Explosive Wave', 'Super Explosive Wave', 'Afterimage Strike', 'Wild Sense'],
  },
  {
    id: 'high-dp-duo',
    name: 'High DP Duo/Trio',
    desc: 'Teams running 2-3 expensive characters like Kefla + Gogeta + Vegito who hit like trucks.',
    icon: '💎',
    counters: [
      'They have fewer fighters — if you take one out, they lose a huge chunk of their power.',
      'Use budget characters with Unblockable Ultimate to chunk their health bars.',
      'Dodge Skill characters let you avoid their big damage and punish the recovery.',
      'Rush them down before they can set up — high DP characters often have long switch times.',
      'Bait their supers, then punish. Their big moves cost a lot of ki.',
      'Run a 4-5 character team to outlast them — they run out of options fast.',
    ],
    goodTraits: ['Dodge Skill', 'Unblockable Ultimate', 'Instant Spark'],
    goodSkills: ['Afterimage Strike', 'Wild Sense'],
  },
  {
    id: 'tanky-chip',
    name: 'Tanky Chip Damage',
    desc: 'Characters like Roshi or high-HP fighters who chip away at your health safely.',
    icon: '🛡️',
    counters: [
      'Use Unblockable Ultimate characters — bypasses their guard completely.',
      'Aggressive rush pressure prevents them from playing safe and chipping.',
      'Dragon Dash in and stay close — tanky characters often rely on spacing.',
      'Characters with grab/throw skills punish blocking and turtling.',
      'High melee damage characters can burst through their health pool quickly.',
      'Instant Spark to escape their chip setups and reset to neutral.',
    ],
    goodTraits: ['Unblockable Ultimate', 'Instant Spark'],
    goodSkills: ['Full Power', 'Full Power Charge'],
  },
  {
    id: 'zoner',
    name: 'Ki Blast Zoners',
    desc: 'Players who stay at range and spam ki blasts and beam supers.',
    icon: '🔫',
    counters: [
      'Dodge Skill lets you vanish through ki blasts and appear right next to them.',
      'Dragon Dash through projectiles to close the gap quickly.',
      'Use Afterimage or Wild Sense to phase through their ranged attacks.',
      'Characters with beam supers can out-zone them in beam clashes.',
      'Stay mobile — sidestep ki blasts and advance between their shots.',
      'Once you get in, stay in. Zoners struggle up close.',
    ],
    goodTraits: ['Dodge Skill', 'Instant Spark'],
    goodSkills: ['Afterimage Strike', 'Afterimage', 'Wild Sense'],
  },
  {
    id: 'fusion-spam',
    name: 'Fusion Warriors',
    desc: 'Vegito, Gogeta, Kefla, Gotenks — fast, aggressive, and loaded with traits.',
    icon: '🔗',
    counters: [
      'Fusion warriors are expensive — exploit their thin roster by winning the war of attrition.',
      'Most fusions lack Health Regeneration — chip damage sticks permanently.',
      'Use Powerful Opponent tagged characters who are designed to fight strong opponents.',
      'Bait their Instant Spark, then go all-in once it is used up.',
      'Characters with Dodge Skill can escape their Instant Spark combos.',
      'Run a full 5-man team of budget picks to overwhelm them with numbers.',
    ],
    goodTraits: ['Dodge Skill', 'Health Regeneration', 'Unblockable Ultimate'],
    goodSkills: ['Explosive Wave', 'Wild Sense'],
  },
  {
    id: 'regen-stall',
    name: 'Regeneration Stallers',
    desc: 'Piccolo, Cell, Buu — they heal back and drag the fight out forever.',
    icon: '💚',
    counters: [
      'Use high burst damage to outpace their healing — do not let them recover.',
      'Unblockable Ultimate ignores their guard so they cannot stall safely.',
      'Keep constant pressure — Health Regeneration only works when they are not getting hit.',
      'Focus fire one character at a time. Do not spread damage across their team.',
      'Characters with high melee damage can delete them before regen kicks in.',
      'Use Super Explosive Wave to catch multiple regen fighters grouping up.',
    ],
    goodTraits: ['Unblockable Ultimate', 'Instant Spark'],
    goodSkills: ['Full Power', 'Full Power Charge', 'Super Explosive Wave'],
  },
  {
    id: 'ultra-instinct',
    name: 'Ultra Instinct / Dodge Abusers',
    desc: 'UI Goku and other Dodge Skill characters who auto-dodge everything.',
    icon: '👁️',
    counters: [
      'Dodge Skill has a cooldown — bait it with a light attack, then hit them with the real combo.',
      'Grab/throw attacks cannot be dodged — use them to catch dodge-happy players.',
      'Ki blast pressure from range forces them to use dodge early.',
      'Explosive Wave hits all around you — dodge cannot escape area attacks.',
      'Wait for them to dodge, then punish the recovery frames.',
      'Do not throw out big supers raw — they will dodge and punish you.',
    ],
    goodTraits: ['Unblockable Ultimate'],
    goodSkills: ['Explosive Wave', 'Super Explosive Wave'],
  },
  {
    id: 'giant',
    name: 'Giant Form Characters',
    desc: 'Great Ape Vegeta, Giant Piccolo, Hirudegarn — massive HP pools and wide attacks.',
    icon: '🦍',
    counters: [
      'Giant forms have huge hitboxes — ki blast zoning works well against them.',
      'They are slow on recovery — dodge their big swings and punish.',
      'Unblockable Ultimate can chunk their massive health pools.',
      'Stay mobile and use hit-and-run tactics — do not trade blows.',
      'Beam supers hit their large bodies easily from any range.',
      'Characters with Dodge Skill can avoid their wide-reaching attacks.',
    ],
    goodTraits: ['Dodge Skill', 'Unblockable Ultimate'],
    goodSkills: ['Afterimage Strike', 'Wild Sense'],
  },
]

export const CHARACTER_TIPS = {
  'kefla': {
    danger: 'Fast combos, Instant Spark, high damage across all forms. SS2 has Unblockable Ultimate.',
    tips: [
      'Bait her Instant Spark before committing to combos.',
      'She costs 6-8 DP — if she goes down, the opponent loses a lot.',
      'Her base form lacks Unblockable Ultimate — pressure her before she transforms.',
    ],
  },
  'vegito': {
    danger: 'Instant Spark on Super Vegito, Unblockable Ultimate on SSGSS. Fusion Warrior synergy.',
    tips: [
      'Base Vegito (7 DP) lacks Instant Spark — exploit that.',
      'SSGSS Vegito costs 10 DP — their team will be paper thin. Outlast them.',
      'Use Dodge Skill to escape his Instant Spark combos.',
    ],
  },
  'gogeta-super': {
    danger: 'Instant Spark on SS and SSGSS forms. High stats across the board.',
    tips: [
      'Base form (7 DP) has no Instant Spark — pressure him early.',
      'SSGSS costs 10 DP — very expensive, punish the thin roster.',
      'Bait the spark, then go all-in with Unblockable Ultimate.',
    ],
  },
  'super-gogeta-z': {
    danger: 'Instant Spark built in at 8 DP. Movie Saga synergy.',
    tips: [
      'Only one form — no surprises, but he is expensive.',
      'Bait the spark, then rush him down.',
      'Run more characters to outlast his single-form setup.',
    ],
  },
  'goku-super-ui': {
    danger: 'Dodge Skill on both forms. Ultra Instinct (9 DP) has Dodge + Unblockable Ultimate.',
    tips: [
      'Bait the dodge with light attacks, then punish with a full combo.',
      'Grabs beat Dodge Skill — use throw-heavy characters.',
      'At 8-9 DP he eats most of the budget. Beat the rest of the team first.',
    ],
  },
  'jiren': {
    danger: 'Dodge Skill, massive stats. Full Power has Dodge + Unblockable Ultimate at 9 DP.',
    tips: [
      'Use grabs — Dodge Skill cannot avoid throws.',
      'He is extremely expensive. His teammates will be weak — target them.',
      'Explosive Wave catches him even when dodge is active.',
    ],
  },
  'beerus': {
    danger: 'Dodge Skill + Instant Spark at 10 DP. The most expensive character in the game.',
    tips: [
      'At 10 DP his team is basically him alone. Run a full squad and overwhelm.',
      'Bait both dodge and spark before going in.',
      'Use Unblockable Ultimate — he cannot dodge it.',
    ],
  },
  'broly-z': {
    danger: 'Legendary SS at 9 DP has 30k HP and Unblockable Ultimate. A tank that hits hard.',
    tips: [
      'He is slow — use fast characters to outmanoeuvre him.',
      'Dodge Skill lets you avoid his Unblockable Ultimate.',
      'Zone him with ki blasts — he prefers to be in melee range.',
    ],
  },
  'broly-super': {
    danger: 'Health Regeneration on all forms. SS Full Power (9 DP) has 30k HP + regen + Unblockable.',
    tips: [
      'Keep constant pressure — do not let regen kick in.',
      'Burst him down with high melee damage characters.',
      'His base form is only 5 DP and lacks Unblockable — fight him there if possible.',
    ],
  },
  'perfect-cell': {
    danger: 'Health Regen + Unblockable Ultimate at 7 DP. Regeneration and Android synergy.',
    tips: [
      'Burst him down before regen matters — do not let the fight drag.',
      'Instant Spark to escape his Unblockable Ultimate.',
      'He is strong but not S-tier expensive. Focus on beating the rest of the team.',
    ],
  },
  'kid-buu': {
    danger: 'Health Regen + Unblockable Ultimate at 7 DP. Erratic and hard to read.',
    tips: [
      'Stay patient — his attacks have weird timing but are punishable.',
      'Use characters with Dodge Skill to escape his pressure.',
      'Burst damage beats regen. Do not let the fight go long.',
    ],
  },
  'hit': {
    danger: 'Dodge Skill at 8 DP. Time Skip makes his attacks hard to react to.',
    tips: [
      'Grabs beat Dodge Skill — throw him when he expects to dodge.',
      'At 8 DP he limits team options. Target his cheaper teammates.',
      'Explosive Wave catches him regardless of dodge timing.',
    ],
  },
  'gohan-teen': {
    danger: 'SS2 form has Unblockable Ultimate at 7 DP. Iconic and popular.',
    tips: [
      'His base form (4 DP) is much weaker — try to force an early fight.',
      'Dodge Skill lets you avoid the Unblockable Ultimate.',
      'He lacks Instant Spark — pressure him relentlessly.',
    ],
  },
  'master-roshi': {
    danger: 'Cheap at 2 DP base. Max Power (5 DP) is surprisingly tanky. Great chip character.',
    tips: [
      'Rush him down — he cannot handle aggressive pressure.',
      'Use Unblockable Ultimate to bypass his guard.',
      'He is a support pick. Take out the main threats first, then clean him up.',
    ],
  },
  'gotenks': {
    danger: 'SS3 has Unblockable Ultimate at 8 DP. Fusion Warrior synergy.',
    tips: [
      'Base Gotenks (6 DP) lacks Unblockable — fight him before he transforms.',
      'He is a Hybrid Saiyan — use characters that counter Hybrid Saiyan teams.',
      'Dodge Skill helps avoid his SS3 Unblockable Ultimate.',
    ],
  },
  'fused-zamasu': {
    danger: 'Health Regen + Unblockable Ultimate at 8 DP. Half-Corrupted (9 DP) is even scarier.',
    tips: [
      'Burst damage before regen takes effect. Do not play passively.',
      'God Ki and Future synergy means his team will be themed — exploit gaps.',
      'At 8-9 DP he is the anchor. Beat his teammates first to isolate him.',
    ],
  },
}

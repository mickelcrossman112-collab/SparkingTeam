export const ARCHETYPES = [
  {
    id: 'high-dp-duo',
    name: 'High DP Duo',
    desc: 'Two powerhouses like Beerus + Goku Super SSB. They melt you with raw damage and get super armour against low DP characters.',
    icon: '💎',
    counters: [
      'Characters above 7 DP get super armour against characters below 7 DP — match their DP to negate it.',
      'They only have 2 fighters. If you take one out, half their power is gone.',
      'Run your own high DP duo to match their super armour — it comes down to who plays better.',
      'If going low DP, use characters with Afterimage Strike to survive longer and waste their time.',
      'Bait their supers — their big moves cost a lot of ki and are punishable on whiff.',
      'They have no backup plan. Keep the pressure on and do not let them breathe.',
    ],
    goodTraits: ['Dodge Skill', 'Unblockable Ultimate', 'Instant Spark'],
    goodSkills: ['Afterimage Strike', 'Wild Sense', 'Explosive Wave'],
  },
  {
    id: 'low-dp-cheese',
    name: 'Low DP Cheese Squad',
    desc: 'Running 3-5 cheap characters with cheese moves like Afterimage Strike, Explosive Wave, and Instant Spark to outlast you.',
    icon: '🧀',
    counters: [
      'Characters above 7 DP get super armour against these low DP fighters — abuse it.',
      'They rely on cheese moves, not raw stats. Once the cheese is baited, they have nothing.',
      'Master Roshi is usually the star — focus him first, he has False Courage and Afterimage Strike.',
      'Saibaman and Goku Teen are common picks. They are annoying but fragile if you catch them.',
      'Do not chase them blindly. Bait their Afterimage, wait for the vanish, then punish.',
      'Use high melee damage characters to one-combo their low health pools.',
    ],
    goodTraits: ['Unblockable Ultimate', 'Instant Spark'],
    goodSkills: ['Explosive Wave', 'Super Explosive Wave'],
  },
  {
    id: 'transform-team',
    name: 'Transformation Teams',
    desc: 'A high DP anchor with low DP characters who transform into monsters. Bardock to SSJ, Gohan SH to Beast — suddenly you face a full high DP squad.',
    icon: '🔄',
    counters: [
      'Pressure their low DP characters BEFORE they transform. Base Bardock and base Gohan SH are weaker.',
      'They need time to build ki and transform. Aggressive rushdown denies them that setup.',
      'Target the character most likely to transform first — once they are down, the plan falls apart.',
      'Their anchor (usually Gogeta or a fusion) is the real threat. Save your best character for them.',
      'If they have already transformed, treat it like a high DP fight and match their power level.',
      'Watch for Gohan SH — he goes from 4 DP base all the way to Beast (9 DP). Do not let that happen.',
    ],
    goodTraits: ['Instant Spark', 'Dodge Skill'],
    goodSkills: ['Explosive Wave', 'Wild Sense', 'Afterimage Strike'],
  },
  {
    id: 'passive-crutch',
    name: 'Passive / Crutch Players',
    desc: 'Players who pick Broly, Kefla, or Gogeta and abuse one specific gimmick — unblockable rush, charged rush, or ki charge into instant transmission.',
    icon: '🛋️',
    counters: [
      'Broly players spam his unblockable rush — sidestep it, do not try to block or trade.',
      'Kefla players charge then wait for you to approach, then use a rush move for huge damage. Do not rush in blind.',
      'Gogeta SSB players spam ki charge then use instant transmission into a rush move. Stay close so they cannot set it up.',
      'Against passive players, do NOT approach head-on. Use ki blasts to force a reaction, then punish.',
      'These players rely on one trick. Once you learn the timing, they have no backup plan.',
      'Characters with Dodge Skill are great here — you can vanish through their gimmick attacks.',
    ],
    goodTraits: ['Dodge Skill', 'Instant Spark'],
    goodSkills: ['Afterimage Strike', 'Wild Sense', 'Explosive Wave'],
  },
  {
    id: 'android-aggro',
    name: 'Android Rushdown',
    desc: 'Android characters cannot charge ki — they HAVE to fight you and land hits. Expect non-stop aggression.',
    icon: '🤖',
    counters: [
      'Androids must hit you to gain ki. If you zone them out with ki blasts, they cannot build meter.',
      'Use Dodge Skill characters — dodging their attacks wastes their aggression and denies them ki.',
      'Explosive Wave punishes their close-range pressure and resets neutral.',
      'They cannot afford to play passive. Use that against them — bait and punish.',
      'Instant Spark lets you escape their combo strings and reset the fight.',
      'Tanky characters with Health Regeneration can outlast them since androids have to keep coming to you.',
    ],
    goodTraits: ['Dodge Skill', 'Instant Spark', 'Health Regeneration'],
    goodSkills: ['Explosive Wave', 'Super Explosive Wave', 'Wild Sense'],
  },
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
    id: 'fusion-spam',
    name: 'Fusion Warriors',
    desc: 'Vegito, Gogeta, Kefla, Gotenks — fast, aggressive, and loaded with traits.',
    icon: '🔗',
    counters: [
      'Fusion warriors are expensive — exploit their thin roster by winning the war of attrition.',
      'Most fusions lack Health Regeneration — chip damage sticks permanently.',
      'Bait their Instant Spark, then go all-in once it is used up.',
      'Characters with Dodge Skill can escape their Instant Spark combos.',
      'Run a full 5-man team of budget picks to overwhelm them with numbers.',
      'Watch for Gogeta SSB ki charge into instant transmission — stay close to deny the setup.',
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

export const RANKED_META = {
  superArmourThreshold: 7,
  superArmourNote: 'Characters above 7 DP get super armour when fighting characters below 7 DP.',
  cheesePicks: ['master-roshi', 'saibaman', 'goku-teen'],
  passiveCrutch: ['broly-z', 'broly-super', 'kefla', 'gogeta-super'],
  transformThreat: ['gohan-sh', 'bardock-dlc', 'goku-super', 'vegeta-super', 'goku-z-end'],
  androidIds: ['android-16', 'android-17-z', 'android-17-super', 'android-18', 'android-19', 'dr-gero', 'android-13', 'fusion-android-13', 'super-17', 'cell', 'perfect-cell', 'cell-jr'],
}

export const CHARACTER_TIPS = {
  'kefla': {
    danger: 'Ranked crutch character. Players charge ki then wait for you to approach, then use a rush move for huge damage. SS has Unblockable Ultimate.',
    tips: [
      'Do NOT rush in blindly — Kefla players want you to approach so they can punish with a rush move.',
      'Use ki blasts to force her to react, then punish her response.',
      'Bait her Instant Spark before committing to combos.',
      'She costs 6-8 DP — if she goes down, the opponent loses a lot.',
    ],
  },
  'vegito': {
    danger: 'Instant Spark on Super Vegito, high stats across all forms. Fusion Warrior synergy.',
    tips: [
      'Base Vegito (7 DP) lacks Instant Spark — exploit that.',
      'SSGSS Vegito costs 10 DP — their team will be paper thin. Outlast them.',
      'Use Dodge Skill to escape his Instant Spark combos.',
    ],
  },
  'gogeta-super': {
    danger: 'Ranked crutch character. SSB players spam ki charge then instant transmission into a rush move. Hard to react to if you do not know the counter.',
    tips: [
      'Stay close to Gogeta SSB so he cannot set up the ki charge into instant transmission trick.',
      'If he ki charges, do NOT lock onto him — instant transmission makes you face the wrong way.',
      'Base form (7 DP) has no Instant Spark — pressure him early before he transforms.',
      'SSGSS costs 10 DP — very expensive, punish the thin roster.',
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
    danger: 'Dodge Skill + Instant Spark on Ultra Instinct (9 DP). Extremely hard to hit.',
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
    danger: 'Instant Spark + Unblockable Ultimate at 10 DP. Common high DP duo pick paired with Goku Super SSB.',
    tips: [
      'At 10 DP his team is basically him + one other fighter. Run a full squad and overwhelm with numbers.',
      'He gets super armour against anyone below 7 DP — match his DP level or use cheese to survive.',
      'Bait his Instant Spark before going in. Once it is gone, he is vulnerable.',
      'Common ranked combo: Beerus + Goku Super SSB (18 DP duo). Target whichever one comes out second.',
    ],
  },
  'broly-z': {
    danger: 'Ranked crutch character. Legendary SS at 9 DP has an unblockable rush attack. Players spam it because it is nearly impossible to dodge.',
    tips: [
      'His rush attack is unblockable — do NOT try to block it. Sidestep or use Dodge Skill to avoid it.',
      'Zone him with ki blasts — he wants to be in melee range where his rush is deadly.',
      'He is slow on recovery after the rush. Dodge it and punish hard.',
      'Gets super armour against characters below 7 DP — match his level or die trying.',
    ],
  },
  'broly-super': {
    danger: 'Ranked crutch character. Health Regeneration on all forms. SS Full Power (9 DP) has 30k HP + regen. Players spam his rush to bully you.',
    tips: [
      'Same as Broly Z — his rush attack is the main threat. Sidestep, do not block.',
      'Keep constant pressure — do not let regen kick in.',
      'Burst him down with high melee damage characters.',
      'His base form is only 5 DP — fight him there before he transforms.',
    ],
  },
  'perfect-cell': {
    danger: 'Health Regen at 7 DP. Regeneration and Android synergy.',
    tips: [
      'Burst him down before regen matters — do not let the fight drag.',
      'He is strong but not S-tier expensive. Focus on beating the rest of the team.',
      'Use Unblockable Ultimate characters to bypass his guard.',
    ],
  },
  'kid-buu': {
    danger: 'Health Regen at 7 DP. Erratic and hard to read.',
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
  'gohan-sh': {
    danger: 'Transformation threat. Goes from 4 DP base all the way to Beast form at 9 DP. Common in transformation teams.',
    tips: [
      'Kill him BEFORE he transforms to Beast. Base and SS forms are much weaker.',
      'Aggressive rushdown denies him the time to build ki for transformations.',
      'If he reaches Beast form, treat him like a 9 DP character — he is a monster.',
      'Common ranked team: Gogeta + Bardock SSJ + Gohan SH. Target Gohan early.',
    ],
  },
  'master-roshi': {
    danger: 'The #1 low DP cheese pick in ranked. False Courage gives him super armour, Afterimage Strike keeps him alive, and he has Unblockable Ultimate. Way more health than you would expect.',
    tips: [
      'He is the star of cheese squads. Focus him first — without Roshi the cheese team crumbles.',
      'False Courage gives him super armour but it runs out. Bait it, back off, then punish when it drops.',
      'Afterimage Strike makes him vanish when hit — do not commit to long combos, use short punishes.',
      'At only 2 DP base, he frees up budget for 4 other annoying picks. Expect a full squad.',
    ],
  },
  'gotenks': {
    danger: 'SS has Unblockable Ultimate at 7 DP. Fusion Warrior synergy.',
    tips: [
      'Base Gotenks (6 DP) lacks Unblockable — fight him before he transforms.',
      'He is a Hybrid Saiyan — use characters that counter Hybrid Saiyan teams.',
      'Dodge Skill helps avoid his SS Unblockable Ultimate.',
    ],
  },
  'fused-zamasu': {
    danger: 'Health Regen at 8 DP. Half-Corrupted (9 DP) is even scarier with Instant Spark.',
    tips: [
      'Burst damage before regen takes effect. Do not play passively.',
      'God Ki and Future synergy means his team will be themed — exploit gaps.',
      'At 8-9 DP he is the anchor. Beat his teammates first to isolate him.',
    ],
  },
  'saibaman': {
    danger: 'Dirt cheap at 3 DP. Used in cheese squads for Afterimage Strike and Self Destruct.',
    tips: [
      'He is bait. The real threats are the other characters on the team.',
      'Afterimage Strike is annoying but he has very low stats — one good combo and he is done.',
      'Do not waste your best character on Saibaman. Save your resources for the real threats.',
    ],
  },
  'goku-teen': {
    danger: 'Budget cheese pick at 3 DP. Does decent damage for his cost and has Dodge Skill.',
    tips: [
      'He is cheap but not weak — do not underestimate his damage output.',
      'Dodge Skill makes him slippery. Use grabs or Explosive Wave to catch him.',
      'Part of the cheese squad package — expect Roshi and Saibaman alongside him.',
    ],
  },
  'bardock-dlc': {
    danger: 'Transformation threat. Starts at 4 DP base but transforms to SSJ (6 DP). Common in ranked transformation teams.',
    tips: [
      'Kill him before he transforms to SSJ. Base Bardock is manageable.',
      'Common ranked team: Gogeta + Bardock SSJ + Gohan SH Beast. Overwhelming if all transform.',
      'He is paired with big anchors — once Bardock is down, the anchor is alone.',
    ],
  },
  'goku-super': {
    danger: 'Transformation threat. Base (5 DP) has Unblockable Ultimate. Transforms to SSB (8 DP) which is a powerhouse. Common Beerus duo partner.',
    tips: [
      'When paired with Beerus (10 DP + 5 DP base = 15 DP), expect him to transform to SSB mid-fight.',
      'SSB Goku at 8 DP gets super armour against anyone below 7 DP.',
      'Pressure him in base form — he is dangerous but not as scary as his SSB transformation.',
      'If he reaches SSB, treat it like a high DP fight.',
    ],
  },
}

// ============================================================================
// Sparking! Zero — FULL ROSTER (including DLC)
// ============================================================================
// DP values sourced from sparkingzeroteambuilder.com (verified community data).
// Health / Ki / SP / traits are seeded estimates — verify against the game.
// ============================================================================

export const DP_LIMIT = 15
export const MAX_TEAM = 5

const jp = (n) => `/characters/jp/chara${String(n).padStart(3, '0')}.jpg`
const dlc = (n) => `/characters/jp/dlc${String(n).padStart(2, '0')}.jpg`
const neo = (n) => `/characters/neo/img_costume_blast_${String(n).padStart(2, '0')}.jpg`

export const characters = [
  // ======================= GOKU FORMS =======================
  {
    id: 'goku-z-early',
    name: 'Goku (Z-Early)',
    color: '#f0a020',
    forms: [
      { form: 'Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: ['Dodge Skill'], image: jp(1), tags: ['Saiyans','Son Family'], episodes: ['Saiyan Saga'] },
      { form: 'NEO Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: ['Legend Strike'], image: neo(19), tags: ['Saiyans','Son Family','Super Saiyans'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'goku-z-mid',
    name: 'Goku (Z-Mid)',
    color: '#f0a020',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: jp(2), tags: ['Saiyans','Son Family'], episodes: ['Namek Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Instant Spark'], image: jp(3), tags: ['Saiyans','Son Family','Super Saiyans'], episodes: ['Namek Saga'] },
      { form: 'NEO Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Full Power Kamehameha'], image: neo(20), tags: ['Saiyans','Son Family','Super Saiyans'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'goku-z-end',
    name: 'Goku (Z-End)',
    color: '#f0a020',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: jp(4), tags: ['Son Family','Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Instant Spark'], image: jp(5), tags: ['Son Family','Saiyans','Super Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan 2', dp: 6, health: 23000, kiBars: 5, skillPoints: 5, traits: [], image: jp(6), tags: ['Son Family','Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan 3', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(7), tags: ['Son Family','Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'NEO Base (Outfit)', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: neo(5), tags: ['Son Family','Saiyans','Super Saiyans'], episodes: ['Cell Saga'] },
      { form: 'NEO Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: ['Vanishing Meteor'], image: neo(21), tags: ['Son Family','Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'NEO Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Legend Smash'], image: neo(22), tags: ['Son Family','Saiyans','Super Saiyans'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'goku-super',
    name: 'Goku (Super)',
    color: '#e08010',
    forms: [
      { form: 'Base', dp: 5, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(8), tags: ['Saiyans','Son Family','Universal Rep','Future'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'Super Saiyan', dp: 6, health: 23000, kiBars: 4, skillPoints: 5, traits: [], image: jp(9), tags: ['Saiyans','Son Family','Universal Rep','Future','Super Saiyans'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'Super Saiyan God', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration'], image: jp(10), tags: ['Saiyans','Son Family','Universal Rep','God Ki'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'Super Saiyan Blue', dp: 8, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Instant Spark'], image: jp(11), tags: ['Saiyans','Son Family','Universal Rep','Future','God Ki'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'NEO Base (Corp Rising)', dp: 5, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Corp Rising'], image: neo(17), tags: ['Saiyans','Son Family','Universal Rep'], episodes: ['Dragon Ball Super'] },
      { form: 'NEO SSGSS (Combined)', dp: 8, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Combined Strike'], image: neo(18), tags: ['Saiyans','Son Family','God Ki'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
    ],
  },
  {
    id: 'goku-super-ui',
    name: 'Goku (Super UI)',
    color: '#c0c0e0',
    forms: [
      { form: 'Ultra Instinct -Sign-', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Dodge Skill'], image: jp(91), tags: ['Universal Rep','God Ki','Saiyans','Son Family'], episodes: ['Dragon Ball Super'] },
      { form: 'Ultra Instinct', dp: 9, health: 28000, kiBars: 7, skillPoints: 8, traits: ['Dodge Skill', 'Unblockable Ultimate'], image: jp(83), tags: ['Universal Rep','God Ki','Saiyans','Son Family'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'goku-gt',
    name: 'Goku (GT)',
    color: '#f0b030',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: jp(140), tags: ['GT','Son Family','Saiyans'], episodes: [] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(141), tags: ['GT','Son Family','Saiyans','Super Saiyans'], episodes: [] },
      { form: 'Super Saiyan 3', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(142), tags: ['GT','Son Family','Saiyans'], episodes: [] },
      { form: 'Super Saiyan 4', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(143), tags: ['GT','Son Family','Saiyans'], episodes: [] },
    ],
  },
  {
    id: 'goku-teen',
    name: 'Goku (Teen)',
    color: '#f0b040',
    forms: [
      { form: 'Base', dp: 3, health: 15000, kiBars: 3, skillPoints: 3, traits: ['Dodge Skill'], image: jp(155), tags: ['Dragon Ball Saga','Saiyans','Son Family'], episodes: [] },
      { form: 'NEO Base', dp: 3, health: 15000, kiBars: 3, skillPoints: 3, traits: ['Dodge Skill'], image: neo(8), tags: ['Dragon Ball Saga','Saiyans','Son Family'], episodes: [] },
    ],
  },

  // ======================= VEGETA FORMS =======================
  {
    id: 'vegeta-z-scouter',
    name: 'Vegeta (Z-Scouter)',
    color: '#3a6ee0',
    forms: [
      { form: 'Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(12), tags: ['Saiyans','Vegeta Family','Powerful Opponent','Frieza Force'], episodes: ['Saiyan Saga'] },
    ],
  },
  {
    id: 'great-ape-vegeta',
    name: 'Great Ape Vegeta',
    color: '#5a3e20',
    forms: [
      { form: 'Great Ape', dp: 5, health: 28000, kiBars: 4, skillPoints: 4, traits: [], image: jp(13), tags: ['Vegeta Family','Powerful Opponent','Saiyans','Frieza Force'], episodes: ['Saiyan Saga'] },
    ],
  },
  {
    id: 'vegeta-z-early',
    name: 'Vegeta (Z-Early)',
    color: '#3a6ee0',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: jp(14), tags: ['Saiyans','Vegeta Family'], episodes: ['Cell Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(15), tags: ['Saiyans','Vegeta Family','Super Saiyans'], episodes: ['Cell Saga'] },
      { form: 'Super Vegeta', dp: 6, health: 23000, kiBars: 5, skillPoints: 5, traits: [], image: jp(16), tags: ['Saiyans','Vegeta Family'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'vegeta-z-end',
    name: 'Vegeta (Z-End)',
    color: '#3a6ee0',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: jp(17), tags: ['Saiyans','Vegeta Family'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(18), tags: ['Saiyans','Vegeta Family','Super Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan 2', dp: 6, health: 23000, kiBars: 5, skillPoints: 5, traits: [], image: jp(19), tags: ['Saiyans','Vegeta Family'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'majin-vegeta',
    name: 'Majin Vegeta',
    color: '#3a6ee0',
    forms: [
      { form: 'Base', dp: 7, health: 23000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(20), tags: ['Saiyans','Vegeta Family','Powerful Opponent'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'vegeta-super',
    name: 'Vegeta (Super)',
    color: '#2a5ed0',
    forms: [
      { form: 'Base', dp: 5, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(21), tags: ['Future','Saiyans','Vegeta Family','Universal Rep'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'Super Saiyan', dp: 6, health: 23000, kiBars: 4, skillPoints: 5, traits: [], image: jp(22), tags: ['Future','Saiyans','Vegeta Family','Universal Rep','Super Saiyans'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'Super Saiyan God', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(23), tags: ['Saiyans','Vegeta Family','Universal Rep','God Ki'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'Super Saiyan Blue', dp: 8, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Instant Spark'], image: jp(24), tags: ['Future','Saiyans','Vegeta Family','Universal Rep','God Ki'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
      { form: 'NEO SSGSS (Combined)', dp: 8, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Combined Strike'], image: neo(18), tags: ['Saiyans','Vegeta Family','God Ki'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
    ],
  },
  {
    id: 'vegeta-gt',
    name: 'Vegeta (GT)',
    color: '#3a6ee0',
    forms: [
      { form: 'Super Saiyan 4', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(144), tags: ['GT','Vegeta Family','Saiyans'], episodes: [] },
    ],
  },

  // ======================= GOHAN FORMS =======================
  {
    id: 'gohan-kid',
    name: 'Gohan (Kid)',
    color: '#7b3fbf',
    forms: [
      { form: 'Base', dp: 3, health: 15000, kiBars: 3, skillPoints: 3, traits: [], image: jp(52), tags: ['Hybrid Saiyan','Son Family'], episodes: ['Saiyan Saga','Namek Saga'] },
    ],
  },
  {
    id: 'gohan-teen',
    name: 'Gohan (Teen)',
    color: '#7b3fbf',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: jp(116), tags: ['Hybrid Saiyan','Son Family'], episodes: ['Cell Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(117), tags: ['Hybrid Saiyan','Son Family','Super Saiyans'], episodes: ['Cell Saga'] },
      { form: 'Super Saiyan 2', dp: 7, health: 23000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(118), tags: ['Hybrid Saiyan','Son Family'], episodes: ['Cell Saga'] },
      { form: 'NEO Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: neo(6), tags: ['Hybrid Saiyan','Son Family','Super Saiyans'], episodes: ['Cell Saga'] },
      { form: 'NEO Super Saiyan 2', dp: 7, health: 23000, kiBars: 5, skillPoints: 6, traits: ['Flash Strike'], image: neo(23), tags: ['Hybrid Saiyan','Son Family'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'gohan-adult',
    name: 'Gohan (Adult)',
    color: '#8b4fcf',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(53), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga','Dragon Ball Super'] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(131), tags: ['Son Family','Hybrid Saiyan','Super Saiyans'], episodes: ['Majin Buu Saga','Dragon Ball Super'] },
      { form: 'Super Saiyan 2', dp: 7, health: 23000, kiBars: 5, skillPoints: 6, traits: [], image: jp(84), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga','Dragon Ball Super'] },
      { form: 'NEO Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: ['Family Triple Kamehameha'], image: neo(24), tags: ['Son Family','Hybrid Saiyan','Super Saiyans'], episodes: ['Majin Buu Saga','Sagas from the Movies'] },
      { form: 'NEO Base (Punch Rush)', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: ['Punishment Rush'], image: neo(25), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga'] },
      { form: 'NEO Base (Z Sword)', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: ['Z Sword Slash'], image: neo(26), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'great-saiyaman',
    name: 'Great Saiyaman',
    color: '#6a8f2f',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(132), tags: ['Hybrid Saiyan','Son Family'], episodes: ['Majin Buu Saga','Sagas from the Movies'] },
    ],
  },
  {
    id: 'ultimate-gohan',
    name: 'Ultimate Gohan',
    color: '#8b4fcf',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 7, traits: ['Instant Spark'], image: jp(133), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'gohan-future',
    name: 'Gohan (Future)',
    color: '#8b4fcf',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(54), tags: ['Future','Son Family','Hybrid Saiyan'], episodes: [] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(55), tags: ['Future','Son Family','Hybrid Saiyan','Super Saiyans'], episodes: [] },
    ],
  },
  {
    id: 'gohan-sh',
    name: 'Gohan (Super Hero)',
    color: '#8b4fcf',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(183), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(184), tags: ['Son Family','Hybrid Saiyan','Super Saiyans'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Ultimate', dp: 8, health: 24000, kiBars: 5, skillPoints: 7, traits: ['Instant Spark'], image: jp(185), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Beast', dp: 9, health: 26000, kiBars: 6, skillPoints: 8, traits: ['Unblockable Ultimate'], image: jp(186), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },

  // ======================= PICCOLO / NAMEKIAN =======================
  {
    id: 'piccolo',
    name: 'Piccolo',
    color: '#3fae5a',
    forms: [
      { form: 'Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: ['Health Regeneration'], image: jp(25), tags: ['Regeneration'], episodes: ['Saiyan Saga'] },
      { form: 'NEO Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: ['Health Regeneration', 'Makosen Geki'], image: neo(2), tags: ['Regeneration'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'piccolo-kami',
    name: 'Piccolo (Fused With Kami)',
    color: '#3fae5a',
    forms: [
      { form: 'Base', dp: 5, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(119), tags: ['Fusion Warrior','Regeneration'], episodes: ['Saiyan Saga'] },
      { form: 'NEO Base', dp: 5, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration', 'Makankosappo Combo'], image: neo(14), tags: ['Fusion Warrior','Regeneration','Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'piccolo-sh',
    name: 'Piccolo (Super Hero)',
    color: '#3fae5a',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(187), tags: ['Regeneration'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Power Awakening', dp: 6, health: 23000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration'], image: jp(188), tags: ['Regeneration'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Orange Piccolo', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(189), tags: ['Regeneration','God Ki'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Giant Orange Piccolo', dp: 8, health: 28000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(190), tags: ['Regeneration','God Ki'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },
  {
    id: 'nail',
    name: 'Nail',
    color: '#3fae5a',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 3, traits: ['Health Regeneration'], image: jp(101), tags: ['Regeneration'], episodes: ['Namek Saga'] },
    ],
  },

  // ======================= Z FIGHTERS / EARTHLINGS =======================
  {
    id: 'krillin',
    name: 'Krillin',
    color: '#e0a83a',
    forms: [
      { form: 'Base', dp: 3, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: jp(26), tags: ['Earthling'], episodes: ['Saiyan Saga','Namek Saga'] },
      { form: 'NEO Base', dp: 3, health: 16000, kiBars: 3, skillPoints: 3, traits: ['Round Cannon Ball'], image: neo(15), tags: ['Earthling','Universal Rep'], episodes: ['Namek Saga','Dragon Ball Super'] },
    ],
  },
  {
    id: 'yamcha',
    name: 'Yamcha',
    color: '#a86a4a',
    forms: [
      { form: 'Base', dp: 3, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: jp(27), tags: ['Earthling'], episodes: ['Namek Saga','Saiyan Saga'] },
    ],
  },
  {
    id: 'tien',
    name: 'Tien',
    color: '#c88a3a',
    forms: [
      { form: 'Base', dp: 4, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(28), tags: ['Earthling'], episodes: ['Namek Saga','Saiyan Saga'] },
    ],
  },
  {
    id: 'chiaotzu',
    name: 'Chiaotzu',
    color: '#e0d0b0',
    forms: [
      { form: 'Base', dp: 2, health: 12000, kiBars: 3, skillPoints: 2, traits: [], image: jp(107), tags: ['Earthling'], episodes: ['Saiyan Saga','Namek Saga'] },
    ],
  },
  {
    id: 'yajirobe',
    name: 'Yajirobe',
    color: '#a08050',
    forms: [
      { form: 'Base', dp: 3, health: 15000, kiBars: 2, skillPoints: 3, traits: [], image: jp(94), tags: ['Earthling'], episodes: ['Saiyan Saga'] },
    ],
  },
  {
    id: 'videl',
    name: 'Videl',
    color: '#d060a0',
    forms: [
      { form: 'Base', dp: 2, health: 14000, kiBars: 2, skillPoints: 2, traits: [], image: jp(58), tags: ['Girls','Earthling'], episodes: ['Majin Buu Saga'] },
      { form: 'NEO Base', dp: 2, health: 14000, kiBars: 2, skillPoints: 2, traits: [], image: neo(12), tags: ['Girls','Earthling'], episodes: ['Sagas from the Movies'] },
      { form: 'NEO Costume 3', dp: 2, health: 14000, kiBars: 2, skillPoints: 2, traits: ['Justice Judgement'], image: neo(1), tags: ['Girls','Earthling'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'mr-satan',
    name: 'Mr. Satan',
    color: '#b06020',
    forms: [
      { form: 'Base', dp: 1, health: 12000, kiBars: 2, skillPoints: 1, traits: [], image: jp(34), tags: ['Earthling'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'master-roshi',
    name: 'Master Roshi',
    color: '#d0b060',
    forms: [
      { form: 'Base', dp: 2, health: 15000, kiBars: 3, skillPoints: 3, traits: [], image: jp(59), tags: ['Universal Rep','Dragon Ball Saga','Earthling'], episodes: ['Saiyan Saga','Dragon Ball Super'] },
      { form: 'Max Power', dp: 5, health: 19000, kiBars: 4, skillPoints: 4, traits: [], image: jp(42), tags: ['Universal Rep','Dragon Ball Saga','Earthling'], episodes: ['Saiyan Saga','Dragon Ball Super'] },
    ],
  },

  // ======================= TRUNKS =======================
  {
    id: 'trunks-sword',
    name: 'Trunks (Sword)',
    color: '#4a8fd0',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(56), tags: ['Future','Hybrid Saiyan','Vegeta Family'], episodes: ['Cell Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(57), tags: ['Future','Hybrid Saiyan','Vegeta Family','Super Saiyans'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'trunks-melee',
    name: 'Trunks (Melee)',
    color: '#4a8fd0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(120), tags: ['Vegeta Family','Hybrid Saiyan','Future'], episodes: ['Cell Saga'] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(29), tags: ['Vegeta Family','Hybrid Saiyan','Future','Super Saiyans'], episodes: ['Cell Saga'] },
      { form: 'Super Trunks', dp: 6, health: 22000, kiBars: 5, skillPoints: 5, traits: [], image: jp(41), tags: ['Vegeta Family','Hybrid Saiyan','Future','Super Saiyans'], episodes: ['Cell Saga'] },
      { form: 'NEO Base', dp: 5, health: 20000, kiBars: 3, skillPoints: 4, traits: ['No Super Trunks'], image: neo(10), tags: ['Vegeta Family','Hybrid Saiyan','Future'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'future-trunks',
    name: 'Future Trunks',
    color: '#4a8fd0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(92), tags: ['Hybrid Saiyan','Future','Vegeta Family'], episodes: [] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(30), tags: ['Hybrid Saiyan','Future','Vegeta Family','Super Saiyans'], episodes: [] },
    ],
  },
  {
    id: 'trunks-kid',
    name: 'Trunks (Kid)',
    color: '#4a8fd0',
    forms: [
      { form: 'Base', dp: 4, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: jp(62), tags: ['Hybrid Saiyan','Vegeta Family'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan', dp: 5, health: 18000, kiBars: 4, skillPoints: 4, traits: [], image: jp(63), tags: ['Hybrid Saiyan','Vegeta Family','Super Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'NEO Base', dp: 4, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: neo(11), tags: ['Hybrid Saiyan','Vegeta Family'], episodes: ['Sagas from the Movies'] },
    ],
  },

  // ======================= GOTEN / FUSIONS =======================
  {
    id: 'goten',
    name: 'Goten',
    color: '#f09030',
    forms: [
      { form: 'Base', dp: 4, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: jp(64), tags: ['Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan', dp: 7, health: 19000, kiBars: 4, skillPoints: 5, traits: [], image: jp(65), tags: ['Son Family','Hybrid Saiyan','Super Saiyans'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'gotenks',
    name: 'Gotenks',
    color: '#d04a8f',
    forms: [
      { form: 'Base', dp: 6, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(71), tags: ['Hybrid Saiyan','Son Family','Vegeta Family','Fusion Warrior'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan', dp: 7, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(72), tags: ['Hybrid Saiyan','Son Family','Vegeta Family','Super Saiyans','Fusion Warrior'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan 3', dp: 8, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(73), tags: ['Hybrid Saiyan','Son Family','Vegeta Family','Fusion Warrior'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'vegito',
    name: 'Vegito',
    color: '#3a5ed0',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(66), tags: ['Vegeta Family','Son Family','Saiyans','Fusion Warrior'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Vegito', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Instant Spark'], image: jp(93), tags: ['Vegeta Family','Son Family','Saiyans','Fusion Warrior','Super Saiyans'], episodes: ['Majin Buu Saga'] },
      { form: 'Super Saiyan Blue', dp: 10, health: 28000, kiBars: 7, skillPoints: 8, traits: ['Unblockable Ultimate', 'Instant Spark'], image: jp(67), tags: ['Vegeta Family','Son Family','Saiyans','Fusion Warrior','God Ki'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'super-gogeta-z',
    name: 'Super Gogeta (Z)',
    color: '#e05a30',
    forms: [
      { form: 'Base', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Instant Spark'], image: jp(156), tags: ['Saiyans','Super Saiyans','Fusion Warrior','Son Family','Vegeta Family','Otherworld Warrior'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'gogeta-super',
    name: 'Gogeta (Super)',
    color: '#e05a30',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(68), tags: ['Vegeta Family','Saiyans','Son Family','Fusion Warrior'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Super Saiyan', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Instant Spark'], image: jp(69), tags: ['Vegeta Family','Saiyans','Son Family','Super Saiyans','Fusion Warrior'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Super Saiyan Blue', dp: 10, health: 28000, kiBars: 7, skillPoints: 8, traits: ['Unblockable Ultimate', 'Instant Spark'], image: jp(70), tags: ['Vegeta Family','Saiyans','Son Family','God Ki','Fusion Warrior'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },
  {
    id: 'gogeta-gt',
    name: 'Gogeta (GT)',
    color: '#e05a30',
    forms: [
      { form: 'Super Saiyan 4', dp: 10, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Instant Spark'], image: jp(145), tags: ['GT','Fusion Warrior','Son Family','Vegeta Family','Saiyans'], episodes: [] },
    ],
  },

  // ======================= FRIEZA / FRIEZA FORCE =======================
  {
    id: 'frieza-z',
    name: 'Frieza (Z)',
    color: '#b04ad0',
    forms: [
      { form: '1st Form', dp: 5, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(102), tags: ['Powerful Opponent','Frieza Force','Lineage of Evil'], episodes: ['Namek Saga'] },
      { form: '2nd Form', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: [], image: jp(103), tags: ['Powerful Opponent','Frieza Force','Lineage of Evil'], episodes: ['Namek Saga'] },
      { form: '3rd Form', dp: 5, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(104), tags: ['Powerful Opponent','Frieza Force','Lineage of Evil'], episodes: ['Namek Saga'] },
      { form: '4th Form', dp: 6, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(105), tags: ['Powerful Opponent','Frieza Force','Lineage of Evil'], episodes: ['Namek Saga'] },
      { form: 'Full Power', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(106), tags: ['Powerful Opponent','Frieza Force','Lineage of Evil'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'mecha-frieza',
    name: 'Mecha Frieza',
    color: '#a04ab0',
    forms: [
      { form: 'Base', dp: 6, health: 22000, kiBars: 5, skillPoints: 5, traits: [], image: jp(121), tags: ['Frieza Force'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'frieza-super',
    name: 'Frieza (Super)',
    color: '#b04ad0',
    forms: [
      { form: 'Base', dp: 6, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(31), tags: ['Frieza Force','Otherworld Warrior','Lineage of Evil','Universal Rep','Powerful Opponent'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Golden', dp: 8, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Instant Spark'], image: jp(85), tags: ['Frieza Force','Otherworld Warrior','Lineage of Evil','Universal Rep','Powerful Opponent'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'NEO Base (Corp Rising)', dp: 6, health: 22000, kiBars: 5, skillPoints: 6, traits: ['Corp Rising'], image: neo(17), tags: ['Frieza Force','Otherworld Warrior','Lineage of Evil','Universal Rep'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },
  {
    id: 'king-cold',
    name: 'King Cold',
    color: '#8040a0',
    forms: [
      { form: 'Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(126), tags: ['Frieza Force','Lineage of Evil'], episodes: ['Cell Saga','Sagas from the Movies'] },
    ],
  },
  {
    id: 'zarbon',
    name: 'Zarbon',
    color: '#40b080',
    forms: [
      { form: 'Base', dp: 3, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(109), tags: ['Minion','Frieza Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'super-zarbon',
    name: 'Super Zarbon',
    color: '#40a070',
    forms: [
      { form: 'Base', dp: 3, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: jp(110), tags: ['Minion','Frieza Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'dodoria',
    name: 'Dodoria',
    color: '#d06080',
    forms: [
      { form: 'Base', dp: 3, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(111), tags: ['Minion','Frieza Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'cui',
    name: 'Cui',
    color: '#6060a0',
    forms: [
      { form: 'Base', dp: 4, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(112), tags: ['Minion','Frieza Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'ginyu',
    name: 'Captain Ginyu',
    color: '#8040a0',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(113), tags: ['Minion','Frieza Force','Ginyu Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'recoome',
    name: 'Recoome',
    color: '#c06030',
    forms: [
      { form: 'Base', dp: 3, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: jp(114), tags: ['Minion','Frieza Force','Ginyu Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'burter',
    name: 'Burter',
    color: '#4060c0',
    forms: [
      { form: 'Base', dp: 3, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(44), tags: ['Minion','Frieza Force','Ginyu Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'jeice',
    name: 'Jeice',
    color: '#d04040',
    forms: [
      { form: 'Base', dp: 3, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(45), tags: ['Minion','Frieza Force','Ginyu Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'guldo',
    name: 'Guldo',
    color: '#60a040',
    forms: [
      { form: 'Base', dp: 2, health: 13000, kiBars: 3, skillPoints: 2, traits: [], image: jp(115), tags: ['Minion','Frieza Force','Ginyu Force'], episodes: ['Namek Saga'] },
    ],
  },
  {
    id: 'frieza-force-soldier',
    name: 'Frieza Force Soldier',
    color: '#606080',
    forms: [
      { form: 'Base', dp: 2, health: 12000, kiBars: 2, skillPoints: 2, traits: [], image: jp(157), tags: ['Minion'], episodes: ['Namek Saga'] },
    ],
  },

  // ======================= ANDROIDS / CELL =======================
  {
    id: 'android-16',
    name: 'Android 16',
    color: '#4a9050',
    forms: [
      { form: 'Base', dp: 5, health: 22000, kiBars: 4, skillPoints: 4, traits: [], image: jp(127), tags: ['Android'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'android-17-z',
    name: 'Android 17 (Z)',
    color: '#4aa0c0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: ['Health Regeneration'], image: jp(128), tags: ['Android','Future'], episodes: ['Cell Saga'] },
      { form: 'NEO Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: ['Health Regeneration', 'Hell Combination', 'Super 17 Fusion'], image: neo(27), tags: ['Android','GT'], episodes: [] },
    ],
  },
  {
    id: 'android-17-super',
    name: 'Android 17 (Super)',
    color: '#4aa0c0',
    forms: [
      { form: 'Base', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(35), tags: ['Android','Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'android-18',
    name: 'Android 18',
    color: '#5ab0d0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: ['Health Regeneration'], image: jp(36), tags: ['Android','Universal Rep','Girls','Future'], episodes: ['Cell Saga'] },
      { form: 'NEO Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: ['Health Regeneration'], image: neo(13), tags: ['GT','Android','Girls'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'android-19',
    name: 'Android 19',
    color: '#e0e0e0',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: jp(129), tags: ['Android'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'dr-gero',
    name: 'Dr. Gero',
    color: '#606060',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: jp(130), tags: ['Android'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'cell',
    name: 'Cell',
    color: '#6abf4a',
    forms: [
      { form: '1st Form', dp: 5, health: 20000, kiBars: 3, skillPoints: 4, traits: ['Health Regeneration'], image: jp(122), tags: ['Regeneration','Android','Powerful Opponent','Future'], episodes: ['Cell Saga'] },
      { form: '2nd Form', dp: 5, health: 21000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(123), tags: ['Regeneration','Android','Powerful Opponent','Future'], episodes: ['Cell Saga'] },
      { form: 'Perfect Form', dp: 6, health: 22000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration'], image: jp(32), tags: ['Regeneration','Android','Powerful Opponent','Future'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'perfect-cell',
    name: 'Perfect Cell',
    color: '#6abf4a',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(124), tags: ['Future','Android','Powerful Opponent','Regeneration'], episodes: ['Cell Saga'] },
    ],
  },
  {
    id: 'cell-jr',
    name: 'Cell Jr.',
    color: '#50a0e0',
    forms: [
      { form: 'Base', dp: 3, health: 14000, kiBars: 3, skillPoints: 3, traits: [], image: jp(125), tags: ['Regeneration','Android'], episodes: ['Cell Saga'] },
    ],
  },

  // ======================= MAJIN =======================
  {
    id: 'majin-buu',
    name: 'Majin Buu',
    color: '#e88ad0',
    forms: [
      { form: 'Base', dp: 6, health: 24000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(33), tags: ['Regeneration','Powerful Opponent'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'majin-buu-evil',
    name: 'Majin Buu (Evil)',
    color: '#c070b0',
    forms: [
      { form: 'Base', dp: 6, health: 24000, kiBars: 5, skillPoints: 5, traits: ['Health Regeneration'], image: jp(134), tags: ['Powerful Opponent','Regeneration'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'super-buu',
    name: 'Super Buu',
    color: '#d06ab0',
    forms: [
      { form: 'Base', dp: 6, health: 25000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration'], image: jp(135), tags: ['Powerful Opponent','Regeneration'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'super-buu-gotenks',
    name: 'Super Buu (Gotenks)',
    color: '#d06ab0',
    forms: [
      { form: 'Base', dp: 7, health: 26000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(136), tags: ['Powerful Opponent','Regeneration'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'super-buu-gohan',
    name: 'Super Buu (Gohan)',
    color: '#d06ab0',
    forms: [
      { form: 'Base', dp: 7, health: 27000, kiBars: 6, skillPoints: 7, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(137), tags: ['Powerful Opponent','Regeneration'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'kid-buu',
    name: 'Kid Buu',
    color: '#e88ad0',
    forms: [
      { form: 'Base', dp: 7, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(138), tags: ['Powerful Opponent','Regeneration'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'babidi',
    name: 'Babidi',
    color: '#e0c030',
    forms: [
      { form: 'Base', dp: 3, health: 12000, kiBars: 3, skillPoints: 2, traits: [], image: jp(139), tags: [], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'dabura',
    name: 'Dabura',
    color: '#9a3a3a',
    forms: [
      { form: 'Base', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(95), tags: [], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'spopovich',
    name: 'Spopovich',
    color: '#a08060',
    forms: [
      { form: 'Base', dp: 2, health: 14000, kiBars: 2, skillPoints: 2, traits: [], image: jp(96), tags: ['Minion'], episodes: ['Majin Buu Saga'] },
    ],
  },

  // ======================= SAIYANS (OTHER) =======================
  {
    id: 'raditz',
    name: 'Raditz',
    color: '#8a5a2a',
    forms: [
      { form: 'Base', dp: 3, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: jp(87), tags: ['Saiyans','Son Family'], episodes: ['Saiyan Saga'] },
    ],
  },
  {
    id: 'saibaman',
    name: 'Saibaman',
    color: '#40a030',
    forms: [
      { form: 'Base', dp: 3, health: 12000, kiBars: 2, skillPoints: 2, traits: [], image: jp(108), tags: ['Minion'], episodes: ['Saiyan Saga'] },
    ],
  },
  {
    id: 'nappa',
    name: 'Nappa',
    color: '#6a4a2a',
    forms: [
      { form: 'Base', dp: 3, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(43), tags: ['Saiyans'], episodes: ['Saiyan Saga'] },
    ],
  },

  // ======================= BROLY =======================
  {
    id: 'broly-z',
    name: 'Broly (Z)',
    color: '#3aae7a',
    forms: [
      { form: 'Base', dp: 5, health: 24000, kiBars: 4, skillPoints: 5, traits: [], image: jp(158), tags: ['Powerful Opponent','Saiyans'], episodes: ['Sagas from the Movies'] },
      { form: 'Super Saiyan', dp: 7, health: 26000, kiBars: 5, skillPoints: 6, traits: [], image: jp(159), tags: ['Powerful Opponent','Saiyans','Super Saiyans'], episodes: ['Sagas from the Movies'] },
      { form: 'Legendary Super Saiyan', dp: 9, health: 30000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(160), tags: ['Powerful Opponent','Saiyans','Super Saiyans'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'broly-super',
    name: 'Broly (Super)',
    color: '#2a9e6a',
    forms: [
      { form: 'Base', dp: 5, health: 24000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(37), tags: ['Saiyans','Frieza Force','Powerful Opponent'], episodes: ['Sagas from the Movies'] },
      { form: 'Super Saiyan', dp: 7, health: 27000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration'], image: jp(38), tags: ['Saiyans','Powerful Opponent','Super Saiyans'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
      { form: 'Super Saiyan Full Power', dp: 9, health: 30000, kiBars: 6, skillPoints: 7, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(46), tags: ['Saiyans','Powerful Opponent','Super Saiyans'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },

  // ======================= GODS / ANGELS =======================
  {
    id: 'beerus',
    name: 'Beerus',
    color: '#8a5ad0',
    forms: [
      { form: 'Base', dp: 10, health: 26000, kiBars: 6, skillPoints: 8, traits: ['Dodge Skill', 'Instant Spark'], image: jp(60), tags: ['Powerful Opponent','God Ki'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },
  {
    id: 'whis',
    name: 'Whis',
    color: '#4ab0d0',
    forms: [
      { form: 'Base', dp: 10, health: 25000, kiBars: 6, skillPoints: 8, traits: ['Dodge Skill', 'Health Regeneration'], image: jp(61), tags: ['God Ki'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },

  // ======================= GOKU BLACK / ZAMASU =======================
  {
    id: 'goku-black',
    name: 'Goku Black',
    color: '#c04a6a',
    forms: [
      { form: 'Base', dp: 5, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(88), tags: ['Future','Saiyans','Powerful Opponent'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan Rosé', dp: 8, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(97), tags: ['Future','Saiyans','Powerful Opponent','God Ki'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'zamasu',
    name: 'Zamasu',
    color: '#3aae8a',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(89), tags: ['Regeneration','Future','Powerful Opponent','God Ki'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'fused-zamasu',
    name: 'Fused Zamasu',
    color: '#3aae8a',
    forms: [
      { form: 'Base', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(74), tags: ['Fusion Warrior','God Ki','Regeneration','Powerful Opponent','Future'], episodes: ['Dragon Ball Super'] },
      { form: 'Half-Corrupted', dp: 9, health: 28000, kiBars: 6, skillPoints: 8, traits: ['Health Regeneration', 'Unblockable Ultimate'], image: jp(75), tags: ['Fusion Warrior','God Ki','Powerful Opponent','Future'], episodes: ['Dragon Ball Super'] },
    ],
  },

  // ======================= UNIVERSE 6 =======================
  {
    id: 'hit',
    name: 'Hit',
    color: '#4a4ad0',
    forms: [
      { form: 'Base', dp: 8, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Dodge Skill'], image: jp(47), tags: ['Universal Rep','Powerful Opponent'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'frost',
    name: 'Frost',
    color: '#60a0d0',
    forms: [
      { form: 'Base', dp: 6, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(177), tags: ['Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'cabba',
    name: 'Cabba',
    color: '#6a8ad0',
    forms: [
      { form: 'Base', dp: 5, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(178), tags: ['Saiyans','Universal Rep'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan', dp: 6, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(179), tags: ['Saiyans','Universal Rep','Super Saiyans'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan 2', dp: 7, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(180), tags: ['Saiyans','Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'caulifla',
    name: 'Caulifla',
    color: '#d05060',
    forms: [
      { form: 'Base', dp: 5, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(76), tags: ['Saiyans','Universal Rep','Girls'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan 2', dp: 7, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(77), tags: ['Saiyans','Universal Rep','Girls'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'kale',
    name: 'Kale',
    color: '#40a060',
    forms: [
      { form: 'Base', dp: 5, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(78), tags: ['Girls','Saiyans','Universal Rep'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(79), tags: ['Girls','Saiyans','Universal Rep','Super Saiyans'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan (Berserk)', dp: 7, health: 25000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(48), tags: ['Girls','Universal Rep','Saiyans','Super Saiyans'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'kefla',
    name: 'Kefla',
    color: '#5ad0a0',
    forms: [
      { form: 'Base', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(80), tags: ['Saiyans','Universal Rep','Powerful Opponent','Girls','Fusion Warrior'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Instant Spark'], image: jp(81), tags: ['Saiyans','Universal Rep','Powerful Opponent','Girls','Fusion Warrior','Super Saiyans'], episodes: ['Dragon Ball Super'] },
      { form: 'Super Saiyan 2', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(82), tags: ['Saiyans','Universal Rep','Powerful Opponent','Girls','Fusion Warrior'], episodes: ['Dragon Ball Super'] },
    ],
  },

  // ======================= UNIVERSE 11 / TOURNAMENT =======================
  {
    id: 'jiren',
    name: 'Jiren',
    color: '#c03a3a',
    forms: [
      { form: 'Base', dp: 8, health: 27000, kiBars: 6, skillPoints: 7, traits: ['Dodge Skill'], image: jp(39), tags: ['Powerful Opponent','Universal Rep'], episodes: ['Dragon Ball Super'] },
      { form: 'Full Power', dp: 9, health: 30000, kiBars: 7, skillPoints: 8, traits: ['Dodge Skill', 'Unblockable Ultimate'], image: jp(90), tags: ['Powerful Opponent','Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'toppo',
    name: 'Toppo',
    color: '#c06040',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(49), tags: ['Universal Rep','Powerful Opponent'], episodes: ['Dragon Ball Super'] },
      { form: 'God of Destruction', dp: 8, health: 27000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(181), tags: ['Universal Rep','Powerful Opponent'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'dyspo',
    name: 'Dyspo',
    color: '#a050c0',
    forms: [
      { form: 'Base', dp: 6, health: 20000, kiBars: 4, skillPoints: 5, traits: ['Dodge Skill'], image: jp(50), tags: ['Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'bergamo',
    name: 'Bergamo',
    color: '#5070a0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(40), tags: ['Universal Rep'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'ribrianne',
    name: 'Ribrianne',
    color: '#d060a0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: [], image: jp(98), tags: ['Universal Rep','Girls'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'kakunsa',
    name: 'Kakunsa',
    color: '#c04060',
    forms: [
      { form: 'Base', dp: 5, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(51), tags: ['Universal Rep','Girls'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'roasie',
    name: 'Roasie',
    color: '#e080a0',
    forms: [
      { form: 'Base', dp: 5, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(99), tags: ['Universal Rep','Girls'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'anilaza',
    name: 'Anilaza',
    color: '#406080',
    forms: [
      { form: 'Base', dp: 8, health: 30000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(100), tags: ['Universal Rep','Powerful Opponent'], episodes: ['Dragon Ball Super'] },
    ],
  },

  // ======================= MOVIE VILLAINS =======================
  {
    id: 'super-garlic-jr',
    name: 'Super Garlic Jr.',
    color: '#30a060',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: jp(161), tags: ['Powerful Opponent'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'dr-wheelo',
    name: 'Dr. Wheelo',
    color: '#606080',
    forms: [
      { form: 'Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(162), tags: ['Powerful Opponent','Android'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'turles',
    name: 'Turles',
    color: '#5a4020',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(163), tags: ['Saiyans','Powerful Opponent','Frieza Force'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'lord-slug',
    name: 'Lord Slug',
    color: '#408040',
    forms: [
      { form: 'Base', dp: 4, health: 20000, kiBars: 3, skillPoints: 4, traits: [], image: jp(164), tags: ['Powerful Opponent','Regeneration'], episodes: ['Sagas from the Movies'] },
      { form: 'Giant Form', dp: 6, health: 28000, kiBars: 4, skillPoints: 5, traits: [], image: jp(165), tags: ['Powerful Opponent','Regeneration'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'cooler',
    name: 'Cooler',
    color: '#7a4ad0',
    forms: [
      { form: 'Base', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(166), tags: ['Powerful Opponent','Lineage of Evil'], episodes: ['Sagas from the Movies'] },
      { form: 'Final Form', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(167), tags: ['Powerful Opponent','Lineage of Evil'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'metal-cooler',
    name: 'Metal Cooler',
    color: '#808090',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Health Regeneration'], image: jp(168), tags: ['Powerful Opponent','Regeneration','Android','Lineage of Evil'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'android-13',
    name: 'Android 13',
    color: '#4080c0',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 4, traits: [], image: jp(169), tags: ['Android','Powerful Opponent'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'fusion-android-13',
    name: 'Fusion Android 13',
    color: '#5060c0',
    forms: [
      { form: 'Base', dp: 7, health: 26000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(170), tags: ['Powerful Opponent','Android'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'bojack',
    name: 'Bojack',
    color: '#308060',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(171), tags: ['Powerful Opponent'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'full-power-bojack',
    name: 'Full-Power Bojack',
    color: '#308060',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(172), tags: ['Powerful Opponent'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'janemba',
    name: 'Janemba',
    color: '#e0c040',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(173), tags: ['Powerful Opponent','Regeneration','Fusion Warrior','Otherworld Warrior'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'super-janemba',
    name: 'Super Janemba',
    color: '#c04040',
    forms: [
      { form: 'Base', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(174), tags: ['Regeneration','Powerful Opponent','Fusion Warrior','Otherworld Warrior'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'tapion',
    name: 'Tapion',
    color: '#b05030',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: jp(175), tags: [], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'hirudegarn',
    name: 'Hirudegarn',
    color: '#604020',
    forms: [
      { form: 'Base', dp: 6, health: 30000, kiBars: 4, skillPoints: 5, traits: [], image: jp(176), tags: ['Powerful Opponent'], episodes: ['Sagas from the Movies'] },
    ],
  },

  // ======================= GT =======================
  {
    id: 'pan-gt',
    name: 'Pan (GT)',
    color: '#d06040',
    forms: [
      { form: 'Base', dp: 3, health: 14000, kiBars: 3, skillPoints: 3, traits: [], image: jp(146), tags: ['GT','Son Family','Hybrid Saiyan','Girls'], episodes: [] },
    ],
  },
  {
    id: 'uub-gt',
    name: 'Uub (GT)',
    color: '#a06040',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(147), tags: ['GT','Earthling'], episodes: [] },
    ],
  },
  {
    id: 'majuub-gt',
    name: 'Majuub (GT)',
    color: '#a06040',
    forms: [
      { form: 'Base', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: jp(148), tags: ['GT','Fusion Warrior','Regeneration','Earthling'], episodes: [] },
    ],
  },
  {
    id: 'baby-vegeta',
    name: 'Baby Vegeta (GT)',
    color: '#6060a0',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: jp(149), tags: ['GT','Saiyans','Powerful Opponent'], episodes: [] },
    ],
  },
  {
    id: 'super-baby-1',
    name: 'Super Baby 1 (GT)',
    color: '#6060a0',
    forms: [
      { form: 'Base', dp: 6, health: 23000, kiBars: 5, skillPoints: 6, traits: [], image: jp(150), tags: ['Saiyans','Powerful Opponent','GT'], episodes: [] },
    ],
  },
  {
    id: 'super-baby-2',
    name: 'Super Baby 2 (GT)',
    color: '#6060a0',
    forms: [
      { form: 'Base', dp: 7, health: 25000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(151), tags: ['Saiyans','Powerful Opponent','GT','Regeneration'], episodes: [] },
    ],
  },
  {
    id: 'great-ape-baby',
    name: 'Great Ape Baby (GT)',
    color: '#8060a0',
    forms: [
      { form: 'Base', dp: 7, health: 30000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: jp(152), tags: ['Saiyans','Powerful Opponent','GT'], episodes: [] },
    ],
  },
  {
    id: 'syn-shenron',
    name: 'Syn Shenron',
    color: '#a04040',
    forms: [
      { form: 'Base', dp: 7, health: 25000, kiBars: 5, skillPoints: 6, traits: [], image: jp(153), tags: ['Powerful Opponent','GT'], episodes: [] },
    ],
  },
  {
    id: 'omega-shenron',
    name: 'Omega Shenron (GT)',
    color: '#c04040',
    forms: [
      { form: 'Base', dp: 8, health: 28000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(154), tags: ['Powerful Opponent','GT','Fusion Warrior'], episodes: [] },
    ],
  },

  // ======================= DLC — SUPER HERO =======================
  {
    id: 'gamma-1',
    name: 'Gamma 1',
    color: '#d04040',
    forms: [
      { form: 'Base', dp: 7, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(191), tags: ['Android'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },
  {
    id: 'gamma-2',
    name: 'Gamma 2',
    color: '#4060c0',
    forms: [
      { form: 'Base', dp: 7, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(192), tags: ['Android'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },
  {
    id: 'cell-max',
    name: 'Cell Max',
    color: '#c04030',
    forms: [
      { form: 'Base', dp: 9, health: 32000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(193), tags: ['Powerful Opponent','Android'], episodes: ['Sagas from the Movies','Dragon Ball Super'] },
    ],
  },

  // ======================= DAIMA DLC =======================
  {
    id: 'goku-mini',
    name: 'Goku (Mini)',
    color: '#f0a020',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: jp(182), tags: ['Saiyans','Son Family'], episodes: ['Daima'] },
      { form: 'Super Saiyan', dp: 5, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(194), tags: ['Saiyans','Son Family','Super Saiyans'], episodes: ['Daima'] },
      { form: 'Super Saiyan 4', dp: 7, health: 24000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(203), tags: ['Saiyans','Son Family'], episodes: ['Daima'] },
    ],
  },
  {
    id: 'vegeta-mini',
    name: 'Vegeta (Mini)',
    color: '#3a6ee0',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: jp(195), tags: ['Vegeta Family','Saiyans'], episodes: ['Daima'] },
      { form: 'Super Saiyan', dp: 5, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(196), tags: ['Vegeta Family','Saiyans','Super Saiyans'], episodes: ['Daima'] },
      { form: 'Super Saiyan 2', dp: 6, health: 22000, kiBars: 5, skillPoints: 6, traits: [], image: jp(197), tags: ['Vegeta Family','Saiyans'], episodes: ['Daima'] },
      { form: 'Super Saiyan 3', dp: 7, health: 23000, kiBars: 5, skillPoints: 6, traits: [], image: jp(198), tags: ['Vegeta Family','Saiyans'], episodes: ['Daima'] },
    ],
  },
  {
    id: 'glorio',
    name: 'Glorio',
    color: '#6a7090',
    forms: [
      { form: 'Base', dp: 4, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: jp(199), tags: [], episodes: ['Daima'] },
    ],
  },
  {
    id: 'panzy',
    name: 'Panzy',
    color: '#e080b0',
    forms: [
      { form: 'Base', dp: 2, health: 13000, kiBars: 2, skillPoints: 2, traits: [], image: jp(200), tags: [], episodes: ['Daima'] },
    ],
  },
  {
    id: 'majin-kuu',
    name: 'Majin Kuu',
    color: '#d06ab0',
    forms: [
      { form: 'Base', dp: 4, health: 22000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: jp(201), tags: ['Regeneration'], episodes: ['Daima'] },
    ],
  },

  // ======================= DAIMA DLC PACK 2 =======================
  {
    id: 'goku-daima',
    name: 'Goku DAIMA',
    color: '#e09020',
    forms: [
      { form: 'Super Saiyan 4', dp: 8, health: 26000, kiBars: 6, skillPoints: 7, traits: ['Unblockable Ultimate'], image: jp(204), tags: ['Saiyans','Son Family'], episodes: ['Daima'] },
    ],
  },
  {
    id: 'vegeta-daima',
    name: 'Vegeta DAIMA',
    color: '#2a5ed0',
    forms: [
      { form: 'Super Saiyan 3', dp: 7, health: 24000, kiBars: 5, skillPoints: 6, traits: [], image: jp(205), tags: ['Vegeta Family','Saiyans'], episodes: ['Daima'] },
    ],
  },
  {
    id: 'majin-duu',
    name: 'Majin Duu',
    color: '#e88ad0',
    forms: [
      { form: 'Base', dp: 7, health: 20000, kiBars: 4, skillPoints: 4, traits: ['Health Regeneration'], image: jp(206), tags: ['Regeneration'], episodes: ['Daima'] },
    ],
  },
  {
    id: 'third-eye-gomah',
    name: 'Third Eye Gomah',
    color: '#a04060',
    forms: [
      { form: 'Base', dp: 7, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: jp(207), tags: ['Regeneration','Powerful Opponent'], episodes: ['Daima'] },
      { form: 'Giant Gomah', dp: 8, health: 28000, kiBars: 4, skillPoints: 5, traits: ['Unblockable Ultimate'], image: jp(208), tags: ['Regeneration','Powerful Opponent'], episodes: ['Daima'] },
    ],
  },

  // ======================= SHALLOT (DB LEGENDS DLC) =======================
  {
    id: 'shallot',
    name: 'Shallot',
    color: '#d0a040',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: jp(202), tags: ['Saiyans'], episodes: [] },
    ],
  },

  // ======================= NEO DLC =======================
  {
    id: 'bardock-dlc',
    name: 'Bardock (NEO)',
    color: '#a04a2a',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: jp(86), tags: ['Frieza Force','Saiyans','Son Family','Team Bardock'], episodes: ['Sagas from the Movies'] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: dlc(4), tags: ['Saiyans','Son Family','Super Saiyans','Team Bardock'], episodes: ['Sagas from the Movies'] },
      { form: 'NEO Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: ['SS Transform'], image: neo(9), tags: ['Saiyans','Son Family','Team Bardock'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'champa',
    name: 'Champa',
    color: '#7a4ad0',
    forms: [
      { form: 'Base', dp: 10, health: 25000, kiBars: 6, skillPoints: 7, traits: ['Dodge Skill'], image: dlc(9), tags: ['Powerful Opponent','Universal Rep','God Ki'], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'cheelai',
    name: 'Cheelai',
    color: '#40c080',
    forms: [
      { form: 'Base', dp: 3, health: 13000, kiBars: 2, skillPoints: 2, traits: [], image: dlc(21), tags: ['Girls','Frieza Force'], episodes: ['Dragon Ball Super','Sagas from the Movies'] },
    ],
  },
  {
    id: 'chilled',
    name: 'Chilled',
    color: '#8060c0',
    forms: [
      { form: 'Base', dp: 5, health: 18000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(15), tags: ['Powerful Opponent','Lineage of Evil'], episodes: [] },
    ],
  },
  {
    id: 'demon-king-piccolo',
    name: 'Demon King Piccolo',
    color: '#3a8a4a',
    forms: [
      { form: 'Base', dp: 4, health: 21000, kiBars: 4, skillPoints: 5, traits: ['Health Regeneration'], image: dlc(3), tags: ['Powerful Opponent','Regeneration','Dragon Ball Saga'], episodes: [] },
    ],
  },
  {
    id: 'eighter',
    name: 'Eighter',
    color: '#8a6a40',
    forms: [
      { form: 'Base', dp: 2, health: 18000, kiBars: 2, skillPoints: 3, traits: [], image: dlc(11), tags: ['Dragon Ball Saga','Android'], episodes: [] },
    ],
  },
  {
    id: 'fasha',
    name: 'Fasha',
    color: '#b04060',
    forms: [
      { form: 'Base', dp: 3, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(14), tags: ['Saiyans','Girls','Team Bardock'], episodes: [] },
    ],
  },
  {
    id: 'general-blue',
    name: 'General Blue',
    color: '#3060c0',
    forms: [
      { form: 'Base', dp: 2, health: 15000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(12), tags: ['Dragon Ball Saga','Powerful Opponent','Earthling'], episodes: [] },
    ],
  },
  {
    id: 'grandpa-gohan',
    name: 'Grandpa Gohan',
    color: '#c09040',
    forms: [
      { form: 'Base', dp: 2, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(1), tags: ['Dragon Ball Saga','Son Family','Earthling','Otherworld Warrior'], episodes: [] },
    ],
  },
  {
    id: 'hell-fighter-17',
    name: 'Hell Fighter 17',
    color: '#4a4a80',
    forms: [
      { form: 'Base', dp: 5, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: dlc(7), tags: ['GT','Android','Otherworld Warrior'], episodes: [] },
    ],
  },
  {
    id: 'jaco',
    name: 'Jaco',
    color: '#5ab0d0',
    forms: [
      { form: 'Base', dp: 3, health: 14000, kiBars: 3, skillPoints: 2, traits: [], image: dlc(22), tags: [], episodes: ['Dragon Ball Super'] },
    ],
  },
  {
    id: 'king-vegeta',
    name: 'King Vegeta',
    color: '#4a3a80',
    forms: [
      { form: 'Base', dp: 4, health: 19000, kiBars: 3, skillPoints: 4, traits: [], image: dlc(20), tags: ['Saiyans','Vegeta Family'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'mercenary-tao',
    name: 'Mercenary Tao',
    color: '#b08040',
    forms: [
      { form: 'Base', dp: 2, health: 17000, kiBars: 3, skillPoints: 4, traits: [], image: dlc(2), tags: ['Dragon Ball Saga','Earthling'], episodes: [] },
    ],
  },
  {
    id: 'mighty-mask',
    name: 'Mighty Mask',
    color: '#e0c040',
    forms: [
      { form: 'Base', dp: 3, health: 19000, kiBars: 4, skillPoints: 4, traits: [], image: dlc(17), tags: ['Vegeta Family','Son Family','Hybrid Saiyan'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'nam',
    name: 'Nam',
    color: '#907050',
    forms: [
      { form: 'Base', dp: 2, health: 15000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(10), tags: ['Dragon Ball Saga','Earthling'], episodes: [] },
    ],
  },
  {
    id: 'nuova-shenron',
    name: 'Nuova Shenron (GT)',
    color: '#c08030',
    forms: [
      { form: 'Base', dp: 7, health: 22000, kiBars: 5, skillPoints: 5, traits: [], image: dlc(27), tags: ['GT','Powerful Opponent'], episodes: [] },
    ],
  },
  {
    id: 'pikkon',
    name: 'Pikkon',
    color: '#3a8a5a',
    forms: [
      { form: 'Base', dp: 6, health: 20000, kiBars: 4, skillPoints: 5, traits: [], image: dlc(6), tags: ['Powerful Opponent','Otherworld Warrior'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'salza',
    name: 'Salza',
    color: '#4080a0',
    forms: [
      { form: 'Base', dp: 4, health: 17000, kiBars: 3, skillPoints: 4, traits: [], image: dlc(16), tags: ['Minion'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'super-17',
    name: 'Super 17',
    color: '#4a6090',
    forms: [
      { form: 'Base', dp: 8, health: 25000, kiBars: 5, skillPoints: 6, traits: ['Unblockable Ultimate'], image: dlc(8), tags: ['GT','Android','Powerful Opponent','Fusion Warrior'], episodes: [] },
    ],
  },
  {
    id: 'supreme-kai',
    name: 'Supreme Kai',
    color: '#6a4aaa',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 4, skillPoints: 4, traits: [], image: dlc(18), tags: ['God Ki'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'tora',
    name: 'Tora',
    color: '#8a5a4a',
    forms: [
      { form: 'Base', dp: 3, health: 17000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(13), tags: ['Saiyans','Team Bardock'], episodes: [] },
    ],
  },
  {
    id: 'trunks-gt',
    name: 'Trunks (GT)',
    color: '#5a90d0',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: dlc(25), tags: ['GT','Vegeta Family','Hybrid Saiyan'], episodes: [] },
      { form: 'Super Saiyan', dp: 6, health: 21000, kiBars: 4, skillPoints: 5, traits: [], image: dlc(26), tags: ['GT','Vegeta Family','Hybrid Saiyan','Super Saiyans'], episodes: [] },
    ],
  },
  {
    id: 'uub-kid',
    name: 'Uub (Kid)',
    color: '#a06040',
    forms: [
      { form: 'Base', dp: 2, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(19), tags: ['Earthling'], episodes: ['Majin Buu Saga'] },
    ],
  },
  {
    id: 'vegeta-gt-dlc',
    name: 'Vegeta (GT-NEO)',
    color: '#3a6ee0',
    forms: [
      { form: 'Base', dp: 5, health: 21000, kiBars: 3, skillPoints: 4, traits: [], image: dlc(23), tags: ['GT','Saiyans','Vegeta Family'], episodes: [] },
      { form: 'Super Saiyan', dp: 6, health: 22000, kiBars: 4, skillPoints: 5, traits: [], image: dlc(24), tags: ['GT','Saiyans','Vegeta Family','Super Saiyans'], episodes: [] },
    ],
  },
  {
    id: 'zangya',
    name: 'Zangya',
    color: '#3aaa8a',
    forms: [
      { form: 'Base', dp: 4, health: 18000, kiBars: 3, skillPoints: 4, traits: [], image: dlc(5), tags: ['Girls'], episodes: ['Sagas from the Movies'] },
    ],
  },
  {
    id: 'goku-db-tournament',
    name: 'Goku (DB Tournament)',
    color: '#e88a2a',
    forms: [
      { form: 'Base', dp: 3, health: 14000, kiBars: 2, skillPoints: 3, traits: [], image: dlc(32), tags: ['Dragon Ball Saga','Saiyans','Son Family'], episodes: [] },
    ],
  },
  {
    id: 'piccolo-jr',
    name: 'Piccolo Jr',
    color: '#4a9a3a',
    forms: [
      { form: 'Base', dp: 3, health: 17000, kiBars: 3, skillPoints: 3, traits: ['Health Regeneration'], image: dlc(30), tags: ['Dragon Ball Saga','Powerful Opponent','Regeneration'], episodes: [] },
      { form: 'Giant', dp: 3, health: 22000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(31), tags: ['Dragon Ball Saga','Powerful Opponent','Regeneration'], episodes: [] },
    ],
  },
  {
    id: 'tien-db-tournament',
    name: 'Tien (DB Saga)',
    color: '#8a8a4a',
    forms: [
      { form: 'Base', dp: 3, health: 16000, kiBars: 3, skillPoints: 3, traits: [], image: dlc(33), tags: ['Dragon Ball Saga','Earthling'], episodes: [] },
    ],
  },
  {
    id: 'devilman',
    name: 'Devilman',
    color: '#6a2a8a',
    forms: [
      { form: 'Base', dp: 2, health: 13000, kiBars: 2, skillPoints: 2, traits: [], image: dlc(28), tags: ['Dragon Ball Saga'], episodes: [] },
    ],
  },
  {
    id: 'chichi-db',
    name: 'Chi-Chi (DB Saga)',
    color: '#d44a8a',
    forms: [
      { form: 'Base', dp: 2, health: 13000, kiBars: 2, skillPoints: 2, traits: [], image: dlc(29), tags: ['Dragon Ball Saga','Earthling','Girls','Son Family'], episodes: [] },
    ],
  },
]

// Unique, sorted list of every tag used above — powers the Category filter.
export const allTags = [...new Set(characters.flatMap((c) => c.forms.flatMap((f) => f.tags || [])))].sort()
export const allEpisodes = [...new Set(characters.flatMap((c) => c.forms.flatMap((f) => f.episodes || [])))].sort()

// Fast lookup by id (used when decoding shared/saved teams).
export const charactersById = Object.fromEntries(characters.map((c) => [c.id, c]))

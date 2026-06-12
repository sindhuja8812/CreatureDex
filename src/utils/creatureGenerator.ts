export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type Species =
  | 'Dragon'
  | 'Phoenix'
  | 'Shadow Wolf'
  | 'Spirit Fox'
  | 'Crystal Rabbit'
  | 'Griffin'
  | 'Unicorn'
  | 'Pegasus'
  | 'Forest Guardian'
  | 'Raven Spirit';

export interface Creature {
  id: string;
  name: string;
  species: Species;
  rarity: Rarity;
  attack: number;
  defense: number;
  speed: number;
  magic: number;
  ability: string;
  habitat: string;
  lore: string;
  createdAt: number;
}

const SPECIES: Species[] = [
  'Dragon',
  'Phoenix',
  'Shadow Wolf',
  'Spirit Fox',
  'Crystal Rabbit',
  'Griffin',
  'Unicorn',
  'Pegasus',
  'Forest Guardian',
  'Raven Spirit',
];

const RARITY_WEIGHTS: [Rarity, number][] = [
  ['Common', 50],
  ['Rare', 25],
  ['Epic', 15],
  ['Legendary', 8],
  ['Mythic', 2],
];

const SPECIES_ABILITIES: Record<Species, string[]> = {
  Dragon: ['Inferno Breath', 'Scale Armor', 'Tail Swipe', 'Dragon Fury', 'Ancient Roar'],
  Phoenix: ['Rebirth Flame', 'Wing Guard', 'Ember Scatter', 'Blazing Dive', 'Immortal Ember'],
  'Shadow Wolf': ['Shadow Pounce', 'Night Howl', 'Dark Claw', 'Void Stalk', 'Eclipse Fang'],
  'Spirit Fox': ['Soul Drain', 'Foxfire', 'Illusion Veil', 'Mystic Tail', 'Ethereal Shift'],
  'Crystal Rabbit': ['Crystal Burst', 'Prism Hop', 'Diamond Shield', 'Refract Beam', 'Gem Step'],
  Griffin: ['Sky Slam', 'Talon Strike', 'Wind Rush', 'Eagle Eye', 'Thunder Dive'],
  Unicorn: ['Holy Light', 'Mana Horn', 'Purify', 'Radiant Charge', 'Star Blessing'],
  Pegasus: ['Cloud Gallop', 'Wind Slash', 'Celestial Dash', 'Storm Wing', 'Aero Burst'],
  'Forest Guardian': ['Root Bind', 'Leaf Storm', 'Vine Whip', 'Nature Ward', 'Bloom Heal'],
  'Raven Spirit': ['Dark Talon', 'Shadow Dive', 'Cursed Wing', 'Void Shriek', 'Phantom Peck'],
};

const HABITATS: Record<Species, string[]> = {
  Dragon: ['Volcanic Peaks', 'Dragon\'s Lair', 'Magma Caverns', 'Scorched Wastes'],
  Phoenix: ['Eternal Pyre', 'Sun Temple', 'Ashlands', 'Celestial Nest'],
  'Shadow Wolf': ['Darkwood Forest', 'Moonlit Ridge', 'Void Rifts', 'Twilight Den'],
  'Spirit Fox': ['Spirit Grove', 'Moonwell', 'Mystic Meadows', 'Enchanted Glade'],
  'Crystal Rabbit': ['Crystal Caves', 'Gem Fields', 'Prism Mountains', 'Diamond Hollow'],
  Griffin: ['Sky Citadel', 'Mountain Aerie', 'Storm Peaks', 'Cloud Keep'],
  Unicorn: ['Sacred Glade', 'Starfall Plains', 'Holy Springs', 'Radiant Forest'],
  Pegasus: ['Cloud Realm', 'Wind Temple', 'Sky Islands', 'Zephyr Peaks'],
  'Forest Guardian': ['Ancient Forest', 'World Tree', 'Deep Green', 'Verdant Hollow'],
  'Raven Spirit': ['Shadow Crypt', 'Deadwood', 'Abyssal Tower', 'Phantom Roost'],
};

const NAME_PREFIXES = [
  'Aeth', 'Zyr', 'Kael', 'Mor', 'Fen', 'Vex', 'Lun', 'Cor', 'Ash', 'Rav',
  'Thr', 'Nyx', 'Sol', 'Ith', 'Grim', 'Bry', 'Dra', 'Eld', 'Fal', 'Gor',
  'Hex', 'Isk', 'Jor', 'Kro', 'Lys', 'Myr', 'Nar', 'Orn', 'Pyx', 'Quil',
];

const NAME_SUFFIXES = [
  'ion', 'ara', 'oth', 'ius', 'ena', 'ux', 'ira', 'on', 'is', 'ar',
  'iel', 'orn', 'ath', 'ene', 'ok', 'ul', 'ax', 'yne', 'os', 'ith',
];

const LORE_TEMPLATES = [
  'Born beneath the {moon}, this {species} protects ancient {place}.',
  'Legends say it appears only during {event}.',
  'It guards {treasure} hidden deep within {place}.',
  'Forged by {force}, its power rivals that of {entity}.',
  'Whispers of its coming echo across the {place}.',
  'The {species} was first seen when {event} shook the world.',
  'Its {part} glows with the light of {force}.',
  'Scholars believe it holds the key to {secret}.',
  'Only those pure of heart can tame this {species}.',
  'Ancient runes name it the {title} of {place}.',
  'When the {moon} rises, this creature gains untold power.',
  'It is said that {number} of these beings exist in all the realms.',
  'The {species} feeds on {substance} found only in {place}.',
  'Its cry can {effect} across leagues of {terrain}.',
  'To gaze upon it is to witness {force} made flesh.',
];

const LORE_FILL: Record<string, string[]> = {
  moon: ['Crystal Moon', 'Blood Moon', 'Harvest Moon', 'Shatter Moon', 'Eclipse Moon', 'Silver Moon'],
  place: ['enchanted forests', 'the Ruins of Valdris', 'the Abyssal Caverns', 'the Sky Citadel', 'the Verdant Hollow', 'the Shadow Crypt'],
  event: ['celestial storms', 'the Convergence', 'the Awakening', 'the Great Eclipse', 'the Rending of Skies', 'the Celestial Alignment'],
  treasure: ['forgotten treasures', 'the Orb of Eternity', 'ancient relics', 'the Crystal Heart', 'the Voidstone', 'the Everflame'],
  force: ['primordial fire', 'arcane lightning', 'shadow magic', 'celestial energy', 'ancient earth power', 'void energy'],
  entity: ['the Old Gods', 'the Celestial Dragons', 'the Spirit Lords', 'the Abyssal Kings', 'the Sky Titans'],
  part: ['eyes', 'horns', 'wings', 'tail', 'aura', 'claws'],
  secret: ['immortality', 'the lost kingdom', 'the void gate', 'the heart of the world', 'the final prophecy'],
  title: ['Guardian', 'Warden', 'Harbinger', 'Champion', 'Overlord', 'Sentinel'],
  number: ['three', 'seven', 'twelve', 'one', 'thirteen', 'a hundred'],
  substance: ['starlight', 'crystal dew', 'shadow essence', 'moonbeam nectar', 'void dust', 'ancient sap'],
  effect: ['shatter mountains', 'silence storms', 'awaken the dead', 'part the clouds', 'still the winds'],
  terrain: ['shadow and stone', 'mist and memory', 'fire and ice', 'dream and dread', 'forest and fog'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollRarity(): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const [rarity, weight] of RARITY_WEIGHTS) {
    cumulative += weight;
    if (roll < cumulative) return rarity;
  }
  return 'Common';
}

function rollStat(rarity: Rarity): number {
  const bases: Record<Rarity, [number, number]> = {
    Common: [10, 45],
    Rare: [30, 60],
    Epic: [50, 80],
    Legendary: [65, 92],
    Mythic: [80, 100],
  };
  const [min, max] = bases[rarity];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName(species: Species): string {
  const prefix = pick(NAME_PREFIXES);
  const suffix = pick(NAME_SUFFIXES);
  const base = prefix + suffix;

  const titles: Record<Species, string[]> = {
    Dragon: ['the Scorched', 'Flameborn', 'the Ruiner', 'Ashscale'],
    Phoenix: ['the Reborn', 'Everflame', 'the Immortal', 'Sunwing'],
    'Shadow Wolf': ['the Unseen', 'Darkfang', 'Voidhowl', 'Nightprowl'],
    'Spirit Fox': ['the Ethereal', 'Mistwalker', 'Soulwhisper', 'Moonshadow'],
    'Crystal Rabbit': ['the Prismatic', 'Gemleaper', 'Diamondheart', 'Shardbound'],
    Griffin: ['the Thunderous', 'Skyking', 'Windtalons', 'Stormfeather'],
    Unicorn: ['the Radiant', 'Starhorn', 'Lightweaver', 'Dawnborn'],
    Pegasus: ['the Celestial', 'Cloudracer', 'Windborn', 'Zephyrheart'],
    'Forest Guardian': ['the Ancient', 'Rootweaver', 'Barkshield', 'Leafbourne'],
    'Raven Spirit': ['the Ominous', 'Shadewing', 'Voidcaller', 'Darkplume'],
  };

  return `${base}, ${pick(titles[species])}`;
}

function generateLore(species: Species): string {
  const template = pick(LORE_TEMPLATES);
  let lore = template.replace('{species}', species);
  for (const [key, values] of Object.entries(LORE_FILL)) {
    lore = lore.replace(`{${key}}`, pick(values));
  }
  return lore;
}

export function generateCreature(): Creature {
  const species = pick(SPECIES);
  const rarity = rollRarity();
  const abilities = SPECIES_ABILITIES[species];
  const habitats = HABITATS[species];

  return {
    id: crypto.randomUUID(),
    name: generateName(species),
    species,
    rarity,
    attack: rollStat(rarity),
    defense: rollStat(rarity),
    speed: rollStat(rarity),
    magic: rollStat(rarity),
    ability: pick(abilities),
    habitat: pick(habitats),
    lore: generateLore(species),
    createdAt: Date.now(),
  };
}

export const RARITY_ORDER: Record<Rarity, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
  Mythic: 4,
};

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#9ca3af',
  Rare: '#3b82f6',
  Epic: '#a855f7',
  Legendary: '#eab308',
  Mythic: '#ef4444',
};

export const ALL_SPECIES = SPECIES;
export const ALL_RARITIES: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

import type { Species } from '../utils/creatureGenerator';

interface Props {
  species: Species;
  className?: string;
}

// Every row MUST be exactly 16 characters.
// '.' = transparent. Every other char maps to a color in the palette.
type PixelMap = readonly string[];
type Palette = Record<string, string>;

function renderPixels(map: PixelMap, palette: Palette) {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      const color = palette[ch];
      if (!color) continue;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />);
    }
  }
  return rects;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Shared design language (inspired by kawaii pixel-art reference sheets):
 *   • Bold black outline (B = #0f0f0f) wrapping a round chibi head
 *   • Solid 2×2 black eyes — readable at any zoom
 *   • Tiny pink cheek dots (c) and a small mouth (w)
 *   • Per-creature accents stay confined to the top 2 rows and the snout
 * Layout grid (rows):
 *   0–1  : top features (horns / ears / wings / crest)
 *   2–4  : crown of head
 *   5    : forehead
 *   6–7  : eyes  (2×2 each at cols 3-4 and 11-12)
 *   8    : cheekbones / cheeks
 *   9–10 : muzzle / nose / mouth
 *   11–13: chin & jaw curve
 *   14   : bottom outline
 *   15   : empty (breathing room)
 * ─────────────────────────────────────────────────────────────────────────── */

// ─── DRAGON ──────────────────────────────────────────────────────────────────
const dragonMap: PixelMap = [
  '...hB......Bh...',
  '..hHhB....BhHh..',
  '..BBrrrrrrrrBB..',
  '.BrrrrrrrrrrrrB.',
  'BrrrrrrrrrrrrrrB',
  'BrrrrrrrrrrrrrrB',
  'BrrBBrrrrrrBBrrB',
  'BrrBBrrrrrrBBrrB',
  'BrrccrrrrrrccrrB',
  'BrrrrrnrrnrrrrrB',
  'BrrrrrrBwwBrrrrB',
  'BrrrrrrBwwBrrrrB',
  '.BrrrrrrrrrrrrB.',
  '..BBrrrrrrrrBB..',
  '....BBBBBBBB....',
  '................',
];
const dragonPalette: Palette = {
  B: '#0f0f0f', r: '#dc2626', n: '#7f1d1d',
  h: '#92400e', H: '#7c2d12',
  c: '#fb7185', w: '#fecaca',
};

// ─── PHOENIX ─────────────────────────────────────────────────────────────────
const phoenixMap: PixelMap = [
  '....yYy.yYy.....',
  '...yYByByYy.....',
  '..BByyooooyyBB..',
  '.BooooooooooooB.',
  'BooooooooooooooB',
  'BooooooooooooooB',
  'BooBBooooooBBooB',
  'BooBBooooooBBooB',
  'BoocooooooooccoB',
  'BoooooByyBoooooB',
  'BoooooByyBoooooB',
  'BoooooBwwBoooooB',
  '.BooooooooooooB.',
  '..BBoooooooBBO..',
  '....BBBBBBBB....',
  '................',
];
const phoenixPalette: Palette = {
  B: '#0f0f0f', o: '#fb923c', O: '#c2410c',
  y: '#fbbf24', Y: '#fde68a',
  c: '#fb7185', w: '#fecaca',
};

// ─── SHADOW WOLF ─────────────────────────────────────────────────────────────
const shadowWolfMap: PixelMap = [
  '.B............B.',
  'BcBB........BBcB',
  'BccBB......BBccB',
  '.BBcccccccccBB..',
  '.BcccccccccccB..',
  'BcccccccccccccCB',
  'BccBBccccccBBccB',
  'BccBBccccccBBccB',
  'BccccccccccccccB',
  'BccccccBnBccccB.',
  'BcccccBBnBBcccB.',
  '.BcccccBwwBcccB.',
  '.BcccccccccccB..',
  '..BBcccccccBB...',
  '....BBBBBBB.....',
  '................',
];
const shadowWolfPalette: Palette = {
  B: '#0f0f0f', c: '#374151', C: '#1f2937',
  n: '#111827', p: '#a78bfa',
  w: '#52525b',
};

// ─── SPIRIT FOX ──────────────────────────────────────────────────────────────
const spiritFoxMap: PixelMap = [
  '.B............B.',
  'BaBB........BBaB',
  'BfaBB......BBafB',
  '.BBffffffffffBB.',
  '.BffffffffffffB.',
  'BffffffffffffffB',
  'BffBBffffffBBffB',
  'BffBBffffffBBffB',
  'BffccffffffccffB',
  'BfffffBnnBfffffB',
  'BfffffBnnBfffffB',
  'BfffffBwwBfffffB',
  '.BfffffffffffB..',
  '..BBfffffffBB...',
  '....BBBBBBB.....',
  '................',
];
const spiritFoxPalette: Palette = {
  B: '#0f0f0f', f: '#e0e7ff', F: '#c7d2fe',
  a: '#fb923c', n: '#4338ca',
  c: '#f9a8d4', w: '#a5b4fc',
};

// ─── CRYSTAL RABBIT ──────────────────────────────────────────────────────────
const crystalRabbitMap: PixelMap = [
  '...BqB....BqB...',
  '...BqB....BqB...',
  '..BBqBB..BBqBB..',
  '..BqqqqqqqqqqB..',
  '.BqqqqqqqqqqqqB.',
  'BqqqqqqqqqqqqqqB',
  'BqqBBqqqqqqBBqqB',
  'BqqBBqqqqqqBBqqB',
  'BqqccqqqqqqccqqB',
  'BqqqqqqpBqqqqqqB',
  'BqqqqqqBBqqqqqqB',
  'BqqqqqBwwBqqqqqB',
  '.BqqqqqqqqqqqqB.',
  '..BBqqqqqqqqBB..',
  '....BBBBBBBB....',
  '................',
];
const crystalRabbitPalette: Palette = {
  B: '#0f0f0f', q: '#a5f3fc', Q: '#67e8f9',
  p: '#f9a8d4',
  c: '#f472b6', w: '#ec4899',
};

// ─── GRIFFIN ─────────────────────────────────────────────────────────────────
const griffinMap: PixelMap = [
  '..fBfBfBfBfBfB..',
  '..BffffffffffB..',
  '..BBffffffffBB..',
  '.BffffffffffffB.',
  'BffffffffffffffB',
  'BffffffffffffffB',
  'BffBBffffffBBffB',
  'BffBBffffffBBffB',
  'BffccffffffccffB',
  'BfffffykkyfffffB',
  'BfffffBkkBfffffB',
  'BfffffBwwBfffffB',
  '.BffffffffffffB.',
  '..BBffffffffBB..',
  '....BBBBBBBB....',
  '................',
];
const griffinPalette: Palette = {
  B: '#0f0f0f', f: '#f59e0b', F: '#b45309',
  k: '#fde68a', y: '#a16207',
  c: '#fb7185', w: '#facc15',
};

// ─── UNICORN ─────────────────────────────────────────────────────────────────
const unicornMap: PixelMap = [
  '.......nn.......',
  '......nNNn......',
  '..BB.nNNNNn.BB..',
  '.BmuBnNNNNnBuPB.',
  'BuuuumNNNNmuuuuB',
  'BuuuuuummuuuuuuB',
  'BuuBBuuuuuuBBuuB',
  'BuuBBuuuuuuBBuuB',
  'BuuccuuuuuuccuuB',
  'BuuuuuvBBvuuuuuB',
  'BuuuuuBssBuuuuuB',
  'BuuuuuBwwBuuuuuB',
  '.BuuuuuuuuuuuuB.',
  '..BBuuuuuuuuBB..',
  '....BBBBBBBB....',
  '................',
];
const unicornPalette: Palette = {
  B: '#0f0f0f', u: '#f8fafc', U: '#e2e8f0',
  n: '#fbbf24', N: '#f59e0b',
  v: '#7c3aed', s: '#f9a8d4',
  m: '#c4b5fd', P: '#a78bfa',
  c: '#f9a8d4', w: '#ec4899',
};

// ─── PEGASUS ─────────────────────────────────────────────────────────────────
const pegasusMap: PixelMap = [
  'wB............Bw',
  'WwwB........BwwW',
  'BWwwBpppppppBwwB',
  '.BBpppppppppBB..',
  '.BpppppppppppB..',
  'BpppppppppppppB.',
  'BppBBppppppBBppB',
  'BppBBppppppBBppB',
  'BppccppppppccppB',
  'BpppppbBBbpppppB',
  'BpppppBssBpppppB',
  'BpppppBwwBpppppB',
  '.BpppppppppppB..',
  '..BBpppppppBB...',
  '....BBBBBBB.....',
  '................',
];
const pegasusPalette: Palette = {
  B: '#0f0f0f', p: '#e0f2fe', P: '#bae6fd',
  b: '#1d4ed8', s: '#93c5fd',
  w: '#60a5fa', W: '#bfdbfe',
  c: '#fb7185',
};

// ─── FOREST GUARDIAN ─────────────────────────────────────────────────────────
const forestGuardianMap: PixelMap = [
  '.aB.aB..Ba.Ba...',
  'aBBaBB..BBaBBa..',
  '..BBaaaaaaaaBB..',
  '.BggggggggggggB.',
  'BggggggggggggggB',
  'BggggggggggggggB',
  'BggBBggggggBBggB',
  'BggBBggggggBBggB',
  'BggccggggggccggB',
  'BgggggGlllGggggB',
  'BgggggBllBgggggB',
  'BgggggBwwBgggggB',
  '.BggggggggggggB.',
  '..BBgggggggBBG..',
  '....BBBBBBBB....',
  '................',
];
const forestGuardianPalette: Palette = {
  B: '#0f0f0f', g: '#16a34a', G: '#166534',
  a: '#78350f', l: '#86efac',
  c: '#fb7185', w: '#22c55e',
};

// ─── RAVEN SPIRIT ────────────────────────────────────────────────────────────
const ravenSpiritMap: PixelMap = [
  '.kBkBkBkBkBkBk..',
  '.BkkkkkkkkkkkkB.',
  '..BBkkkkkkkkBB..',
  '.BkkkkkkkkkkkkB.',
  'BkkkkkkkkkkkkkkB',
  'BkkkkkkkkkkkkkkB',
  'BkkBBkkkkkkBBkkB',
  'BkkBBkkkkkkBBkkB',
  'BkkcckkkkkkcckkB',
  'BkkkkkpBBpkkkkkB',
  'BkkkkkBppBkkkkkB',
  'BkkkkkBwwBkkkkkB',
  '.BkkkkkkkkkkkkB.',
  '..BBkkkkkkkkBB..',
  '....BBBBBBBB....',
  '................',
];
const ravenSpiritPalette: Palette = {
  B: '#0f0f0f', k: '#1e1b4b', K: '#312e81',
  r: '#ef4444', p: '#7c3aed',
  c: '#be185d', w: '#312e81',
};

// ─── REGISTRY ────────────────────────────────────────────────────────────────
const SPRITES: Record<Species, { map: PixelMap; palette: Palette }> = {
  Dragon:            { map: dragonMap,          palette: dragonPalette },
  Phoenix:           { map: phoenixMap,         palette: phoenixPalette },
  'Shadow Wolf':     { map: shadowWolfMap,      palette: shadowWolfPalette },
  'Spirit Fox':      { map: spiritFoxMap,       palette: spiritFoxPalette },
  'Crystal Rabbit':  { map: crystalRabbitMap,   palette: crystalRabbitPalette },
  Griffin:           { map: griffinMap,         palette: griffinPalette },
  Unicorn:           { map: unicornMap,         palette: unicornPalette },
  Pegasus:           { map: pegasusMap,         palette: pegasusPalette },
  'Forest Guardian': { map: forestGuardianMap,  palette: forestGuardianPalette },
  'Raven Spirit':    { map: ravenSpiritMap,     palette: ravenSpiritPalette },
};

// Dev-time guard: catch any sprite row that isn't exactly 16 chars wide.
if (import.meta.env?.DEV) {
  for (const [name, sprite] of Object.entries(SPRITES)) {
    sprite.map.forEach((row, i) => {
      if (row.length !== 16) {
        // eslint-disable-next-line no-console
        console.warn(`[CreatureArt] ${name} row ${i} is ${row.length} chars, expected 16`);
      }
    });
  }
}

export default function CreatureArt({ species, className }: Props) {
  const sprite = SPRITES[species];
  if (!sprite) return null;
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
    >
      {renderPixels(sprite.map, sprite.palette)}
    </svg>
  );
}

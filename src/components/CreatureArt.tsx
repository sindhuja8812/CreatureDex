import type { Species } from '../utils/creatureGenerator';

interface Props {
  species: Species;
  rarity?: string;
  className?: string;
}

// ─── SPECIES TO IMAGE MAPPING ────────────────────────────────────────────────
const SPECIES_IMAGES: Record<Species, string> = {
  Dragon: new URL('./creature/Dragon.png', import.meta.url).href,
  Phoenix: new URL('./creature/Phoenix.png', import.meta.url).href,
  'Shadow Wolf': new URL('./creature/Shadow_Wolf.png', import.meta.url).href,
  'Spirit Fox': new URL('./creature/Spirit_Fox.png', import.meta.url).href,
  'Crystal Rabbit': new URL('./creature/Crystal_Rabbit.png', import.meta.url).href,
  Griffin: new URL('./creature/Griffin.png', import.meta.url).href,
  Unicorn: new URL('./creature/Unicorn.png', import.meta.url).href,
  Pegasus: new URL('./creature/Pegasus.png', import.meta.url).href,
  'Forest Guardian': new URL('./creature/Forest_Guardian.png', import.meta.url).href,
  'Raven Spirit': new URL('./creature/Raven_Spirit.png', import.meta.url).href,
};

// ─── RARITY GLOW EFFECTS ─────────────────────────────────────────────────────
const RARITY_GLOWS: Record<string, { animationName: string }> = {
  Common: { animationName: 'none' },
  Rare: { animationName: 'rareGlow' },
  Epic: { animationName: 'epicGlow' },
  Legendary: { animationName: 'legendaryGlow' },
  Mythic: { animationName: 'mythicAura' },
};

export default function CreatureArt({ species, rarity = 'Common', className }: Props) {
  const imageUrl = SPECIES_IMAGES[species];
  if (!imageUrl) return null;

  const glowConfig = RARITY_GLOWS[rarity] || RARITY_GLOWS.Common;
  const hasGlow = glowConfig.animationName !== 'none';

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <style>{`
        @keyframes floatingAnimation {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes rareGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)); }
          50% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.9)); }
        }

        @keyframes epicGlow {
          0%, 100% { filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.7)); }
          50% { filter: drop-shadow(0 0 35px rgba(168, 85, 247, 1)); }
        }

        @keyframes legendaryGlow {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(248, 113, 113, 0.8)); }
          50% { filter: drop-shadow(0 0 40px rgba(248, 113, 113, 1)); }
        }

        @keyframes mythicAura {
          0%, 100% { filter: drop-shadow(0 0 40px rgba(251, 191, 36, 1)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.8)); }
          50% { filter: drop-shadow(0 0 50px rgba(251, 191, 36, 1)) drop-shadow(0 0 30px rgba(168, 85, 247, 1)); }
        }

        .creature-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: floatingAnimation 3s ease-in-out infinite;
          ${hasGlow ? `animation: floatingAnimation 3s ease-in-out infinite, ${glowConfig.animationName} 2s ease-in-out infinite;` : ''}
        }
      `}</style>
      <img
        src={imageUrl}
        alt={`${species} creature art`}
        className="creature-image"
      />
    </div>
  );
}

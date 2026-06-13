import { useState, useCallback } from 'react';
import { Shield, Sword, Zap, Sparkles, Trash2, MapPin, ScrollText } from 'lucide-react';
import type { Creature, Rarity } from '../utils/creatureGenerator';
import { RARITY_COLORS } from '../utils/creatureGenerator';
import CreatureArt from './CreatureArt';

interface Props {
  creature: Creature;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  compact?: boolean;
  loadingAI?: boolean;
}

function StatBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const pct = value;
  let barColor = 'bg-gray-500';
  if (pct >= 80) barColor = 'bg-emerald-400';
  else if (pct >= 60) barColor = 'bg-blue-400';
  else if (pct >= 40) barColor = 'bg-amber-400';
  else barColor = 'bg-red-400';

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-4 flex-shrink-0">{icon}</span>
      <span className="text-gray-300 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-400 w-6 text-right font-mono">{value}</span>
    </div>
  );
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const color = RARITY_COLORS[rarity];
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}40`,
      }}
    >
      {rarity}
    </span>
  );
}

function Particles({ rarity }: { rarity: Rarity }) {
  if (rarity !== 'Legendary' && rarity !== 'Mythic') return null;

  const count = rarity === 'Mythic' ? 20 : 12;
  const particles = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 2 + Math.random() * 3;
    const size = 2 + Math.random() * 3;
    const color = rarity === 'Mythic'
      ? ['#ef4444', '#f97316', '#fbbf24'][i % 3]
      : ['#eab308', '#fbbf24', '#fde68a'][i % 3];

    return (
      <span
        key={i}
        className="particle"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });

  return <div className="particles-container">{particles}</div>;
}

export default function CreatureCard({ creature, showDelete, onDelete, compact, loadingAI }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rarityClass = `rarity-${creature.rarity.toLowerCase().replace(' ', '-')}`;

  const handleDelete = useCallback(() => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete?.(creature.id);
  }, [confirmDelete, creature.id, onDelete]);

  if (compact) {
    return (
      <div className={`creature-card ${rarityClass} compact-card`}>
        <Particles rarity={creature.rarity} />
        <div className="compact-art-area">
          <CreatureArt species={creature.species} rarity={creature.rarity} />
        </div>
        <div className="compact-info">
          <p className="text-xs font-bold text-gray-200 truncate">{creature.name}</p>
          <RarityBadge rarity={creature.rarity} />
        </div>
        {showDelete && (
          <button
            onClick={handleDelete}
            className={`delete-btn-compact ${confirmDelete ? 'confirm' : ''}`}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`creature-card ${rarityClass}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <Particles rarity={creature.rarity} />

      {/* Art area */}
      <div className="card-art-area">
        <div className="floating-creature">
          <CreatureArt species={creature.species} rarity={creature.rarity} className="w-full h-full" />
        </div>
      </div>

      {/* Info area */}
      <div className="card-info">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="text-sm font-bold text-gray-100 leading-tight">{creature.name}</h3>
          <RarityBadge rarity={creature.rarity} />
        </div>

        <p className="text-xs text-gray-400 mb-2">{creature.species}</p>

        {/* Stats */}
        <div className="space-y-1 mb-2">
          <StatBar label="ATK" value={creature.attack} icon={<Sword size={10} />} />
          <StatBar label="DEF" value={creature.defense} icon={<Shield size={10} />} />
          <StatBar label="SPD" value={creature.speed} icon={<Zap size={10} />} />
          <StatBar label="MAG" value={creature.magic} icon={<Sparkles size={10} />} />
        </div>

        {/* Ability */}
        <div className="flex items-center gap-1 text-xs mb-1">
          <Sparkles size={10} className="text-amber-400 flex-shrink-0" />
          <span className="text-amber-300 font-semibold">{creature.ability}</span>
        </div>

        {/* Habitat */}
        <div className="flex items-center gap-1 text-xs mb-1">
          <MapPin size={10} className="text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-300">{creature.habitat}</span>
        </div>

        {/* Lore (shown on hover) */}
        <div className={`card-lore ${flipped ? 'visible' : ''}`}>
          <div className="flex items-start gap-1 text-xs">
            <ScrollText size={10} className="text-gray-400 flex-shrink-0 mt-0.5" />
            {loadingAI ? (
              <p className="text-gray-500 italic animate-pulse">Conjuring lore...</p>
            ) : (
              <p className="text-gray-400 italic leading-relaxed">{creature.lore}</p>
            )}
          </div>
        </div>

        {/* Battle Taunt */}
        {creature.taunt && !loadingAI && (
          <div className="mt-2 px-2 py-1 rounded-md bg-amber-400/10 border border-amber-400/20">
            <p className="text-amber-300 text-xs italic text-center">"{creature.taunt}"</p>
          </div>
        )}
      </div>

      {/* Delete button */}
      {showDelete && (
        <button
          onClick={handleDelete}
          className={`delete-btn ${confirmDelete ? 'confirm' : ''}`}
        >
          <Trash2 size={14} />
          <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
        </button>
      )}
    </div>
  );
}

import { useState, useCallback } from 'react';
import { Dices, Save, Sparkles } from 'lucide-react';
import type { Creature } from '../utils/creatureGenerator';
import { generateCreature } from '../utils/creatureGenerator';
import { saveCreature } from '../utils/storage';
import { generateAIContent } from '../utils/aiGenerator';
import CreatureCard from '../components/CreatureCard';

export default function GeneratorPage({
  onSaved,
  collectionCount,
}: {
  onSaved: (creatures: Creature[]) => void;
  collectionCount: number;
}) {
  const [creature, setCreature] = useState<Creature | null>(null);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setSaved(false);

    setTimeout(async () => {
      const base = generateCreature();
      setCreature({ ...base, taunt: '' });
      setGenerating(false);
      setLoadingAI(true);

      try {
        const ai = await generateAIContent(
          base.species,
          base.rarity,
          base.ability,
          base.habitat
        );
        setCreature((prev) =>
          prev ? { ...prev, lore: ai.lore, taunt: ai.taunt } : prev
        );
      } catch {
        setCreature((prev) =>
          prev ? { ...prev, taunt: 'My power is beyond your comprehension.' } : prev
        );
      } finally {
        setLoadingAI(false);
      }
    }, 400);
  }, []);

  const handleSave = useCallback(() => {
    if (!creature) return;
    const updated = saveCreature(creature);
    setSaved(true);
    onSaved(updated);
  }, [creature, onSaved]);

  return (
    <div className="generator-page">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-amber-400">Creature</span>
          <span className="text-gray-200">Dex</span>
        </h1>
        <p className="text-gray-400 text-sm">Generate unique fantasy creatures for your collection</p>
        <div className="mt-2 text-xs text-gray-500">
          <Sparkles size={12} className="inline mr-1 text-amber-400" />
          {collectionCount} creature{collectionCount !== 1 ? 's' : ''} collected
        </div>
      </div>

      {/* Generate button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleGenerate}
          disabled={generating || loadingAI}
          className="generate-btn"
        >
          <Dices size={20} className={generating ? 'spin' : ''} />
          <span>{generating ? 'Summoning...' : loadingAI ? 'Writing lore...' : 'Generate Creature'}</span>
        </button>
      </div>

      {/* Card display */}
      <div className="flex justify-center">
        {creature ? (
          <div className="card-wrapper">
            <div className={`card-reveal ${generating ? '' : 'show'}`}>
              <CreatureCard creature={creature} loadingAI={loadingAI} />
            </div>
            {!saved && !loadingAI && (
              <button onClick={handleSave} className="save-btn mt-4">
                <Save size={16} />
                <span>Save to Collection</span>
              </button>
            )}
            {saved && (
              <p className="text-emerald-400 text-sm mt-4 text-center font-semibold animate-pulse">
                Saved to CreatureDex!
              </p>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <Dices size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-500">Press the button above to summon a creature</p>
          </div>
        )}
      </div>
    </div>
  );
}
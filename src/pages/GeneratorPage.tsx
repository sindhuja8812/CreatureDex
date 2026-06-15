import { useState, useCallback, useRef } from 'react';
import { Dices, Save, Sparkles, Download } from 'lucide-react';
import type { Creature } from '../utils/creatureGenerator';
import { generateCreature } from '../utils/creatureGenerator';
import { saveCreature } from '../utils/storage';
import { generateAIContent } from '../utils/aiGenerator';
import { domToPng } from 'modern-screenshot';
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
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setSaved(false);
    setTimeout(async () => {
      const base = generateCreature();
      setCreature({ ...base, taunt: '' });
      setGenerating(false);
      setLoadingAI(true);
      try {
        const ai = await generateAIContent(base.species, base.rarity, base.ability, base.habitat);
        setCreature((prev) => prev ? { ...prev, lore: ai.lore, taunt: ai.taunt } : prev);
      } catch {
        setCreature((prev) => prev ? { ...prev, taunt: 'My power is beyond your comprehension.' } : prev);
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

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await domToPng(cardRef.current, {
        scale: 2,
        backgroundColor: '#13131f',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${creature?.name.replace(/[^a-z0-9]/gi, '_') ?? 'creature'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  }, [creature]);

  return (
    <div className="generator-page">
      {/* Header */}
      <div className="text-center mb-4">
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
      <div className="flex justify-center mb-4">
        <button onClick={handleGenerate} disabled={generating || loadingAI} className="generate-btn">
          <Dices size={20} className={generating ? 'spin' : ''} />
          <span>{generating ? 'Summoning...' : loadingAI ? 'Writing lore...' : 'Generate Creature'}</span>
        </button>
      </div>

      {/* Card display */}
      <div className="flex justify-center">
        {creature ? (
          <div className="card-wrapper">
            <div className={`card-reveal ${generating ? '' : 'show'}`}>
              <CreatureCard creature={creature} loadingAI={loadingAI} cardRef={cardRef} />
            </div>

            {/* Action buttons */}
            {!loadingAI && !saved && (
              <div className="flex gap-3 mt-4">
                <button onClick={handleDownload} disabled={downloading} className="download-btn">
                  <Download size={16} />
                  <span>{downloading ? 'Saving...' : 'Download Card'}</span>
                </button>
                <button onClick={handleSave} className="save-btn">
                  <Save size={16} />
                  <span>Save to Collection</span>
                </button>
              </div>
            )}

            {saved && (
              <div className="flex gap-3 mt-4">
                <button onClick={handleDownload} disabled={downloading} className="download-btn">
                  <Download size={16} />
                  <span>{downloading ? 'Saving...' : 'Download Card'}</span>
                </button>
                <p className="text-emerald-400 text-sm text-center font-semibold animate-pulse flex items-center">
                  Saved to CreatureDex!
                </p>
              </div>
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
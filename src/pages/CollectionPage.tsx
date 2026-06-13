import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, ArrowUpDown, BookOpen } from 'lucide-react';
import type { Creature, Species, Rarity } from '../utils/creatureGenerator';
import { ALL_SPECIES, ALL_RARITIES, RARITY_ORDER } from '../utils/creatureGenerator';
import { deleteCreature } from '../utils/storage';
import CreatureCard from '../components/CreatureCard';
import CreatureModal from '../components/CreatureModal';

interface Props {
  collection: Creature[];
  onUpdate: (creatures: Creature[]) => void;
}

type SortMode = 'newest' | 'oldest' | 'rarity';

export default function CollectionPage({ collection, onUpdate }: Props) {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<Species | ''>('');
  const [rarityFilter, setRarityFilter] = useState<Rarity | ''>('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);

  const filtered = useMemo(() => {
    let result = [...collection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.species.toLowerCase().includes(q)
      );
    }

    if (speciesFilter) {
      result = result.filter((c) => c.species === speciesFilter);
    }

    if (rarityFilter) {
      result = result.filter((c) => c.rarity === rarityFilter);
    }

    switch (sortMode) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'rarity':
        result.sort(
          (a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]
        );
        break;
    }

    return result;
  }, [collection, search, speciesFilter, rarityFilter, sortMode]);

  const handleDelete = useCallback(
    (id: string) => {
      const updated = deleteCreature(id);
      onUpdate(updated);
    },
    [onUpdate]
  );

  const clearFilters = useCallback(() => {
    setSearch('');
    setSpeciesFilter('');
    setRarityFilter('');
  }, []);

  return (
    <div className="collection-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            <BookOpen size={22} className="inline mr-2 text-amber-400" />
            My CreatureDex
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {collection.length} creature{collection.length !== 1 ? 's' : ''} collected
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
        >
          <Filter size={16} />
        </button>
      </div>

      {/* Search bar */}
      <div className="search-bar mb-4">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name or species..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Species</label>
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value as Species | '')}
              className="filter-select"
            >
              <option value="">All Species</option>
              {ALL_SPECIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Rarity</label>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as Rarity | '')}
              className="filter-select"
            >
              <option value="">All Rarities</option>
              {ALL_RARITIES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Sort</label>
            <div className="flex gap-1">
              {(['newest', 'oldest', 'rarity'] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`sort-btn ${sortMode === mode ? 'active' : ''}`}
                >
                  <ArrowUpDown size={12} />
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button onClick={clearFilters} className="clear-btn">
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="collection-grid">
          {filtered.map((creature) => (
            <div key={creature.id} onClick={() => setSelectedCreature(creature)} style={{ cursor: 'pointer' }}>
              <CreatureCard
                creature={creature}
                showDelete
                onDelete={handleDelete}
                compact
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state mt-12">
          <BookOpen size={40} className="text-gray-600 mb-2" />
          <p className="text-gray-500 text-sm">
            {collection.length === 0
              ? 'No creatures yet. Go generate some!'
              : 'No creatures match your filters.'}
          </p>
        </div>
      )}
      {/* Modal */}
      {selectedCreature && (
        <CreatureModal
          creature={selectedCreature}
          onClose={() => setSelectedCreature(null)}
        />
      )}
    </div>
  );
}

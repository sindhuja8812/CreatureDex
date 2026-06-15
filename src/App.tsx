import { useState, useCallback } from 'react';
import { Dices, BookOpen, Swords } from 'lucide-react';
import type { Creature } from './utils/creatureGenerator';
import { loadCollection } from './utils/storage';
import GeneratorPage from './pages/GeneratorPage';
import CollectionPage from './pages/CollectionPage';
import BattlePage from './pages/BattlePage';

type Page = 'generator' | 'collection' | 'battle';

function App() {
  const [page, setPage] = useState<Page>('generator');
  const [collection, setCollection] = useState<Creature[]>(loadCollection);

  const handleSaved = useCallback((creatures: Creature[]) => {
    setCollection(creatures);
  }, []);

  const handleUpdate = useCallback((creatures: Creature[]) => {
    setCollection(creatures);
  }, []);

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="text-amber-400 font-bold">Creature</span>
            <span className="text-gray-200 font-bold">Dex</span>
          </div>
          <div className="nav-links">
            <button onClick={() => setPage('generator')} className={`nav-btn ${page === 'generator' ? 'active' : ''}`}>
              <Dices size={16} />
              <span>Generate</span>
            </button>
            <button onClick={() => setPage('collection')} className={`nav-btn ${page === 'collection' ? 'active' : ''}`}>
              <BookOpen size={16} />
              <span>Collection</span>
              {collection.length > 0 && <span className="nav-badge">{collection.length}</span>}
            </button>
            <button onClick={() => setPage('battle')} className={`nav-btn ${page === 'battle' ? 'active' : ''}`}>
              <Swords size={16} />
              <span>Battle</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        {page === 'generator' ? (
          <GeneratorPage onSaved={handleSaved} collectionCount={collection.length} />
        ) : page === 'collection' ? (
          <CollectionPage collection={collection} onUpdate={handleUpdate} />
        ) : (
          <BattlePage collection={collection} />
        )}
      </main>
    </div>
  );
}

export default App;
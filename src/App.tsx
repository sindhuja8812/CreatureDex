import { useState, useCallback } from 'react';
import { Dices, BookOpen } from 'lucide-react';
import type { Creature } from './utils/creatureGenerator';
import { loadCollection } from './utils/storage';
import GeneratorPage from './pages/GeneratorPage';
import CollectionPage from './pages/CollectionPage';

type Page = 'generator' | 'collection';

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
      {/* Nav */}
      <nav className="app-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="text-amber-400 font-bold">Creature</span>
            <span className="text-gray-200 font-bold">Dex</span>
          </div>
          <div className="nav-links">
            <button
              onClick={() => setPage('generator')}
              className={`nav-btn ${page === 'generator' ? 'active' : ''}`}
            >
              <Dices size={16} />
              <span>Generate</span>
            </button>
            <button
              onClick={() => setPage('collection')}
              className={`nav-btn ${page === 'collection' ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>Collection</span>
              {collection.length > 0 && (
                <span className="nav-badge">{collection.length}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="app-main">
        {page === 'generator' ? (
          <GeneratorPage onSaved={handleSaved} collectionCount={collection.length} />
        ) : (
          <CollectionPage collection={collection} onUpdate={handleUpdate} />
        )}
      </main>
    </div>
  );
}

export default App;

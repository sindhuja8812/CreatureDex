import type { Creature } from './creatureGenerator';

const STORAGE_KEY = 'creatureDex_collection';

export function loadCollection(): Creature[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Creature[];
  } catch {
    return [];
  }
}

export function saveCreature(creature: Creature): Creature[] {
  const collection = loadCollection();
  collection.push(creature);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  return collection;
}

export function deleteCreature(id: string): Creature[] {
  const collection = loadCollection().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  return collection;
}

import { WordPair } from '../types';
import { FALLBACK_WORD_PAIRS } from '../data/fallbackWords';
import { shuffleArray } from './gameLogic';

const STORAGE_KEY = 'word_spy_used_words_v2';

let curatedPool: WordPair[] = [];
let cachedAIPairs: WordPair[] = [];
let isFetchingBatch = false;

// Load persisted used pairs from localStorage
function getUsedPairsSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch {
    // Ignore storage errors
  }
  return new Set();
}

function saveUsedPairsSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage errors
  }
}

// Initialize and shuffle full curated pool
function initCuratedPool() {
  curatedPool = shuffleArray([...FALLBACK_WORD_PAIRS]);
}

// Prefetch AI only if selected
export async function prefetchWordBatch(categories?: string | string[]) {
  const cats = Array.isArray(categories) ? categories : [categories || 'All Categories'];
  if (!cats.includes('Surprise Me (AI Live)') || isFetchingBatch) return;
  isFetchingBatch = true;

  try {
    const used = getUsedPairsSet();
    const res = await fetch('/api/words/generate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Surprise Me',
        count: 15,
        exclude: Array.from(used),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.pairs) && data.pairs.length > 0) {
        cachedAIPairs = [...cachedAIPairs, ...data.pairs];
      }
    }
  } catch (err) {
    console.warn('AI word generation fallback active:', err);
  } finally {
    isFetchingBatch = false;
  }
}

function matchesCategory(pairCategory: string, selectedCats: string[]): boolean {
  if (selectedCats.length === 0 || selectedCats.includes('All Categories')) {
    return true;
  }
  return selectedCats.some((c) =>
    pairCategory.toLowerCase().includes(c.toLowerCase()) ||
    c.toLowerCase().includes(pairCategory.toLowerCase())
  );
}

export async function getNextWordPair(selectedCategories?: string | string[]): Promise<WordPair> {
  const activeCats = Array.isArray(selectedCategories)
    ? selectedCategories.length > 0 ? selectedCategories : ['All Categories']
    : [selectedCategories || 'All Categories'];

  const usedPairsSet = getUsedPairsSet();

  // 1. If user explicitly requested AI generation
  if (activeCats.includes('Surprise Me (AI Live)')) {
    if (cachedAIPairs.length > 0) {
      const pair = cachedAIPairs.shift()!;
      const key = `${pair.civilian.toLowerCase()}_${pair.undercover.toLowerCase()}`;
      usedPairsSet.add(key);
      saveUsedPairsSet(usedPairsSet);
      return pair;
    }
    try {
      const res = await fetch('/api/words/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Creative Mixed', count: 5 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.pairs?.length > 0) {
          const pair = data.pairs[0];
          const key = `${pair.civilian.toLowerCase()}_${pair.undercover.toLowerCase()}`;
          usedPairsSet.add(key);
          saveUsedPairsSet(usedPairsSet);
          return pair;
        }
      }
    } catch {
      // fallback to curated
    }
  }

  // 2. Curated Primary Library
  if (curatedPool.length === 0) {
    initCuratedPool();
  }

  // Find candidate in curated pool matching category filter and NOT used yet
  let candidateIndex = curatedPool.findIndex((p) => {
    const key = `${p.civilian.toLowerCase()}_${p.undercover.toLowerCase()}`;
    const notUsed = !usedPairsSet.has(key);
    return notUsed && matchesCategory(p.category, activeCats);
  });

  // If all matching words were used, clear the used set for these categories to recycle fresh games
  if (candidateIndex === -1) {
    // Filter out used keys that match these categories to allow fresh replay
    FALLBACK_WORD_PAIRS.forEach((p) => {
      if (matchesCategory(p.category, activeCats)) {
        usedPairsSet.delete(`${p.civilian.toLowerCase()}_${p.undercover.toLowerCase()}`);
      }
    });
    saveUsedPairsSet(usedPairsSet);
    initCuratedPool();

    candidateIndex = curatedPool.findIndex((p) => {
      const key = `${p.civilian.toLowerCase()}_${p.undercover.toLowerCase()}`;
      return !usedPairsSet.has(key) && matchesCategory(p.category, activeCats);
    });
  }

  // If still not found, search without used restriction
  if (candidateIndex === -1) {
    candidateIndex = curatedPool.findIndex((p) => matchesCategory(p.category, activeCats));
  }

  if (candidateIndex !== -1) {
    const pair = curatedPool[candidateIndex];
    curatedPool.splice(candidateIndex, 1);
    const key = `${pair.civilian.toLowerCase()}_${pair.undercover.toLowerCase()}`;
    usedPairsSet.add(key);
    saveUsedPairsSet(usedPairsSet);
    return pair;
  }

  // Final fallback
  const fallback = FALLBACK_WORD_PAIRS[Math.floor(Math.random() * FALLBACK_WORD_PAIRS.length)];
  return fallback;
}

export function resetUsedWords() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  initCuratedPool();
}

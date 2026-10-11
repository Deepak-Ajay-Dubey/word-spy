import { WordPair } from '../types';
import { FALLBACK_WORD_PAIRS } from '../data/fallbackWords';
import { shuffleArray } from './gameLogic';

let curatedPool: WordPair[] = [];
let usedPairsSet: Set<string> = new Set();
let cachedAIPairs: WordPair[] = [];
let isFetchingBatch = false;

// Initialize and shuffle full curated pool
function initCuratedPool() {
  curatedPool = shuffleArray([...FALLBACK_WORD_PAIRS]);
}

// Prefetch AI only if selected
export async function prefetchWordBatch(category?: string) {
  if (category !== 'Surprise Me (AI Live)' || isFetchingBatch) return;
  isFetchingBatch = true;

  try {
    const res = await fetch('/api/words/generate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Surprise Me',
        count: 15,
        exclude: Array.from(usedPairsSet),
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

export async function getNextWordPair(selectedCategory?: string): Promise<WordPair> {
  const cat = selectedCategory || 'All Categories';

  // 1. If user explicitly requested AI generation
  if (cat === 'Surprise Me (AI Live)') {
    if (cachedAIPairs.length > 0) {
      const pair = cachedAIPairs.shift()!;
      usedPairsSet.add(`${pair.civilian.toLowerCase()}_${pair.undercover.toLowerCase()}`);
      return pair;
    }
    // Attempt one quick fetch
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

  // Find candidate in curated pool
  let candidateIndex = curatedPool.findIndex((p) => {
    const key = `${p.civilian.toLowerCase()}_${p.undercover.toLowerCase()}`;
    const notUsed = !usedPairsSet.has(key);
    if (cat === 'All Categories' || cat === 'Surprise Me (AI Live)') return notUsed;
    return notUsed && p.category.toLowerCase().includes(cat.toLowerCase());
  });

  // If filtered category or entire pool was exhausted, reset the used set for continuous play
  if (candidateIndex === -1) {
    usedPairsSet.clear();
    initCuratedPool();
    candidateIndex = curatedPool.findIndex((p) => {
      if (cat === 'All Categories' || cat === 'Surprise Me (AI Live)') return true;
      return p.category.toLowerCase().includes(cat.toLowerCase());
    });
  }

  if (candidateIndex !== -1) {
    const pair = curatedPool[candidateIndex];
    curatedPool.splice(candidateIndex, 1);
    usedPairsSet.add(`${pair.civilian.toLowerCase()}_${pair.undercover.toLowerCase()}`);
    return pair;
  }

  // Final fallback
  const fallback = FALLBACK_WORD_PAIRS[Math.floor(Math.random() * FALLBACK_WORD_PAIRS.length)];
  return fallback;
}

export function resetUsedWords() {
  usedPairsSet.clear();
  initCuratedPool();
}

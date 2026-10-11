// Session Scoreboard Manager

const STORAGE_KEY = 'word_spy_session_scores_v1';

export function getScores(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveScores(scores: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // ignore
  }
}

export function recordGamePoints(
  players: Array<{ name: string; role: 'CIVILIAN' | 'UNDERCOVER' | 'MR_WHITE' }>,
  winner: 'CIVILIANS' | 'UNDERCOVERS' | 'MR_WHITE'
): Record<string, number> {
  const scores = getScores();

  players.forEach((player) => {
    const key = player.name.trim();
    if (!scores[key]) scores[key] = 0;

    if (winner === 'CIVILIANS' && player.role === 'CIVILIAN') {
      scores[key] += 1;
    } else if (winner === 'UNDERCOVERS' && player.role === 'UNDERCOVER') {
      scores[key] += 1;
    } else if (winner === 'MR_WHITE' && player.role === 'MR_WHITE') {
      scores[key] += 1;
    }
  });

  saveScores(scores);
  return scores;
}

export function resetScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export interface ScoreboardEntry {
  name: string;
  points: number;
}

export function getSortedScores(filterNames?: string[]): ScoreboardEntry[] {
  const scores = getScores();
  const names = filterNames && filterNames.length > 0
    ? Array.from(new Set(filterNames.map((n) => n.trim())))
    : Object.keys(scores);

  // Ensure all names exist in list
  names.forEach((n) => {
    if (scores[n] === undefined) scores[n] = 0;
  });

  return Object.entries(scores)
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

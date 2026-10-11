// Session Scoreboard Manager

const STORAGE_KEY = 'word_spy_session_scores_v2';

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

export interface GamePointsRecord {
  updatedScores: Record<string, number>;
  pointsEarned: Record<string, number>;
}

export function recordGamePoints(
  players: Array<{ name: string; role: 'CIVILIAN' | 'UNDERCOVER' | 'MR_WHITE'; isEliminated: boolean }>,
  winner: 'CIVILIANS' | 'UNDERCOVERS' | 'MR_WHITE'
): GamePointsRecord {
  const scores = getScores();
  const pointsEarned: Record<string, number> = {};

  players.forEach((player) => {
    const key = player.name.trim();
    if (scores[key] === undefined) scores[key] = 0;
    let delta = 0;

    if (winner === 'CIVILIANS' && player.role === 'CIVILIAN') {
      // Only surviving civilians earn +2 points; eliminated civilians earn 0 points
      if (!player.isEliminated) {
        delta = 2;
      } else {
        delta = 0;
      }
    } else if (winner === 'UNDERCOVERS' && player.role === 'UNDERCOVER') {
      delta = 3;
    } else if (winner === 'MR_WHITE' && player.role === 'MR_WHITE') {
      delta = 4;
    }

    scores[key] += delta;
    pointsEarned[key] = delta;
  });

  saveScores(scores);
  return { updatedScores: scores, pointsEarned };
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

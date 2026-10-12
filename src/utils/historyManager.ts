// Game History & Match Analytics Manager

export interface PlayerMatchSummary {
  name: string;
  role: 'CIVILIAN' | 'UNDERCOVER' | 'MR_WHITE';
  isEliminated: boolean;
  eliminatedRound?: number;
  pointsEarned: number;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  roundsPlayed: number;
  winner: 'CIVILIANS' | 'UNDERCOVERS' | 'MR_WHITE';
  winnerTitle: string;
  civilianWord: string;
  undercoverWord: string;
  category: string;
  players: PlayerMatchSummary[];
}

export interface PlayerHistoricalStat {
  name: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  totalPoints: number;
  undercoverWins: number;
  mrWhiteWins: number;
}

export interface HistoryAnalytics {
  totalGames: number;
  totalRounds: number;
  averageRounds: number;
  factionWins: {
    civilians: number;
    undercovers: number;
    mrWhite: number;
  };
  playerStats: PlayerHistoricalStat[];
  topWinner: PlayerHistoricalStat | null;
  topUndercover: PlayerHistoricalStat | null;
}

const STORAGE_KEY = 'word_spy_match_history_v2';

export function getMatchHistory(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveMatchRecord(record: MatchRecord): MatchRecord[] {
  try {
    const history = getMatchHistory();
    // Newest first
    const updated = [record, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearMatchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getHistoryAnalytics(): HistoryAnalytics {
  const matches = getMatchHistory();
  const totalGames = matches.length;

  if (totalGames === 0) {
    return {
      totalGames: 0,
      totalRounds: 0,
      averageRounds: 0,
      factionWins: { civilians: 0, undercovers: 0, mrWhite: 0 },
      playerStats: [],
      topWinner: null,
      topUndercover: null,
    };
  }

  let totalRounds = 0;
  const factionWins = { civilians: 0, undercovers: 0, mrWhite: 0 };
  const playerMap: Record<string, {
    name: string;
    gamesPlayed: number;
    wins: number;
    totalPoints: number;
    undercoverWins: number;
    mrWhiteWins: number;
  }> = {};

  matches.forEach((m) => {
    totalRounds += m.roundsPlayed || 1;

    if (m.winner === 'CIVILIANS') factionWins.civilians += 1;
    else if (m.winner === 'UNDERCOVERS') factionWins.undercovers += 1;
    else if (m.winner === 'MR_WHITE') factionWins.mrWhite += 1;

    m.players.forEach((p) => {
      const key = p.name.trim();
      if (!playerMap[key]) {
        playerMap[key] = {
          name: key,
          gamesPlayed: 0,
          wins: 0,
          totalPoints: 0,
          undercoverWins: 0,
          mrWhiteWins: 0,
        };
      }

      playerMap[key].gamesPlayed += 1;
      playerMap[key].totalPoints += p.pointsEarned || 0;

      // Check if player won
      const won =
        (m.winner === 'CIVILIANS' && p.role === 'CIVILIAN') ||
        (m.winner === 'UNDERCOVERS' && p.role === 'UNDERCOVER') ||
        (m.winner === 'MR_WHITE' && p.role === 'MR_WHITE');

      if (won) {
        playerMap[key].wins += 1;
        if (p.role === 'UNDERCOVER') playerMap[key].undercoverWins += 1;
        if (p.role === 'MR_WHITE') playerMap[key].mrWhiteWins += 1;
      }
    });
  });

  const playerStats: PlayerHistoricalStat[] = Object.values(playerMap)
    .map((stat) => ({
      ...stat,
      winRate: stat.gamesPlayed > 0 ? Math.round((stat.wins / stat.gamesPlayed) * 100) : 0,
    }))
    .sort((a, b) => b.wins - a.wins || b.totalPoints - a.totalPoints || b.winRate - a.winRate);

  const topWinner = playerStats.length > 0 && playerStats[0].wins > 0 ? playerStats[0] : null;

  const topUndercover = [...playerStats]
    .filter((p) => p.undercoverWins > 0)
    .sort((a, b) => b.undercoverWins - a.undercoverWins)[0] || null;

  return {
    totalGames,
    totalRounds,
    averageRounds: Number((totalRounds / totalGames).toFixed(1)),
    factionWins,
    playerStats,
    topWinner,
    topUndercover,
  };
}

import { Role, RoleDistribution, Player, WordPair, GameResult } from '../types';

export function calculateRoleDistribution(playerCount: number): RoleDistribution {
  const total = Math.max(3, Math.min(15, playerCount));
  let undercover = 1;
  let mrWhite = 0;

  if (total <= 4) {
    undercover = 1;
    mrWhite = 0;
  } else if (total <= 6) {
    undercover = 1;
    mrWhite = 1;
  } else if (total <= 8) {
    undercover = 2;
    mrWhite = 1;
  } else if (total <= 10) {
    undercover = 2;
    mrWhite = 1;
  } else {
    undercover = Math.max(2, Math.floor(total * 0.2));
    mrWhite = 1;
  }

  const civilians = total - undercover - mrWhite;

  return {
    total,
    civilians,
    undercover,
    mrWhite,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const BROAD_DECOY_THEMES = [
  'Indian Culture',
  'Food & Dining',
  'Technology & Media',
  'Everyday Home & Life',
  'Nature & Wildlife',
  'Sports & Games',
  'Cinema & Pop Culture',
  'Work & Campus',
];

/**
 * Generate 3 broad themes for Mr. White's Smoke Screen:
 * 1 is the authentic category of the secret word, and 2 are random decoys.
 */
export function generateDecoyThemes(actualCategory: string): string[] {
  // Find closest matching broad theme
  const matchedTheme =
    BROAD_DECOY_THEMES.find(
      (t) =>
        t.toLowerCase() === actualCategory.toLowerCase() ||
        actualCategory.toLowerCase().includes(t.toLowerCase()) ||
        t.toLowerCase().includes(actualCategory.toLowerCase())
    ) || actualCategory || 'General Knowledge';

  const otherThemes = shuffleArray(
    BROAD_DECOY_THEMES.filter((t) => t.toLowerCase() !== matchedTheme.toLowerCase())
  );

  const decoys = otherThemes.slice(0, 2);
  return shuffleArray([matchedTheme, ...decoys]);
}

/**
 * Randomize turn order of remaining alive players for a round.
 * Natural, fair party shuffle (Mr. White can speak first or in any slot).
 */
export function generateRoundTurnOrder(alivePlayers: Player[]): Player[] {
  if (alivePlayers.length <= 1) return [...alivePlayers];
  return shuffleArray(alivePlayers);
}

export function assignRolesAndWords(
  names: string[],
  wordPair: WordPair
): Player[] {
  const dist = calculateRoleDistribution(names.length);
  const roles: Role[] = [];

  for (let i = 0; i < dist.civilians; i++) roles.push('CIVILIAN');
  for (let i = 0; i < dist.undercover; i++) roles.push('UNDERCOVER');
  for (let i = 0; i < dist.mrWhite; i++) roles.push('MR_WHITE');

  const shuffledRoles = shuffleArray(roles);

  return names.map((name, index) => {
    const role = shuffledRoles[index];
    let word = '';
    let decoyThemes: string[] | undefined = undefined;

    if (role === 'CIVILIAN') {
      word = wordPair.civilian;
    } else if (role === 'UNDERCOVER') {
      word = wordPair.undercover;
    } else {
      word = 'NO WORD (BLUFF)';
      decoyThemes = generateDecoyThemes(wordPair.category);
    }

    return {
      id: `p-${index + 1}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || `Agent ${index + 1}`,
      role,
      word,
      isEliminated: false,
      codetag: `00${index + 1}`.slice(-3),
      decoyThemes,
    };
  });
}

export function checkWinCondition(
  players: Player[],
  civilianWord: string,
  undercoverWord: string,
  category: string,
  roundsPlayed: number
): GameResult | null {
  const alivePlayers = players.filter((p) => !p.isEliminated);
  const aliveCivilians = alivePlayers.filter((p) => p.role === 'CIVILIAN');
  const aliveUndercovers = alivePlayers.filter((p) => p.role === 'UNDERCOVER');
  const aliveMrWhites = alivePlayers.filter((p) => p.role === 'MR_WHITE');
  const aliveImpostors = aliveUndercovers.length + aliveMrWhites.length;

  // 1. Civilians Win: All Undercover & Mr. White are eliminated
  if (aliveImpostors === 0) {
    return {
      winner: 'CIVILIANS',
      title: 'CIVILIAN VICTORY',
      reason: 'All Undercover operatives and Mr. White have been successfully exposed and eliminated!',
      civilianWord,
      undercoverWord,
      category,
      players,
      roundsPlayed,
    };
  }

  // 2. Undercover / Mr. White Win: Only 2 players remain and at least one is non-civilian
  if (alivePlayers.length <= 2 && aliveImpostors > 0) {
    if (aliveUndercovers.length > 0 && aliveMrWhites.length === 0) {
      return {
        winner: 'UNDERCOVERS',
        title: 'UNDERCOVER VICTORY',
        reason: 'Undercover operatives successfully infiltrated the agency and outlived the Civilians!',
        civilianWord,
        undercoverWord,
        category,
        players,
        roundsPlayed,
      };
    } else if (aliveMrWhites.length > 0 && aliveUndercovers.length === 0) {
      return {
        winner: 'MR_WHITE',
        title: 'MR. WHITE VICTORY',
        reason: 'Mr. White bluffed flawlessly and survived to the final 2!',
        civilianWord,
        undercoverWord,
        category,
        players,
        roundsPlayed,
      };
    } else {
      return {
        winner: 'UNDERCOVERS',
        title: 'INFILTRATORS VICTORY',
        reason: 'The infiltrators survived to the final 2 operatives!',
        civilianWord,
        undercoverWord,
        category,
        players,
        roundsPlayed,
      };
    }
  }

  return null;
}

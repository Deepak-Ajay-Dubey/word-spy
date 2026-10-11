export type Role = 'CIVILIAN' | 'UNDERCOVER' | 'MR_WHITE';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string;
  isEliminated: boolean;
  eliminatedRound?: number;
  codetag: string;
}

export interface WordPair {
  civilian: string;
  undercover: string;
  category: string;
}

export type GamePhase =
  | 'HOME'
  | 'RULES'
  | 'SETUP'
  | 'PASS_TO_REVEAL'
  | 'ROLE_REVEAL'
  | 'DESCRIBE_TURN'
  | 'DISCUSS_VOTE_INTRO'
  | 'VOTING'
  | 'ELIMINATION_REVEAL'
  | 'GAME_OVER';

export type WinningFaction = 'CIVILIANS' | 'UNDERCOVERS' | 'MR_WHITE';

export interface GameResult {
  winner: WinningFaction;
  title: string;
  reason: string;
  civilianWord: string;
  undercoverWord: string;
  category: string;
  players: Player[];
  roundsPlayed: number;
  pointsEarned?: Record<string, number>;
}

export interface RoleDistribution {
  total: number;
  civilians: number;
  undercover: number;
  mrWhite: number;
}

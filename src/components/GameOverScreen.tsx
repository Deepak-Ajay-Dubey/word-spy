import { useEffect } from 'react';
import { RotateCcw, Home, Trophy } from 'lucide-react';
import { playClick, playCiviliansWin, playSpyVictory } from '../utils/audio';
import { GameResult } from '../types';
import { getScores } from '../utils/scoreManager';

interface GameOverScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onOpenScoreboard: () => void;
}

export function GameOverScreen({
  result,
  onPlayAgain,
  onGoHome,
  onOpenScoreboard,
}: GameOverScreenProps) {
  const isCivilians = result.winner === 'CIVILIANS';
  const scores = getScores();

  useEffect(() => {
    if (isCivilians) {
      playCiviliansWin();
    } else {
      playSpyVictory();
    }
  }, [isCivilians]);

  return (
    <div
      id="game-over-screen"
      className="max-w-md mx-auto px-4 py-6 space-y-6 text-center"
    >
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Game Over</span>
        <span>{result.roundsPlayed} {result.roundsPlayed === 1 ? 'Round' : 'Rounds'}</span>
      </div>

      {/* Main Victory Outcome Card */}
      <div className="p-6 rounded-2xl bg-[#161E28] border border-[#2C3848] shadow-sm space-y-4 text-center">
        <div className="space-y-1">
          <h2 className="font-typewriter text-2xl font-bold text-[#EDE6D6] uppercase tracking-wide">
            {result.title}
          </h2>
          <p className="text-xs text-[#EDE6D6]/60 max-w-xs mx-auto leading-relaxed">
            {result.reason}
          </p>
        </div>

        {/* Word Comparison */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1 text-left">
            <span className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50">
              Civilians
            </span>
            <div className="font-typewriter text-base font-bold text-[#EDE6D6] truncate uppercase">
              {result.civilianWord}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1 text-left">
            <span className="text-[10px] uppercase font-semibold text-[#B3261E]">
              Undercover
            </span>
            <div className="font-typewriter text-base font-bold text-[#B3261E] truncate uppercase">
              {result.undercoverWord}
            </div>
          </div>
        </div>

        {/* Quick Points Awarded Note */}
        <div className="pt-2 border-t border-[#2C3848] flex items-center justify-between text-xs text-[#EDE6D6]/60">
          <span>+1 pt awarded to:</span>
          <span className="font-medium text-[#EDE6D6]">
            {isCivilians ? 'All Civilians' : result.winner === 'MR_WHITE' ? 'Mr. White' : 'All Undercovers'}
          </span>
        </div>
      </div>

      {/* Player List with Roles & Points */}
      <div className="space-y-2 text-left">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-[#EDE6D6]/60">Players & Points</span>
          <button
            id="view-scoreboard-btn"
            type="button"
            onClick={() => {
              playClick();
              onOpenScoreboard();
            }}
            className="text-xs text-[#B08D57] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Scoreboard</span>
          </button>
        </div>

        <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
          {result.players.map((player) => {
            const roleLabel =
              player.role === 'CIVILIAN'
                ? 'Civilian'
                : player.role === 'UNDERCOVER'
                ? 'Undercover'
                : 'Mr. White';

            const wonPoint =
              (isCivilians && player.role === 'CIVILIAN') ||
              (result.winner === 'UNDERCOVERS' && player.role === 'UNDERCOVER') ||
              (result.winner === 'MR_WHITE' && player.role === 'MR_WHITE');

            const currentPts = scores[player.name.trim()] || 0;

            return (
              <div
                key={player.id}
                className="p-3 rounded-xl bg-[#161E28] border border-[#2C3848] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#EDE6D6] truncate">
                      {player.name}
                    </span>
                    {wonPoint && (
                      <span className="text-[10px] font-semibold text-[#B08D57] bg-[#B08D57]/15 px-1.5 py-0.2 rounded">
                        +1 pt
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#EDE6D6]/50 flex items-center gap-1.5 pt-0.5">
                    <span className={player.role === 'CIVILIAN' ? 'text-[#EDE6D6]/80' : 'text-[#B08D57] font-medium'}>
                      {roleLabel}
                    </span>
                    <span>•</span>
                    <span className="truncate">{player.word}</span>
                    <span>•</span>
                    <span className={player.isEliminated ? 'text-[#B3261E]/80' : 'text-emerald-400/80'}>
                      {player.isEliminated ? `Eliminated (R${player.eliminatedRound || 1})` : 'Survived'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold text-[#EDE6D6]">
                    {currentPts}
                  </span>
                  <span className="text-[10px] text-[#EDE6D6]/50 ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          id="gameover-play-again-btn"
          type="button"
          onClick={() => {
            playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <button
          id="gameover-home-btn"
          type="button"
          onClick={() => {
            playClick();
            onGoHome();
          }}
          className="w-full py-2.5 px-6 rounded-xl bg-transparent hover:bg-[#161E28] text-[#EDE6D6]/70 hover:text-[#EDE6D6] text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Change Players / Home</span>
        </button>
      </div>
    </div>
  );
}

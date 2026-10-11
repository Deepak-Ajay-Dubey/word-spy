import { useEffect } from 'react';
import { RotateCcw, Home, Trophy, Award } from 'lucide-react';
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
      className="max-w-md mx-auto px-4 py-6 space-y-5 text-center select-none"
    >
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Game Over</span>
        <span>{result.roundsPlayed} {result.roundsPlayed === 1 ? 'Round' : 'Rounds'}</span>
      </div>

      {/* Main Victory Outcome Card */}
      <div className="p-5 rounded-2xl bg-[#161E28] border border-[#2C3848] shadow-sm space-y-4 text-center">
        <div className="space-y-1">
          <h2 className="font-typewriter text-2xl font-bold text-[#EDE6D6] uppercase tracking-wide">
            {result.title}
          </h2>
          <p className="text-xs text-[#EDE6D6]/60 max-w-xs mx-auto leading-relaxed">
            {result.reason}
          </p>
        </div>

        {/* Word Comparison */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1 text-left overflow-hidden">
            <span className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50">
              Civilians
            </span>
            <div className="font-typewriter text-sm sm:text-base font-bold text-[#EDE6D6] truncate uppercase">
              {result.civilianWord}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1 text-left overflow-hidden">
            <span className="text-[10px] uppercase font-semibold text-[#B3261E]">
              Undercover
            </span>
            <div className="font-typewriter text-sm sm:text-base font-bold text-[#B3261E] truncate uppercase">
              {result.undercoverWord}
            </div>
          </div>
        </div>

        {/* Points System Rule Summary Banner */}
        <div className="pt-2.5 border-t border-[#2C3848] flex items-center justify-between text-xs text-[#EDE6D6]/70">
          <div className="flex items-center gap-1.5 text-left">
            <Award className="w-3.5 h-3.5 text-[#B08D57] shrink-0" />
            <span className="text-[11px]">
              {isCivilians
                ? 'Surviving Civilians: +2 pts (Eliminated Civilians: 0 pts)'
                : result.winner === 'UNDERCOVERS'
                ? 'Undercovers: +3 pts'
                : 'Mr. White: +4 pts'}
            </span>
          </div>
        </div>
      </div>

      {/* Player List with Roles & Points Awarded */}
      <div className="space-y-2 text-left">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-[#EDE6D6]/60">Round Results & Standings</span>
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
            <span>All-Time Scoreboard</span>
          </button>
        </div>

        <div className="space-y-2 max-h-[32vh] overflow-y-auto pr-1">
          {result.players.map((player) => {
            const roleLabel =
              player.role === 'CIVILIAN'
                ? 'Civilian'
                : player.role === 'UNDERCOVER'
                ? 'Undercover'
                : 'Mr. White';

            // Calculate points earned this game
            let ptsEarnedThisGame = 0;
            if (isCivilians && player.role === 'CIVILIAN') {
              ptsEarnedThisGame = player.isEliminated ? 0 : 2;
            } else if (result.winner === 'UNDERCOVERS' && player.role === 'UNDERCOVER') {
              ptsEarnedThisGame = 3;
            } else if (result.winner === 'MR_WHITE' && player.role === 'MR_WHITE') {
              ptsEarnedThisGame = 4;
            }

            // Total cumulative points from score manager
            const currentTotalPts = scores[player.name.trim()] || 0;

            return (
              <div
                key={player.id}
                className="p-3 rounded-xl bg-[#161E28] border border-[#2C3848] flex items-center justify-between gap-3 min-h-[52px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#EDE6D6] truncate">
                      {player.name}
                    </span>

                    {/* Badge for points earned this round */}
                    {ptsEarnedThisGame > 0 ? (
                      <span className="text-[10px] font-semibold text-[#B08D57] bg-[#B08D57]/15 px-1.5 py-0.5 rounded tabular-nums">
                        +{ptsEarnedThisGame} pts
                      </span>
                    ) : player.role === 'CIVILIAN' && player.isEliminated && isCivilians ? (
                      <span className="text-[10px] text-[#EDE6D6]/40 bg-[#243040] px-1.5 py-0.5 rounded">
                        0 pts (Eliminated)
                      </span>
                    ) : null}
                  </div>

                  <div className="text-xs text-[#EDE6D6]/50 flex items-center gap-1.5 pt-0.5">
                    <span
                      className={
                        player.role === 'CIVILIAN'
                          ? 'text-[#EDE6D6]/80'
                          : 'text-[#B08D57] font-medium'
                      }
                    >
                      {roleLabel}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{player.word}</span>
                    <span>•</span>
                    <span
                      className={
                        player.isEliminated ? 'text-[#B3261E]/80' : 'text-emerald-400/80'
                      }
                    >
                      {player.isEliminated
                        ? `Eliminated (R${player.eliminatedRound || 1})`
                        : 'Survived'}
                    </span>
                  </div>
                </div>

                {/* Total points */}
                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold text-[#EDE6D6] tabular-nums">
                    {currentTotalPts}
                  </span>
                  <span className="text-[10px] text-[#EDE6D6]/50 ml-1">total pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          id="gameover-play-again-btn"
          type="button"
          onClick={() => {
            playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again with Next Words</span>
        </button>

        <button
          id="gameover-home-btn"
          type="button"
          onClick={() => {
            playClick();
            onGoHome();
          }}
          className="w-full py-2.5 px-6 rounded-xl bg-transparent hover:bg-[#161E28] text-[#EDE6D6]/70 hover:text-[#EDE6D6] text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Change Players / Home</span>
        </button>
      </div>
    </div>
  );
}

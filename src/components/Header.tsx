import { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Trophy, History } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled, playClick } from '../utils/audio';
import { GamePhase } from '../types';

interface HeaderProps {
  phase: GamePhase;
  onOpenRules: () => void;
  onOpenScoreboard: () => void;
  onOpenHistory: () => void;
  onRestart: () => void;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
}

export function Header({
  phase,
  onOpenRules,
  onOpenScoreboard,
  onOpenHistory,
  onRestart,
  soundOn,
  setSoundOn,
}: HeaderProps) {
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  const handleRestartClick = () => {
    playClick();
    if (phase === 'HOME' || phase === 'SETUP' || phase === 'GAME_OVER') {
      onRestart();
    } else {
      setShowConfirmRestart(true);
    }
  };

  return (
    <>
      <header
        id="app-header"
        className="w-full px-4 py-3 flex items-center justify-between border-b border-[#2C3848] bg-[#161E28] sticky top-0 z-40"
      >
        <div
          id="header-brand"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            playClick();
            if (phase !== 'HOME') handleRestartClick();
          }}
        >
          <span className="font-semibold text-sm tracking-wide text-[#EDE6D6]">
            Word Spy
          </span>
        </div>

        <div id="header-actions" className="flex items-center gap-1">
          {/* Game History & Records Button */}
          <button
            id="header-history-btn"
            type="button"
            onClick={() => {
              playClick();
              onOpenHistory();
            }}
            className="p-2 rounded-lg text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#243040] transition-colors"
            title="Match History & Records"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Scoreboard Button */}
          <button
            id="header-scoreboard-btn"
            type="button"
            onClick={() => {
              playClick();
              onOpenScoreboard();
            }}
            className="p-2 rounded-lg text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#243040] transition-colors"
            title="Scoreboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Rules / How to Play */}
          <button
            id="header-rules-btn"
            type="button"
            onClick={() => {
              playClick();
              onOpenRules();
            }}
            className="p-2 rounded-lg text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#243040] transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            id="header-sound-btn"
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-lg text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#243040] transition-colors"
            title={soundOn ? 'Sound On' : 'Sound Off'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Restart Game */}
          {phase !== 'HOME' && (
            <button
              id="header-restart-btn"
              type="button"
              onClick={handleRestartClick}
              className="p-2 rounded-lg text-[#EDE6D6]/70 hover:text-[#B3261E] hover:bg-[#243040] transition-colors"
              title="Reset Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Confirmation modal for restarting */}
      {showConfirmRestart && (
        <div
          id="restart-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#161E28] rounded-2xl p-5 border border-[#2C3848] shadow-2xl space-y-4 text-center text-[#EDE6D6]">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base text-[#EDE6D6]">
                Quit Current Game?
              </h3>
              <p className="text-xs text-[#EDE6D6]/60">
                The current round will end and you'll return to setup. Session scores will be preserved.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                id="cancel-abort-btn"
                type="button"
                onClick={() => {
                  playClick();
                  setShowConfirmRestart(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium text-[#EDE6D6]/80 bg-[#243040] hover:bg-[#2C3848] transition-colors cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                id="confirm-abort-btn"
                type="button"
                onClick={() => {
                  playClick();
                  setShowConfirmRestart(false);
                  onRestart();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium text-white bg-[#B3261E] hover:bg-[#9B1E17] transition-colors cursor-pointer"
              >
                Quit Game
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { X, RotateCcw, Trophy, User } from 'lucide-react';
import { getSortedScores, resetScores, ScoreboardEntry } from '../utils/scoreManager';
import { playClick } from '../utils/audio';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayers?: string[];
}

export function ScoreboardModal({ isOpen, onClose, currentPlayers }: ScoreboardModalProps) {
  const [entries, setEntries] = useState<ScoreboardEntry[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loadScores = () => {
    setEntries(getSortedScores(currentPlayers));
  };

  useEffect(() => {
    if (isOpen) {
      loadScores();
      setShowResetConfirm(false);
    }
  }, [isOpen, currentPlayers]);

  if (!isOpen) return null;

  const handleReset = () => {
    playClick();
    resetScores();
    setEntries(currentPlayers ? currentPlayers.map((name) => ({ name, points: 0 })) : []);
    setShowResetConfirm(false);
  };

  return (
    <div
      id="scoreboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-sm bg-[#161E28] text-[#EDE6D6] rounded-2xl border border-[#2C3848] shadow-2xl p-5 flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C3848] pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#B08D57]" />
            <h2 className="text-sm font-semibold text-[#EDE6D6] tracking-wide uppercase">
              Session Scoreboard
            </h2>
          </div>

          <button
            id="close-scoreboard-btn"
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-[#EDE6D6]/60 hover:text-[#EDE6D6] hover:bg-[#243040] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Scores */}
        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
          {entries.length === 0 ? (
            <p className="text-center py-6 text-xs text-[#EDE6D6]/50">
              No games completed yet in this session.
            </p>
          ) : (
            entries.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1B2430] border border-[#2C3848]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono text-[#EDE6D6]/40 w-4">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-medium text-[#EDE6D6] truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-[#EDE6D6]">
                    {item.points}
                  </span>
                  <span className="text-[10px] text-[#EDE6D6]/50 uppercase tracking-wider">
                    {item.points === 1 ? 'pt' : 'pts'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reset / Footer Actions */}
        <div className="pt-2 border-t border-[#2C3848] flex items-center justify-between">
          {showResetConfirm ? (
            <div className="w-full flex items-center justify-between gap-2">
              <span className="text-xs text-[#EDE6D6]/70">Reset all scores?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 text-xs text-[#EDE6D6]/60 hover:text-[#EDE6D6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-reset-scores-btn"
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1 rounded-lg text-xs bg-[#B3261E] text-white hover:bg-[#9B1E17] transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                id="reset-scores-btn"
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-[#EDE6D6]/50 hover:text-[#EDE6D6]/80 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Scores</span>
              </button>

              <button
                id="scoreboard-done-btn"
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#243040] hover:bg-[#2C3848] text-[#EDE6D6] transition-colors cursor-pointer"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

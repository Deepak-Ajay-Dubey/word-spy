import { useState } from 'react';
import { Plus, Minus, ArrowLeft, Play } from 'lucide-react';
import { playClick } from '../utils/audio';
import { calculateRoleDistribution } from '../utils/gameLogic';

interface PlayerSetupProps {
  onStartGame: (playerNames: string[]) => void;
  onBack: () => void;
}

const DEFAULT_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

export function PlayerSetup({ onStartGame, onBack }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [names, setNames] = useState<string[]>([...DEFAULT_NAMES]);

  const roleDist = calculateRoleDistribution(playerCount);

  const updateCount = (newCount: number) => {
    const clamped = Math.max(3, Math.min(15, newCount));
    playClick();
    setPlayerCount(clamped);

    setNames((prev) => {
      const next = [...prev];
      if (clamped > prev.length) {
        for (let i = prev.length; i < clamped; i++) {
          next.push(`Player ${i + 1}`);
        }
      } else if (clamped < prev.length) {
        return next.slice(0, clamped);
      }
      return next;
    });
  };

  const handleNameChange = (index: number, val: string) => {
    setNames((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleStart = () => {
    playClick();
    const finalNames = names.map((n, i) => n.trim() || `Player ${i + 1}`);
    onStartGame(finalNames);
  };

  return (
    <div
      id="player-setup-screen"
      className="max-w-md mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-68px)] justify-between space-y-6"
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            id="setup-back-btn"
            type="button"
            onClick={() => {
              playClick();
              onBack();
            }}
            className="p-1.5 -ml-1 rounded-lg text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#161E28] flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs text-[#EDE6D6]/50">Game Setup</span>
        </div>

        {/* Player Count Card */}
        <div className="bg-[#161E28] rounded-2xl p-5 border border-[#2C3848] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#EDE6D6]">Number of Players</span>
            <div className="flex items-center gap-3">
              <button
                id="decrement-players-btn"
                type="button"
                disabled={playerCount <= 3}
                onClick={() => updateCount(playerCount - 1)}
                className="w-8 h-8 rounded-lg bg-[#243040] hover:bg-[#2C3848] disabled:opacity-30 disabled:pointer-events-none text-[#EDE6D6] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-base font-semibold text-[#EDE6D6] w-6 text-center">
                {playerCount}
              </span>

              <button
                id="increment-players-btn"
                type="button"
                disabled={playerCount >= 15}
                onClick={() => updateCount(playerCount + 1)}
                className="w-8 h-8 rounded-lg bg-[#243040] hover:bg-[#2C3848] disabled:opacity-30 disabled:pointer-events-none text-[#EDE6D6] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Counts Summary */}
          <div className="pt-3 border-t border-[#2C3848] flex items-center justify-between text-xs text-[#EDE6D6]/70">
            <span>{roleDist.civilians} Civilians</span>
            <span>•</span>
            <span>{roleDist.undercover} Undercover</span>
            {roleDist.mrWhite > 0 && (
              <>
                <span>•</span>
                <span>{roleDist.mrWhite} Mr. White</span>
              </>
            )}
          </div>
        </div>

        {/* Player Names List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-[#EDE6D6]/70">Player Names</span>
          </div>

          <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#161E28] border border-[#2C3848] focus-within:border-[#B08D57]/60 transition-colors"
              >
                <span className="text-xs text-[#EDE6D6]/40 w-4 font-mono">
                  {index + 1}
                </span>
                <input
                  id={`player-input-${index}`}
                  type="text"
                  maxLength={20}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="flex-1 bg-transparent text-xs text-[#EDE6D6] placeholder:text-[#EDE6D6]/30 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          id="start-mission-btn"
          type="button"
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Play className="w-4 h-4 fill-[#1B2430]" />
          <span>Start Passing Phone</span>
        </button>
      </div>
    </div>
  );
}

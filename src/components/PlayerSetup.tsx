import { useState } from 'react';
import { Plus, Minus, ArrowLeft, Play, Trash2, UserPlus } from 'lucide-react';
import { playClick } from '../utils/audio';
import { calculateRoleDistribution } from '../utils/gameLogic';

interface PlayerSetupProps {
  onStartGame: (playerNames: string[]) => void;
  onBack: () => void;
}

const DEFAULT_PLAYERS = ['Deepak', 'Harshad', 'shrey', 'Soham'];

export function PlayerSetup({ onStartGame, onBack }: PlayerSetupProps) {
  const [names, setNames] = useState<string[]>([...DEFAULT_PLAYERS]);

  const playerCount = names.length;
  const roleDist = calculateRoleDistribution(playerCount);

  const handleNameChange = (index: number, val: string) => {
    setNames((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddPlayer = () => {
    if (names.length >= 15) return;
    playClick();
    setNames((prev) => [...prev, `Player ${prev.length + 1}`]);
  };

  const handleRemovePlayer = (index: number) => {
    if (names.length <= 3) return; // Keep minimum 3 players for spy game mechanics
    playClick();
    setNames((prev) => prev.filter((_, i) => i !== index));
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
            className="p-2 -ml-1 rounded-lg text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#161E28] flex items-center gap-1.5 text-xs transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs text-[#EDE6D6]/50">Player Setup</span>
        </div>

        {/* Player Count & Role Breakdown Card */}
        <div className="bg-[#161E28] rounded-2xl p-5 border border-[#2C3848] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#EDE6D6]">Active Players</span>
            <div className="flex items-center gap-3">
              <button
                id="decrement-players-btn"
                type="button"
                disabled={playerCount <= 3}
                onClick={() => handleRemovePlayer(names.length - 1)}
                className="w-9 h-9 rounded-lg bg-[#243040] hover:bg-[#2C3848] disabled:opacity-30 disabled:pointer-events-none text-[#EDE6D6] flex items-center justify-center transition-colors cursor-pointer"
                title="Remove last player"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-base font-semibold text-[#EDE6D6] w-6 text-center tabular-nums">
                {playerCount}
              </span>

              <button
                id="increment-players-btn"
                type="button"
                disabled={playerCount >= 15}
                onClick={handleAddPlayer}
                className="w-9 h-9 rounded-lg bg-[#243040] hover:bg-[#2C3848] disabled:opacity-30 disabled:pointer-events-none text-[#EDE6D6] flex items-center justify-center transition-colors cursor-pointer"
                title="Add new player"
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

        {/* Player Names List with Delete and Add */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-[#EDE6D6]/70">Player Roster</span>
            <span className="text-[11px] text-[#EDE6D6]/40">Tap name to edit</span>
          </div>

          <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161E28] border border-[#2C3848] focus-within:border-[#B08D57]/60 transition-colors min-h-[48px]"
              >
                <span className="text-xs text-[#EDE6D6]/40 w-4 font-mono text-center shrink-0">
                  {index + 1}
                </span>

                <input
                  id={`player-input-${index}`}
                  type="text"
                  maxLength={20}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="flex-1 bg-transparent text-sm text-[#EDE6D6] placeholder:text-[#EDE6D6]/30 focus:outline-none"
                />

                {/* Remove Player Button */}
                <button
                  type="button"
                  disabled={names.length <= 3}
                  onClick={() => handleRemovePlayer(index)}
                  className="p-2 rounded-lg text-[#EDE6D6]/30 hover:text-[#B3261E] hover:bg-[#B3261E]/10 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title={names.length <= 3 ? 'Minimum 3 players required' : `Remove ${name || 'player'}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Add Player Row Button */}
          {names.length < 15 && (
            <button
              type="button"
              onClick={handleAddPlayer}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#2C3848] hover:border-[#B08D57]/60 text-xs text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#161E28] flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <UserPlus className="w-4 h-4 text-[#B08D57]" />
              <span>Add Player</span>
            </button>
          )}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          id="start-mission-btn"
          type="button"
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          <Play className="w-4 h-4 fill-[#1B2430]" />
          <span>Start Passing Phone</span>
        </button>
      </div>
    </div>
  );
}

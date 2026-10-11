import { useState } from 'react';
import { UserX, Scale } from 'lucide-react';
import { playClick, playEliminationImpact } from '../utils/audio';
import { Player } from '../types';

interface VotingScreenProps {
  roundNumber: number;
  designatedVoter: Player;
  alivePlayers: Player[];
  onEliminatePlayer: (player: Player) => void;
  onTiedVoteSkip: () => void;
}

export function VotingScreen({
  roundNumber,
  designatedVoter,
  alivePlayers,
  onEliminatePlayer,
  onTiedVoteSkip,
}: VotingScreenProps) {
  const [selectedTarget, setSelectedTarget] = useState<Player | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showTiedModal, setShowTiedModal] = useState<boolean>(false);

  const handleSelect = (player: Player) => {
    playClick();
    setSelectedTarget(player);
    setShowConfirmModal(true);
  };

  const handleConfirmElimination = () => {
    if (!selectedTarget) return;
    playEliminationImpact();
    setShowConfirmModal(false);
    onEliminatePlayer(selectedTarget);
  };

  const handleConfirmTiedVote = () => {
    playClick();
    setShowTiedModal(false);
    onTiedVoteSkip();
  };

  return (
    <div
      id="voting-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] max-w-sm mx-auto px-4 py-6 space-y-6"
    >
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Round {roundNumber} Voting</span>
        <span>{alivePlayers.length} Remaining</span>
      </div>

      {/* Designated Voter Banner */}
      <div className="w-full bg-[#161E28] rounded-2xl p-5 border border-[#2C3848] text-center space-y-1 shadow-sm">
        <p className="text-xs text-[#EDE6D6]/60">Casting vote for group:</p>
        <h2 className="text-xl font-bold text-[#EDE6D6]">
          {designatedVoter.name}
        </h2>
        <p className="text-xs text-[#EDE6D6]/50 pt-1">
          Discuss together, then select the player to eliminate.
        </p>
      </div>

      {/* Suspects List */}
      <div className="w-full space-y-2 flex-1">
        <div className="text-xs font-medium text-[#EDE6D6]/60 px-1">
          Select player to eliminate:
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[36vh] overflow-y-auto pr-1">
          {alivePlayers.map((player) => (
            <button
              key={player.id}
              id={`vote-player-${player.id}`}
              type="button"
              onClick={() => handleSelect(player)}
              className="p-3.5 rounded-xl bg-[#161E28] hover:bg-[#1E2836] border border-[#2C3848] hover:border-[#B3261E]/60 active:scale-[0.98] transition-all text-left flex flex-col justify-between gap-3 cursor-pointer shadow-sm"
            >
              <div className="space-y-0.5">
                <span className="text-xs text-[#EDE6D6]/40 font-mono">
                  #{player.id.slice(-2) || '01'}
                </span>
                <div className="text-sm font-semibold text-[#EDE6D6] truncate">
                  {player.name}
                </div>
              </div>
              <span className="text-[11px] text-[#B3261E] font-medium flex items-center gap-1">
                <UserX className="w-3 h-3" />
                Vote Out
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tied / Skip Vote */}
      <div className="w-full">
        <button
          id="tied-vote-btn"
          type="button"
          onClick={() => {
            playClick();
            setShowTiedModal(true);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-transparent hover:bg-[#161E28] text-[#EDE6D6]/60 hover:text-[#EDE6D6] text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Tied Vote / Skip Round</span>
        </button>
      </div>

      {/* Elimination Confirmation Modal */}
      {showConfirmModal && selectedTarget && (
        <div
          id="confirm-elimination-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#161E28] border border-[#2C3848] rounded-2xl p-6 shadow-2xl space-y-4 text-center text-[#EDE6D6]">
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#EDE6D6]">
                Eliminate {selectedTarget.name}?
              </h3>
              <p className="text-xs text-[#EDE6D6]/60">
                They will be removed from remaining turns and votes. Their role remains classified until game over.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                id="cancel-elimination-btn"
                type="button"
                onClick={() => {
                  playClick();
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium text-[#EDE6D6]/80 bg-[#243040] hover:bg-[#2C3848] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="execute-elimination-btn"
                type="button"
                onClick={handleConfirmElimination}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-[#B3261E] hover:bg-[#9B1E17] transition-colors cursor-pointer"
              >
                Eliminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tied Vote Modal */}
      {showTiedModal && (
        <div
          id="tied-vote-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#161E28] border border-[#2C3848] rounded-2xl p-6 shadow-2xl space-y-4 text-center text-[#EDE6D6]">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#EDE6D6]">
                Declare a Tied Vote?
              </h3>
              <p className="text-xs text-[#EDE6D6]/60">
                Nobody will be eliminated. Play will continue with another round of clues.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowTiedModal(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium text-[#EDE6D6]/80 bg-[#243040] hover:bg-[#2C3848] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-skip-round-btn"
                type="button"
                onClick={handleConfirmTiedVote}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-[#1B2430] bg-[#B08D57] hover:bg-[#C29D64] transition-colors cursor-pointer"
              >
                Next Round
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

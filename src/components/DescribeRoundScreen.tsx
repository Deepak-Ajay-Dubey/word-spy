import { useState } from 'react';
import { Mic, ArrowRight, Eye, EyeOff, X, ShieldAlert } from 'lucide-react';
import { playTick, playClick } from '../utils/audio';
import { Player } from '../types';

interface DescribeRoundScreenProps {
  roundNumber: number;
  turnOrder: Player[];
  onFinishRound: () => void;
}

export function DescribeRoundScreen({
  roundNumber,
  turnOrder,
  onFinishRound,
}: DescribeRoundScreenProps) {
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState<number>(0);
  const [peekModalOpen, setPeekModalOpen] = useState<boolean>(false);
  const [isHoldingPeek, setIsHoldingPeek] = useState<boolean>(false);
  const [selectedPeekPlayerId, setSelectedPeekPlayerId] = useState<string>('');

  const currentSpeaker = turnOrder[currentSpeakerIndex];
  const isLastSpeaker = currentSpeakerIndex === turnOrder.length - 1;

  // Active player to peek
  const peekPlayer =
    turnOrder.find((p) => p.id === (selectedPeekPlayerId || currentSpeaker?.id)) ||
    currentSpeaker;

  const handleNextSpeaker = () => {
    playTick();
    if (isLastSpeaker) {
      onFinishRound();
    } else {
      setCurrentSpeakerIndex((prev) => {
        const next = prev + 1;
        setSelectedPeekPlayerId(turnOrder[next]?.id || '');
        return next;
      });
    }
  };

  const handleOpenPeek = () => {
    playClick();
    setSelectedPeekPlayerId(currentSpeaker?.id || '');
    setIsHoldingPeek(false);
    setPeekModalOpen(true);
  };

  return (
    <div
      id="describe-round-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] max-w-sm mx-auto px-4 py-8 text-center space-y-6 select-none"
    >
      {/* Top Round indicator */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Round {roundNumber}</span>
        <span>{currentSpeakerIndex + 1} of {turnOrder.length}</span>
      </div>

      {/* Active Speaker Card */}
      <div className="w-full my-auto bg-[#161E28] border border-[#2C3848] rounded-2xl p-7 shadow-sm space-y-5 text-center relative overflow-hidden">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#243040] flex items-center justify-center text-[#B08D57] shadow-inner">
          <Mic className="w-7 h-7" />
        </div>

        <div className="space-y-1.5 max-w-full px-2">
          <p className="text-xs text-[#EDE6D6]/60 uppercase tracking-wider font-medium">
            Current turn to speak
          </p>
          <div className="py-2 px-3 bg-[#1B2430] rounded-xl border border-[#2C3848] max-w-full overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#EDE6D6] truncate">
              {currentSpeaker?.name}
            </h2>
          </div>
          <p className="text-xs text-[#EDE6D6]/50 pt-1 leading-relaxed">
            Say your 1-word or short clue aloud to the group.
          </p>
        </div>

        {/* Discreet Word Peek CTA for player who forgot */}
        <div className="pt-2 border-t border-[#2C3848]/60">
          <button
            id="peek-my-word-btn"
            type="button"
            onClick={handleOpenPeek}
            className="py-2 px-3.5 rounded-xl bg-[#243040]/70 hover:bg-[#243040] border border-[#2C3848] text-xs text-[#EDE6D6]/80 hover:text-[#EDE6D6] flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer min-h-[40px]"
          >
            <Eye className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Forgot your word? Peek privately</span>
          </button>
        </div>
      </div>

      {/* Sequence & Action */}
      <div className="w-full space-y-4">
        {/* Turn order indicators */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-h-24 overflow-y-auto py-1">
          {turnOrder.map((player, idx) => (
            <span
              key={player.id}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                idx === currentSpeakerIndex
                  ? 'bg-[#B08D57] text-[#1B2430] font-semibold'
                  : idx < currentSpeakerIndex
                  ? 'bg-[#161E28] text-[#EDE6D6]/30 line-through'
                  : 'bg-[#161E28] text-[#EDE6D6]/70'
              }`}
            >
              {player.name}
            </span>
          ))}
        </div>

        <button
          id="next-speaker-btn"
          type="button"
          onClick={handleNextSpeaker}
          className="w-full py-3.5 px-5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          <span>{isLastSpeaker ? 'Proceed to Vote' : 'Next Player'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Discreet Secret Word Peek Modal */}
      {peekModalOpen && peekPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#161E28] border border-[#2C3848] rounded-2xl p-6 shadow-2xl space-y-5 text-center text-[#EDE6D6]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2C3848]">
              <div className="flex items-center gap-1.5 text-xs text-[#B08D57] font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>CONFIDENTIAL PEEK</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setPeekModalOpen(false);
                }}
                className="p-1 rounded-lg hover:bg-[#243040] text-[#EDE6D6]/60 hover:text-[#EDE6D6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Player Selection Dropdown in case another player is checking */}
            <div className="text-left space-y-1">
              <label className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50">
                Checking Word For:
              </label>
              <select
                value={peekPlayer.id}
                onChange={(e) => {
                  setSelectedPeekPlayerId(e.target.value);
                  setIsHoldingPeek(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#1B2430] border border-[#2C3848] text-xs text-[#EDE6D6] focus:outline-none focus:border-[#B08D57]"
              >
                {turnOrder.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Secret Word Display Box */}
            <div className="p-4 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-3 min-h-[130px] flex flex-col justify-center items-center">
              {isHoldingPeek ? (
                peekPlayer.role === 'MR_WHITE' ? (
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-[#B3261E] tracking-wider">
                      MR. WHITE
                    </span>
                    <p className="text-xs text-[#EDE6D6]/80 font-medium">
                      You have no word! Listen closely to the clues.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-full px-2 py-3 bg-[#FAF7F0] rounded-xl border border-[#D6CCA9] overflow-hidden flex items-center justify-center">
                    <span className="font-typewriter text-xl sm:text-2xl font-bold text-[#1B2430] uppercase tracking-wider break-words line-clamp-2 text-center max-w-full">
                      {peekPlayer.word}
                    </span>
                  </div>
                )
              ) : (
                <div className="space-y-2 text-[#EDE6D6]/50">
                  <EyeOff className="w-6 h-6 mx-auto opacity-40" />
                  <p className="text-xs max-w-xs mx-auto">
                    Hold phone close to your eyes, then press & hold to view word.
                  </p>
                </div>
              )}
            </div>

            {/* Press and Hold Reveal Trigger */}
            <div className="space-y-2">
              <button
                type="button"
                onMouseDown={() => setIsHoldingPeek(true)}
                onMouseUp={() => setIsHoldingPeek(false)}
                onTouchStart={() => setIsHoldingPeek(true)}
                onTouchEnd={() => setIsHoldingPeek(false)}
                onClick={() => setIsHoldingPeek((prev) => !prev)}
                className={`w-full py-3.5 px-5 rounded-xl font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none min-h-[48px] ${
                  isHoldingPeek
                    ? 'bg-[#B3261E] text-white'
                    : 'bg-[#B08D57] hover:bg-[#C29D64] text-[#1B2430]'
                }`}
              >
                {isHoldingPeek ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Release to Hide Word</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Press & Hold to Peek Word</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setPeekModalOpen(false);
                }}
                className="w-full py-2 rounded-lg text-xs text-[#EDE6D6]/60 hover:text-[#EDE6D6] cursor-pointer"
              >
                Done Peeking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

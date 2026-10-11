import { useState } from 'react';
import { Mic, ArrowRight } from 'lucide-react';
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
  const currentSpeaker = turnOrder[currentSpeakerIndex];
  const isLastSpeaker = currentSpeakerIndex === turnOrder.length - 1;

  const handleNextSpeaker = () => {
    playTick();
    if (isLastSpeaker) {
      onFinishRound();
    } else {
      setCurrentSpeakerIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      id="describe-round-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] max-w-sm mx-auto px-4 py-8 text-center space-y-6"
    >
      {/* Top Round indicator */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Round {roundNumber}</span>
        <span>{currentSpeakerIndex + 1} of {turnOrder.length}</span>
      </div>

      {/* Active Speaker Card */}
      <div className="w-full my-auto bg-[#161E28] border border-[#2C3848] rounded-2xl p-8 shadow-sm space-y-5 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-[#243040] flex items-center justify-center text-[#B08D57]">
          <Mic className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-[#EDE6D6]/60">Current turn to speak</p>
          <h2 className="text-2xl font-bold text-[#EDE6D6]">
            {currentSpeaker?.name}
          </h2>
          <p className="text-xs text-[#EDE6D6]/50 pt-1">
            Say your 1-word or short clue aloud to everyone.
          </p>
        </div>
      </div>

      {/* Sequence & Action */}
      <div className="w-full space-y-4">
        {/* Turn order dots / pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
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
          className="w-full py-3.5 px-5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>{isLastSpeaker ? 'Proceed to Vote' : 'Next Player'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

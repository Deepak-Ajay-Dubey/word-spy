import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Eye, AlertCircle } from 'lucide-react';
import { playCardFlip, playGlitch, playClick, playTick } from '../utils/audio';
import { Player } from '../types';

interface RoleRevealScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onDoneReveal: () => void;
}

export function RoleRevealScreen({
  player,
  playerIndex,
  totalPlayers,
  onDoneReveal,
}: RoleRevealScreenProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const isMrWhite = player.role === 'MR_WHITE';
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);

    // Uniform audio & timing for every player to prevent role leakage
    playCardFlip();
  };

  useEffect(() => {
    if (isFlipped) {
      setCountdown(5);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          playTick();
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFlipped]);

  const handleNext = () => {
    playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    onDoneReveal();
  };

  return (
    <div
      id="role-reveal-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] max-w-sm mx-auto px-4 py-8 text-center select-none space-y-6"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Secret Word</span>
        <span>{playerIndex + 1} of {totalPlayers}</span>
      </div>

      {/* Flip Card */}
      <div className="w-full my-auto perspective-1000 min-h-[340px] flex items-center justify-center">
        <div
          id="reveal-card"
          onClick={!isFlipped ? handleFlip : undefined}
          className={`w-full h-full min-h-[340px] relative transition-transform duration-500 transform-style-3d cursor-pointer rounded-2xl ${
            isFlipped ? 'rotate-y-180' : 'hover:scale-[1.01]'
          }`}
        >
          {/* FRONT (Tap to Reveal) */}
          <div
            id="card-front"
            className="absolute inset-0 backface-hidden w-full h-full p-8 rounded-2xl bg-[#161E28] border border-[#2C3848] shadow-sm flex flex-col items-center justify-between"
          >
            <div className="text-xs text-[#EDE6D6]/40 uppercase tracking-wider">
              Confidential
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[#EDE6D6]/60">Secret word for</p>
              <h2 className="text-2xl font-bold text-[#EDE6D6]">
                {player.name}
              </h2>
            </div>

            <div className="w-full py-3 px-4 rounded-xl bg-[#243040] text-xs font-medium text-[#EDE6D6] flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-[#B08D57]" />
              <span>Tap to Reveal</span>
            </div>
          </div>

          {/* BACK (Word Revealed) */}
          <div
            id="card-back"
            className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full p-8 rounded-2xl bg-[#FAF7F0] text-[#1B2430] border border-[#D6CCA9] shadow-md flex flex-col items-center justify-between"
          >
            <div className="w-full flex items-center justify-between text-xs text-[#1B2430]/60">
              <span className="font-semibold">{player.name}</span>
              <span>{countdown > 0 ? `${countdown}s` : 'Memorized'}</span>
            </div>

            {isMrWhite ? (
              <div className="space-y-3 my-auto">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#B3261E]/10 flex items-center justify-center text-[#B3261E]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="font-typewriter text-2xl font-bold text-[#B3261E] uppercase tracking-wider">
                  MR. WHITE
                </div>
                <p className="text-xs text-[#1B2430]/70 max-w-xs mx-auto leading-relaxed">
                  You have no word. Listen carefully and bluff your way through the clues.
                </p>
              </div>
            ) : (
              <div className="space-y-3 my-auto w-full">
                <p className="text-xs text-[#1B2430]/60 uppercase tracking-wider font-medium">
                  Your Secret Word
                </p>
                <div className="py-4 px-3 bg-[#EDE6D6] rounded-xl border border-[#D6CCA9]">
                  <div className="font-typewriter text-3xl font-bold text-[#1B2430] uppercase tracking-wider">
                    {player.word}
                  </div>
                </div>
                <p className="text-xs text-[#1B2430]/60 max-w-xs mx-auto">
                  Give a one-word or short clue on your turn.
                </p>
              </div>
            )}

            <div className="w-full h-1 bg-[#D6CCA9]/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B08D57] transition-all duration-1000"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full">
        {isFlipped && (
          <button
            id="next-operative-btn"
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{playerIndex + 1 === totalPlayers ? 'Start Round' : 'Next Player'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, Shield, Radio } from 'lucide-react';
import { playCardFlip, playClick, playTick } from '../utils/audio';
import { Player } from '../types';
import { getNameSizeClass, getWordSizeClass } from '../utils/textFit';

interface RoleRevealScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onDoneReveal: () => void;
  onBackToPrevious?: () => void;
}

export function RoleRevealScreen({
  player,
  playerIndex,
  totalPlayers,
  onDoneReveal,
  onBackToPrevious,
}: RoleRevealScreenProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const isMrWhite = player.role === 'MR_WHITE';
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nameSizeClass = getNameSizeClass(player.name);
  const wordSizeClass = getWordSizeClass(player.word);

  // UNIFORM AUDIO FOR ALL ROLES: identical soft card flip sound
  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    playCardFlip();
  };

  const handleToggleHide = () => {
    playClick();
    setIsFlipped((prev) => !prev);
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
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] w-full max-w-md sm:max-w-lg mx-auto px-3 sm:px-6 py-6 sm:py-8 text-center select-none space-y-6"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50 px-1">
        <div className="flex items-center gap-1">
          {playerIndex > 0 && onBackToPrevious && (
            <button
              type="button"
              onClick={() => {
                playClick();
                if (timerRef.current) clearInterval(timerRef.current);
                onBackToPrevious();
              }}
              className="p-1 -ml-1 rounded text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#243040] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <span>Secret Word</span>
        </div>
        <span>{playerIndex + 1} of {totalPlayers}</span>
      </div>

      {/* Expanded Flip Card Container (Full Horizontal Utilization) */}
      <div className="w-full my-auto perspective-1000 min-h-[350px] flex items-center justify-center">
        <div
          id="reveal-card"
          onClick={!isFlipped ? handleFlip : undefined}
          className={`w-full h-full min-h-[350px] relative transition-transform duration-500 transform-style-3d cursor-pointer rounded-3xl ${
            isFlipped ? 'rotate-y-180' : 'hover:scale-[1.01]'
          }`}
        >
          {/* FRONT (Tap to Reveal) */}
          <div
            id="card-front"
            className="absolute inset-0 backface-hidden w-full h-full p-5 sm:p-7 rounded-3xl bg-[#161E28] border border-[#2C3848] shadow-sm flex flex-col items-center justify-between"
          >
            <div className="text-xs text-[#EDE6D6]/40 uppercase tracking-wider font-mono">
              CONFIDENTIAL
            </div>

            <div className="space-y-2 w-full px-2">
              <p className="text-xs text-[#EDE6D6]/60">Secret identity for</p>
              <div className="w-full flex items-center justify-center min-h-[44px]">
                <h2 className={`${nameSizeClass} font-bold text-[#EDE6D6] whitespace-nowrap text-center tracking-normal leading-tight max-w-full overflow-hidden text-ellipsis`}>
                  {player.name}
                </h2>
              </div>
            </div>

            <div className="w-full py-3.5 px-4 rounded-xl bg-[#243040] text-xs font-medium text-[#EDE6D6] flex items-center justify-center gap-2 min-h-[44px]">
              <Eye className="w-4 h-4 text-[#B08D57]" />
              <span>Tap Card to Reveal</span>
            </div>
          </div>

          {/* BACK (Word Revealed - WIDE, UNBROKEN SINGLE-LINE CONTAINER) */}
          <div
            id="card-back"
            className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full px-4 py-5 sm:px-6 sm:py-6 rounded-3xl bg-[#FAF7F0] text-[#1B2430] border border-[#D6CCA9] shadow-md flex flex-col items-center justify-between overflow-hidden"
          >
            <div className="w-full flex items-center justify-between text-xs text-[#1B2430]/60">
              <span className="font-semibold whitespace-nowrap truncate max-w-[170px]">{player.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleHide();
                }}
                className="p-1 rounded hover:bg-[#EDE6D6] text-[11px] font-medium text-[#1B2430]/70 flex items-center gap-1 cursor-pointer"
                title="Hide / Show word"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide</span>
              </button>
            </div>

            {isMrWhite ? (
              <div className="space-y-2.5 my-auto w-full px-1 sm:px-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#B3261E] uppercase tracking-widest font-bold">
                  <AlertCircle className="w-4 h-4 text-[#B3261E]" />
                  <span>Agent Role: Mr. White</span>
                </div>

                <div className="p-3 bg-[#EDE6D6] rounded-2xl border border-[#D6CCA9] w-full text-center space-y-2.5 shadow-inner">
                  <div className="font-typewriter text-xl font-bold text-[#B3261E] uppercase tracking-wider">
                    NO SECRET WORD
                  </div>
                  <p className="text-[11px] text-[#1B2430]/80 font-medium leading-tight">
                    Intercepted 3 possible themes (1 is real, 2 are decoys):
                  </p>

                  {/* 3-Decoy Smoke Screen Channels */}
                  <div className="grid grid-cols-1 gap-1.5 pt-0.5 text-left">
                    {(player.decoyThemes && player.decoyThemes.length > 0
                      ? player.decoyThemes
                      : ['Food & Dining', 'Indian Culture', 'Technology & Media']
                    ).map((theme, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 bg-[#F6F2EA] border border-[#D6CCA9] rounded-xl text-xs font-semibold text-[#1B2430]"
                      >
                        <span className="font-mono text-[10px] text-[#B08D57] font-bold tracking-wider">
                          CHANNEL 0{idx + 1}
                        </span>
                        <span className="font-typewriter text-xs text-[#1B2430] tracking-wide font-bold">
                          {theme}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-[#1B2430]/70 italic leading-snug pt-0.5">
                    If you bluff on the wrong channel, you will be caught!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 my-auto w-full px-1 sm:px-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#1B2430]/60 uppercase tracking-widest font-semibold">
                  <Shield className="w-3.5 h-3.5 text-[#B08D57]" />
                  <span>Your Secret Word</span>
                </div>

                {/* EXPANDED, WIDE UNBROKEN WORD CONTAINER */}
                <div className="w-full py-4 px-3 sm:px-5 bg-[#EDE6D6] rounded-2xl border border-[#D6CCA9] flex items-center justify-center min-h-[82px] max-h-[114px] overflow-hidden shadow-inner relative">
                  {/* Subtle confidential watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                    <Shield className="w-24 h-24 text-[#1B2430]" />
                  </div>
                  <span className={`font-typewriter ${wordSizeClass} font-bold text-[#1B2430] uppercase tracking-wide text-center max-w-full leading-tight whitespace-nowrap z-10 px-1`}>
                    {player.word}
                  </span>
                </div>

                <p className="text-[11px] text-[#1B2430]/60 max-w-xs mx-auto leading-tight">
                  Give a short 1-word clue when it is your turn.
                </p>
              </div>
            )}

            {/* Countdown timer bar */}
            <div className="w-full space-y-1">
              <div className="flex justify-between text-[10px] text-[#1B2430]/50 font-mono">
                <span>{countdown > 0 ? `Memorize: ${countdown}s` : 'Memorized'}</span>
                <span>{player.codetag}</span>
              </div>
              <div className="w-full h-1.5 bg-[#D6CCA9]/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B08D57] transition-all duration-1000"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full space-y-2">
        {isFlipped ? (
          <button
            id="next-operative-btn"
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
          >
            <span>{playerIndex + 1 === totalPlayers ? 'Start Round' : 'Next Player'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFlip}
            className="w-full py-3 px-6 rounded-xl bg-[#243040] hover:bg-[#2C3848] text-[#EDE6D6] font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Eye className="w-4 h-4 text-[#B08D57]" />
            <span>Tap to View</span>
          </button>
        )}
      </div>
    </div>
  );
}

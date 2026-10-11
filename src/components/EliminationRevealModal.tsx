import { useEffect } from 'react';
import { ArrowRight, UserX, FolderLock } from 'lucide-react';
import { playClick, playStampSlam } from '../utils/audio';
import { Player } from '../types';

interface EliminationRevealModalProps {
  eliminatedPlayer: Player;
  onProceed: () => void;
}

export function EliminationRevealModal({
  eliminatedPlayer,
  onProceed,
}: EliminationRevealModalProps) {
  useEffect(() => {
    // Play the stamp slam sound after slight delay for visual sync
    const timer = setTimeout(() => {
      playStampSlam();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="elimination-reveal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-[#161E28] border border-[#2C3848] rounded-2xl p-6 shadow-2xl space-y-5 text-center text-[#EDE6D6] overflow-hidden relative">
        {/* Top classified banner */}
        <div className="flex items-center justify-between text-xs text-[#EDE6D6]/50 border-b border-[#2C3848] pb-3">
          <span className="flex items-center gap-1.5 font-medium">
            <FolderLock className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>CONFIDENTIAL DOSSIER</span>
          </span>
          <span className="font-mono text-[11px]">AGENT NO. {eliminatedPlayer.codetag}</span>
        </div>

        {/* Operative Card with Signature Animated ELIMINATED Stamp */}
        <div className="relative p-6 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-3 min-h-[140px] flex flex-col justify-center items-center">
          <div className="space-y-1">
            <p className="text-[11px] uppercase font-semibold text-[#EDE6D6]/50 tracking-wider">
              Operative Removed
            </p>
            <h3 className="text-2xl font-bold text-[#EDE6D6]">
              {eliminatedPlayer.name}
            </h3>
          </div>

          {/* SIGNATURE RED INK "ELIMINATED" STAMP SLAMMING DOWN */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-stamp">
              <span className="stamp-box-red text-base sm:text-lg px-4 py-1.5 shadow-lg bg-[#1B2430]/90">
                ELIMINATED
              </span>
            </div>
          </div>
        </div>

        {/* Classified Status Notice */}
        <div className="p-3.5 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1.5 text-xs text-left">
          <div className="flex items-center justify-between text-[#EDE6D6]/70">
            <span className="uppercase text-[10px] font-semibold tracking-wider">True Identity:</span>
            <span className="font-semibold text-[#B08D57] bg-[#B08D57]/15 px-2 py-0.5 rounded text-[11px]">
              CLASSIFIED
            </span>
          </div>

          <p className="text-[11px] text-[#EDE6D6]/60 leading-relaxed pt-1">
            {eliminatedPlayer.name} is removed from all future clues and votes. Their true role and word will remain secret until the final results screen.
          </p>
        </div>

        {/* Proceed Action Button */}
        <button
          id="elimination-proceed-btn"
          type="button"
          onClick={() => {
            playClick();
            onProceed();
          }}
          className="w-full py-3.5 px-5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Continue Game</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

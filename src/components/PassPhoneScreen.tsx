import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { playClick } from '../utils/audio';
import { Player } from '../types';
import { getNameSizeClass } from '../utils/textFit';

interface PassPhoneScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onProceed: () => void;
  onBackToPrevious?: () => void;
}

export function PassPhoneScreen({
  player,
  playerIndex,
  totalPlayers,
  onProceed,
  onBackToPrevious,
}: PassPhoneScreenProps) {
  const nameSizeClass = getNameSizeClass(player.name);

  return (
    <div
      id="pass-phone-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] w-full max-w-md sm:max-w-lg mx-auto px-3 sm:px-6 py-6 sm:py-8 text-center space-y-6 select-none"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <div className="flex items-center gap-1">
          {playerIndex > 0 && onBackToPrevious && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onBackToPrevious();
              }}
              className="p-1 -ml-1 rounded text-[#EDE6D6]/70 hover:text-[#EDE6D6] hover:bg-[#243040] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
          )}
          <span>Pass Phone</span>
        </div>
        <span>{playerIndex + 1} of {totalPlayers}</span>
      </div>

      {/* Center Card */}
      <div className="w-full my-auto bg-[#161E28] border border-[#2C3848] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#243040] flex items-center justify-center text-[#EDE6D6]/80 shadow-inner">
          <Shield className="w-7 h-7 text-[#B08D57]" />
        </div>

        <div className="space-y-2 w-full">
          <p className="text-xs text-[#EDE6D6]/60 uppercase tracking-wider font-medium">
            Hand device to
          </p>
          {/* Strictly Contained Unbroken Name Display */}
          <div className="py-2.5 px-3 bg-[#1B2430] rounded-xl border border-[#2C3848] w-full flex items-center justify-center min-h-[56px] overflow-hidden">
            <h2 className={`${nameSizeClass} font-bold text-[#EDE6D6] whitespace-nowrap text-center tracking-normal leading-tight max-w-full overflow-hidden text-ellipsis`}>
              {player.name}
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#EDE6D6]/50 max-w-xs mx-auto leading-relaxed">
          Keep the screen tilted away from others before tapping reveal.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5">
        <button
          id="pass-ready-btn"
          type="button"
          onClick={() => {
            playClick();
            onProceed();
          }}
          className="w-full py-3.5 px-5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          <span>Reveal My Word</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {playerIndex > 0 && onBackToPrevious && (
          <button
            type="button"
            onClick={() => {
              playClick();
              onBackToPrevious();
            }}
            className="w-full py-2 px-4 rounded-xl text-xs text-[#EDE6D6]/60 hover:text-[#EDE6D6] hover:bg-[#161E28] transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Passed too quickly? View previous player</span>
          </button>
        )}
      </div>
    </div>
  );
}

import { ArrowRight, Shield } from 'lucide-react';
import { playClick } from '../utils/audio';
import { Player } from '../types';

interface PassPhoneScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onProceed: () => void;
}

export function PassPhoneScreen({
  player,
  playerIndex,
  totalPlayers,
  onProceed,
}: PassPhoneScreenProps) {
  return (
    <div
      id="pass-phone-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] max-w-sm mx-auto px-4 py-8 text-center space-y-6"
    >
      <div className="w-full flex items-center justify-between text-xs text-[#EDE6D6]/50">
        <span>Pass Phone</span>
        <span>{playerIndex + 1} of {totalPlayers}</span>
      </div>

      {/* Center Card */}
      <div className="w-full my-auto bg-[#161E28] border border-[#2C3848] rounded-2xl p-8 shadow-sm space-y-5 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-[#243040] flex items-center justify-center text-[#EDE6D6]/80">
          <Shield className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-[#EDE6D6]/60">Hand device to</p>
          <h2 className="text-2xl font-bold text-[#EDE6D6]">
            {player.name}
          </h2>
        </div>

        <p className="text-xs text-[#EDE6D6]/50 max-w-xs mx-auto">
          Make sure nobody else can see your screen.
        </p>
      </div>

      {/* Button */}
      <div className="w-full">
        <button
          id="pass-ready-btn"
          type="button"
          onClick={() => {
            playClick();
            onProceed();
          }}
          className="w-full py-3.5 px-5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Reveal My Word</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

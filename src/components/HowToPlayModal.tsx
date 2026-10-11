import { X, Shield, Users, Trophy } from 'lucide-react';
import { playClick } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="how-to-play-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-[#161E28] border border-[#2C3848] rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col space-y-5 text-[#EDE6D6]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C3848] pb-3">
          <h2 className="text-base font-bold text-[#EDE6D6]">
            How to Play Word Spy
          </h2>
          <button
            id="close-rules-btn"
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-[#EDE6D6]/60 hover:text-[#EDE6D6] hover:bg-[#243040] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-[#EDE6D6]/80 leading-relaxed">
          {/* Overview */}
          <div className="space-y-1">
            <h3 className="font-semibold text-[#EDE6D6] text-xs">Overview</h3>
            <p>
              Word Spy is a pass-and-play party game for 3–15 players on one phone. Most players are Civilians with the same secret word. Imposters have a slightly different word or no word at all.
            </p>
          </div>

          {/* The Roles */}
          <div className="space-y-2">
            <h3 className="font-semibold text-[#EDE6D6] text-xs">The Roles</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848]">
                <div className="font-semibold text-[#EDE6D6] pb-0.5">Civilians (Majority)</div>
                <p className="text-[11px] text-[#EDE6D6]/70">
                  Receive the real secret word (e.g. <em>Coffee</em>). Find and eliminate all imposters.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848]">
                <div className="font-semibold text-[#B3261E] pb-0.5">Undercover (1–3 players)</div>
                <p className="text-[11px] text-[#EDE6D6]/70">
                  Receive a closely related word (e.g. <em>Tea</em>). Blend in and survive until the final 2 players.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848]">
                <div className="font-semibold text-[#B08D57] pb-0.5">Mr. White (0–1 player)</div>
                <p className="text-[11px] text-[#EDE6D6]/70">
                  Has no word! Must listen to others' clues and bluff their way through to survive.
                </p>
              </div>
            </div>
          </div>

          {/* Rounds & Gameplay */}
          <div className="space-y-1.5">
            <h3 className="font-semibold text-[#EDE6D6] text-xs">How Each Round Works</h3>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#EDE6D6]/70">
              <li><strong>Pass the Phone:</strong> Each player looks at their private word and memorizes it.</li>
              <li><strong>Give Clues:</strong> Players take turns giving a 1-word or short clue out loud. Mr. White is never placed first.</li>
              <li><strong>Vote:</strong> Discuss who seems suspicious. Cast the group vote to eliminate a player. Roles remain classified until the end of the game!</li>
            </ol>
          </div>

          {/* Scoring */}
          <div className="space-y-1.5">
            <h3 className="font-semibold text-[#EDE6D6] text-xs flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Points & Scoring</span>
            </h3>
            <div className="space-y-1 text-[11px] text-[#EDE6D6]/70">
              <p>
                • <strong>Surviving Civilians:</strong> <strong>+2 points</strong> on civilian victory (eliminated civilians earn 0 points).
              </p>
              <p>
                • <strong>Undercovers:</strong> <strong>+3 points</strong> if they deceive everyone to win.
              </p>
              <p>
                • <strong>Mr. White:</strong> <strong>+4 points</strong> for surviving or guessing the secret word.
              </p>
              <p className="text-[#EDE6D6]/50 pt-0.5">
                Points accumulate across games in the Session Scoreboard!
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-[#2C3848]">
          <button
            id="understood-rules-btn"
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

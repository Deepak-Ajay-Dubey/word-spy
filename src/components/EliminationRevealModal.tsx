import { useEffect } from 'react';
import { ArrowRight, FolderLock, ShieldAlert, CheckCircle2, AlertTriangle, EyeOff, Users, Shield } from 'lucide-react';
import { playClick, playStampSlam, playCivilianEliminatedWarning, playSpyCaught } from '../utils/audio';
import { Player } from '../types';

interface EliminationRevealModalProps {
  eliminatedPlayer: Player;
  players: Player[];
  roundNumber: number;
  onProceed: () => void;
}

export function EliminationRevealModal({
  eliminatedPlayer,
  players,
  roundNumber,
  onProceed,
}: EliminationRevealModalProps) {
  const isCivilian = eliminatedPlayer.role === 'CIVILIAN';
  const isUndercover = eliminatedPlayer.role === 'UNDERCOVER';
  const isMrWhite = eliminatedPlayer.role === 'MR_WHITE';

  // Calculate surviving operatives
  const aliveCivilians = players.filter((p) => !p.isEliminated && p.role === 'CIVILIAN').length;
  const aliveUndercovers = players.filter((p) => !p.isEliminated && p.role === 'UNDERCOVER').length;
  const aliveMrWhite = players.filter((p) => !p.isEliminated && p.role === 'MR_WHITE').length;
  const hadMrWhiteInGame = players.some((p) => p.role === 'MR_WHITE');
  const totalThreatsRemaining = aliveUndercovers + aliveMrWhite;

  useEffect(() => {
    // Play stamp slam first, followed by distinct role audio cue
    const stampTimer = setTimeout(() => {
      playStampSlam();
    }, 150);

    const audioTimer = setTimeout(() => {
      if (isCivilian) {
        playCivilianEliminatedWarning();
      } else {
        playSpyCaught();
      }
    }, 400);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(audioTimer);
    };
  }, [isCivilian]);

  return (
    <div
      id="elimination-reveal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
    >
      <div className="w-full max-w-sm sm:max-w-md bg-[#161E28] border border-[#2C3848] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 text-center text-[#EDE6D6] overflow-hidden relative">
        {/* Top classified banner */}
        <div className="flex items-center justify-between text-xs text-[#EDE6D6]/50 border-b border-[#2C3848] pb-2.5">
          <span className="flex items-center gap-1.5 font-medium">
            <FolderLock className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>MISSION DEBRIEF</span>
          </span>
          <span className="font-mono text-[11px]">ROUND {roundNumber} VOTING RESULT</span>
        </div>

        {/* Operative Card with Signature Animated Stamp */}
        <div className="relative p-5 rounded-2xl bg-[#1B2430] border border-[#2C3848] space-y-2 min-h-[130px] flex flex-col justify-center items-center">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50 tracking-wider">
              Operative Voted Out
            </p>
            <h3 className={`${eliminatedPlayer.name.length > 10 ? 'text-xl' : 'text-2xl'} font-bold text-[#EDE6D6] whitespace-nowrap text-center truncate max-w-full px-2`}>
              {eliminatedPlayer.name}
            </h3>
            <span className="text-[10px] font-mono text-[#B08D57]">
              AGENT CODEx{eliminatedPlayer.codetag}
            </span>
          </div>

          {/* DYNAMIC ROLE STAMP SLAMMING DOWN */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-stamp">
              {isCivilian && (
                <span className="border-2 border-[#D97706] text-[#D97706] font-typewriter font-black tracking-widest uppercase text-base sm:text-lg px-4 py-1.5 shadow-lg bg-[#1B2430]/95 rotate-[-8deg] inline-block">
                  CIVILIAN
                </span>
              )}
              {isUndercover && (
                <span className="border-2 border-[#B3261E] text-[#B3261E] font-typewriter font-black tracking-widest uppercase text-base sm:text-lg px-4 py-1.5 shadow-lg bg-[#1B2430]/95 rotate-[-8deg] inline-block">
                  UNDERCOVER
                </span>
              )}
              {isMrWhite && (
                <span className="border-2 border-white text-white font-typewriter font-black tracking-widest uppercase text-base sm:text-lg px-4 py-1.5 shadow-lg bg-[#1B2430]/95 rotate-[-8deg] inline-block">
                  MR. WHITE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Revealed Role Announcement */}
        <div
          className={`p-3.5 rounded-xl border text-left space-y-1.5 ${
            isCivilian
              ? 'bg-[#D97706]/10 border-[#D97706]/30 text-[#EDE6D6]'
              : isUndercover
              ? 'bg-[#B3261E]/15 border-[#B3261E]/40 text-[#EDE6D6]'
              : 'bg-[#EDE6D6]/10 border-[#EDE6D6]/30 text-[#EDE6D6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EDE6D6]/60">
              Role Revealed:
            </span>
            <span
              className={`font-typewriter font-bold text-xs uppercase px-2 py-0.5 rounded ${
                isCivilian
                  ? 'bg-[#D97706]/20 text-[#D97706]'
                  : isUndercover
                  ? 'bg-[#B3261E]/20 text-[#B3261E]'
                  : 'bg-white/20 text-white'
              }`}
            >
              {isCivilian ? 'CIVILIAN (INNOCENT)' : isUndercover ? 'UNDERCOVER AGENT' : 'MR. WHITE (NO WORD)'}
            </span>
          </div>

          <p className="text-xs text-[#EDE6D6]/80 leading-relaxed">
            {isCivilian && (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] inline mr-1 -mt-0.5" />
                <span className="font-semibold text-[#EDE6D6]">{eliminatedPlayer.name}</span> was an innocent civilian! The imposters are still hiding among you.
              </>
            )}
            {isUndercover && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B08D57] inline mr-1 -mt-0.5" />
                Great work! An <span className="font-semibold text-[#EDE6D6]">Undercover agent</span> has been neutralized.
              </>
            )}
            {isMrWhite && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white inline mr-1 -mt-0.5" />
                <span className="font-semibold text-white">Mr. White</span> has been eliminated! His bluff has been exposed.
              </>
            )}
          </p>

          {/* STRICT GUARANTEE: SECRET WORDS REMAIN CLASSIFIED */}
          <div className="pt-1.5 border-t border-[#2C3848]/60 flex items-center gap-1.5 text-[10px] text-[#EDE6D6]/50">
            <EyeOff className="w-3 h-3 text-[#B08D57] shrink-0" />
            <span>Secret words remain classified until the entire match concludes.</span>
          </div>
        </div>

        {/* LIVE THREATS REMAINING RADAR */}
        <div className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848] text-xs text-left space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#EDE6D6]/60 uppercase">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Remaining Operatives Status</span>
            </span>
            <span className={totalThreatsRemaining > 0 ? 'text-[#D97706]' : 'text-emerald-400'}>
              {totalThreatsRemaining > 0 ? 'Threats At Large' : 'Threats Neutralized'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {/* Civilians alive */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#161E28] border border-[#2C3848]">
              <span className="text-[#EDE6D6]/60 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Civilians</span>
              </span>
              <span className="font-bold text-[#EDE6D6] font-mono">{aliveCivilians} alive</span>
            </div>

            {/* Undercovers alive */}
            <div className={`flex items-center justify-between p-2 rounded-lg border ${
              aliveUndercovers > 0 ? 'bg-[#B3261E]/10 border-[#B3261E]/30 text-[#EDE6D6]' : 'bg-[#161E28] border-[#2C3848] text-[#EDE6D6]/40'
            }`}>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Undercover</span>
              </span>
              <span className="font-bold font-mono">
                {aliveUndercovers > 0 ? `${aliveUndercovers} remain` : 'None'}
              </span>
            </div>

            {/* Mr. White if in game */}
            {hadMrWhiteInGame && (
              <div className={`col-span-2 flex items-center justify-between p-2 rounded-lg border ${
                aliveMrWhite > 0 ? 'bg-white/10 border-white/20 text-[#EDE6D6]' : 'bg-[#161E28] border-[#2C3848] text-[#EDE6D6]/40'
              }`}>
                <span>Mr. White</span>
                <span className="font-bold font-mono">
                  {aliveMrWhite > 0 ? 'Still At Large' : 'Neutralized'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Proceed Action Button */}
        <button
          id="elimination-proceed-btn"
          type="button"
          onClick={() => {
            playClick();
            onProceed();
          }}
          className="w-full py-3.5 px-5 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-xs tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          <span>
            {totalThreatsRemaining > 0
              ? `Continue Game (Round ${roundNumber + 1})`
              : 'View Final Mission Results'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

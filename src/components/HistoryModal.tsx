import { useState } from 'react';
import { X, Trophy, History, Shield, Users, Trash2, Award, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { getMatchHistory, getHistoryAnalytics, clearMatchHistory, MatchRecord } from '../utils/historyManager';
import { playClick } from '../utils/audio';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'matches'>('analytics');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  if (!isOpen) return null;

  const matches = getMatchHistory();
  const analytics = getHistoryAnalytics();

  const handleClear = () => {
    playClick();
    clearMatchHistory();
    setShowClearConfirm(false);
  };

  const toggleExpand = (id: string) => {
    playClick();
    setExpandedMatchId((prev) => (prev === id ? null : id));
  };

  // Calculate faction percentages
  const total = analytics.totalGames || 1;
  const civPct = Math.round((analytics.factionWins.civilians / total) * 100);
  const undPct = Math.round((analytics.factionWins.undercovers / total) * 100);
  const whtPct = Math.round((analytics.factionWins.mrWhite / total) * 100);

  return (
    <div
      id="history-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0D131B]/85 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div className="w-full max-w-md bg-[#161E28] border border-[#2C3848] rounded-2xl shadow-2xl flex flex-col max-h-[88vh] text-[#EDE6D6] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2C3848] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#B08D57]" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#EDE6D6]">
              Game History &amp; Records
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-[#243040] text-[#EDE6D6]/60 hover:text-[#EDE6D6] cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-[#2C3848]/60 bg-[#141B24]">
          <button
            type="button"
            onClick={() => {
              playClick();
              setActiveTab('analytics');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-[#B08D57] text-[#1B2430] shadow-sm'
                : 'text-[#EDE6D6]/60 hover:text-[#EDE6D6] hover:bg-[#1E2836]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Records &amp; Stats</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setActiveTab('matches');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'matches'
                ? 'bg-[#B08D57] text-[#1B2430] shadow-sm'
                : 'text-[#EDE6D6]/60 hover:text-[#EDE6D6] hover:bg-[#1E2836]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Match Vault ({matches.length})</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {matches.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <History className="w-8 h-8 text-[#EDE6D6]/20 mx-auto" />
              <p className="text-xs text-[#EDE6D6]/60 max-w-xs mx-auto leading-relaxed">
                No completed matches on this device yet. Finish your first game to record match statistics, top winners, and rounds played!
              </p>
            </div>
          ) : activeTab === 'analytics' ? (
            /* TAB 1: ANALYTICS & RECORDS */
            <div className="space-y-4">
              {/* 2x2 Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Total Games */}
                <div className="p-3.5 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50">
                    Matches Played
                  </span>
                  <div className="text-xl font-bold text-[#EDE6D6] tabular-nums">
                    {analytics.totalGames}
                  </div>
                  <span className="text-[10px] text-[#EDE6D6]/40 block">on this device</span>
                </div>

                {/* Total Rounds */}
                <div className="p-3.5 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50">
                    Rounds Played
                  </span>
                  <div className="text-xl font-bold text-[#EDE6D6] tabular-nums">
                    {analytics.totalRounds}
                  </div>
                  <span className="text-[10px] text-[#EDE6D6]/40 block">
                    ~{analytics.averageRounds} rounds / game
                  </span>
                </div>

                {/* Top Winner */}
                <div className="p-3.5 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#B08D57] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#B08D57]" />
                    <span>Top Winner</span>
                  </span>
                  <div className="text-base font-bold text-[#EDE6D6] truncate">
                    {analytics.topWinner ? analytics.topWinner.name : '—'}
                  </div>
                  <span className="text-[10px] text-[#EDE6D6]/50 block tabular-nums">
                    {analytics.topWinner
                      ? `${analytics.topWinner.wins} Wins (${analytics.topWinner.winRate}%)`
                      : 'None yet'}
                  </span>
                </div>

                {/* Best Undercover */}
                <div className="p-3.5 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#B3261E] flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#B3261E]" />
                    <span>Best Imposter</span>
                  </span>
                  <div className="text-base font-bold text-[#EDE6D6] truncate">
                    {analytics.topUndercover ? analytics.topUndercover.name : '—'}
                  </div>
                  <span className="text-[10px] text-[#EDE6D6]/50 block tabular-nums">
                    {analytics.topUndercover
                      ? `${analytics.topUndercover.undercoverWins} Undercover Wins`
                      : 'None yet'}
                  </span>
                </div>
              </div>

              {/* Faction Win Breakdown Bar */}
              <div className="p-3.5 rounded-xl bg-[#1B2430] border border-[#2C3848] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#EDE6D6]/70">Faction Win Rates</span>
                  <span className="text-[11px] text-[#EDE6D6]/40 tabular-nums">{analytics.totalGames} Total Matches</span>
                </div>

                {/* Segmented Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#161E28]">
                  {civPct > 0 && (
                    <div
                      style={{ width: `${civPct}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Civilians: ${analytics.factionWins.civilians} wins (${civPct}%)`}
                    />
                  )}
                  {undPct > 0 && (
                    <div
                      style={{ width: `${undPct}%` }}
                      className="bg-[#B3261E] h-full transition-all"
                      title={`Undercovers: ${analytics.factionWins.undercovers} wins (${undPct}%)`}
                    />
                  )}
                  {whtPct > 0 && (
                    <div
                      style={{ width: `${whtPct}%` }}
                      className="bg-[#B08D57] h-full transition-all"
                      title={`Mr. White: ${analytics.factionWins.mrWhite} wins (${whtPct}%)`}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-[11px] text-[#EDE6D6]/60 pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Civilians: {analytics.factionWins.civilians} ({civPct}%)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#B3261E]" />
                    <span>Undercovers: {analytics.factionWins.undercovers} ({undPct}%)</span>
                  </span>
                  {analytics.factionWins.mrWhite > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#B08D57]" />
                      <span>Mr. White: {analytics.factionWins.mrWhite} ({whtPct}%)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Player Standings Leaderboard */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#EDE6D6]/70 block px-1">
                  Player Hall of Fame
                </span>

                <div className="space-y-1.5">
                  {analytics.playerStats.map((player, idx) => (
                    <div
                      key={player.name}
                      className="p-3 rounded-xl bg-[#1B2430] border border-[#2C3848] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 text-center font-mono text-[11px] font-bold ${
                          idx === 0 ? 'text-[#B08D57]' : 'text-[#EDE6D6]/40'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="font-semibold text-[#EDE6D6] block truncate">
                            {player.name}
                          </span>
                          <span className="text-[10px] text-[#EDE6D6]/40 block tabular-nums">
                            {player.gamesPlayed} {player.gamesPlayed === 1 ? 'game' : 'games'} · {player.winRate}% win rate
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-[#EDE6D6] tabular-nums block">
                          {player.wins} {player.wins === 1 ? 'win' : 'wins'}
                        </span>
                        <span className="text-[10px] text-[#B08D57] font-semibold block tabular-nums">
                          {player.totalPoints} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: MATCH VAULT (Chronological match-by-match log) */
            <div className="space-y-2.5">
              {matches.map((m, index) => {
                const isExpanded = expandedMatchId === m.id;
                const formattedDate = new Date(m.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const isCivilians = m.winner === 'CIVILIANS';
                const isUndercovers = m.winner === 'UNDERCOVERS';

                return (
                  <div
                    key={m.id}
                    className="rounded-xl bg-[#1B2430] border border-[#2C3848] overflow-hidden transition-all text-xs"
                  >
                    {/* Collapsed Header */}
                    <div
                      onClick={() => toggleExpand(m.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#243040]/50 transition-colors gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#EDE6D6]">
                            Match #{matches.length - index}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isCivilians
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : isUndercovers
                                ? 'bg-[#B3261E]/15 text-[#B3261E]'
                                : 'bg-[#B08D57]/15 text-[#B08D57]'
                            }`}
                          >
                            {m.winnerTitle}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#EDE6D6]/40 flex items-center gap-1.5 pt-0.5">
                          <span>{m.roundsPlayed} {m.roundsPlayed === 1 ? 'Round' : 'Rounds'}</span>
                          <span>•</span>
                          <span>{m.category}</span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      <div className="shrink-0 p-1 text-[#EDE6D6]/50">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-[#2C3848] space-y-3 bg-[#161E28]/50">
                        {/* Word Comparison */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-2 rounded-lg bg-[#1B2430] border border-[#2C3848]">
                            <span className="text-[9px] uppercase font-semibold text-[#EDE6D6]/50 block">Civilian Word</span>
                            <span className="font-mono text-xs font-bold text-[#EDE6D6] truncate block">{m.civilianWord}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#1B2430] border border-[#2C3848]">
                            <span className="text-[9px] uppercase font-semibold text-[#B3261E] block">Undercover Word</span>
                            <span className="font-mono text-xs font-bold text-[#B3261E] truncate block">{m.undercoverWord}</span>
                          </div>
                        </div>

                        {/* Operatives Roster */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-semibold text-[#EDE6D6]/50 block">
                            Operatives &amp; Points Awarded
                          </span>
                          <div className="space-y-1">
                            {m.players.map((p) => (
                              <div
                                key={p.name}
                                className="py-1.5 px-2 rounded-lg bg-[#1B2430] flex items-center justify-between text-[11px]"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-semibold text-[#EDE6D6] truncate">{p.name}</span>
                                  <span className="text-[#EDE6D6]/40">({p.role.toLowerCase()})</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={p.isEliminated ? 'text-[#B3261E]' : 'text-emerald-400'}>
                                    {p.isEliminated ? `Out R${p.eliminatedRound || 1}` : 'Survived'}
                                  </span>
                                  <span className="font-bold text-[#B08D57] tabular-nums">
                                    +{p.pointsEarned} pts
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-[#2C3848] bg-[#141B24] flex items-center justify-between">
          {showClearConfirm ? (
            <div className="w-full flex items-center justify-between gap-2">
              <span className="text-xs text-[#EDE6D6]/70">Erase all saved matches?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 text-xs text-[#EDE6D6]/60 hover:text-[#EDE6D6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1 rounded-lg text-xs bg-[#B3261E] text-white hover:bg-[#9B1E17] transition-colors cursor-pointer"
                >
                  Erase
                </button>
              </div>
            </div>
          ) : (
            <>
              {matches.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-[#EDE6D6]/40 hover:text-[#B3261E] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              ) : (
                <span className="text-[11px] text-[#EDE6D6]/40">History saved locally</span>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#243040] hover:bg-[#2C3848] text-[#EDE6D6] transition-colors cursor-pointer min-h-[36px]"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

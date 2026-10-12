import { useState, useEffect } from 'react';
import { GamePhase, Player, WordPair, GameResult } from './types';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import { HistoryModal } from './components/HistoryModal';
import { HomeScreen } from './components/HomeScreen';
import { PlayerSetup } from './components/PlayerSetup';
import { PassPhoneScreen } from './components/PassPhoneScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { DescribeRoundScreen } from './components/DescribeRoundScreen';
import { VotingScreen } from './components/VotingScreen';
import { EliminationRevealModal } from './components/EliminationRevealModal';
import { GameOverScreen } from './components/GameOverScreen';
import { getSoundEnabled } from './utils/audio';
import { assignRolesAndWords, checkWinCondition, generateRoundTurnOrder } from './utils/gameLogic';
import { getNextWordPair, prefetchWordBatch } from './utils/wordService';
import { recordGamePoints } from './utils/scoreManager';
import { saveMatchRecord } from './utils/historyManager';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('HOME');
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [scoreboardOpen, setScoreboardOpen] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(getSoundEnabled());
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All Categories']);

  // Active game states
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState<number>(0);
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [roundTurnOrder, setRoundTurnOrder] = useState<Player[]>([]);
  const [voterRotationIndex, setVoterRotationIndex] = useState<number>(0);
  const [lastEliminatedPlayer, setLastEliminatedPlayer] = useState<Player | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Pre-fetch live AI words if Surprise Me is chosen
  useEffect(() => {
    prefetchWordBatch(selectedCategories).catch(() => {});
  }, [selectedCategories]);

  // Start a fresh game with chosen names
  const handleStartGame = async (names: string[]) => {
    setPlayerNames(names);

    try {
      const pair = await getNextWordPair(selectedCategories);
      setCurrentWordPair(pair);

      const assignedPlayers = assignRolesAndWords(names, pair);
      setPlayers(assignedPlayers);
      setCurrentRevealIndex(0);
      setRoundNumber(1);
      setVoterRotationIndex(0);
      setLastEliminatedPlayer(null);
      setGameResult(null);
      setPhase('PASS_TO_REVEAL');
    } catch (err) {
      console.error('Failed to prepare game:', err);
    }
  };

  // Next player in reveal phase
  const handleDoneReveal = () => {
    if (currentRevealIndex < players.length - 1) {
      const nextIdx = currentRevealIndex + 1;
      setCurrentRevealIndex(nextIdx);
      setPhase('PASS_TO_REVEAL');
    } else {
      // All players viewed role -> start first round
      const alive = players.filter((p) => !p.isEliminated);
      const newOrder = generateRoundTurnOrder(alive);
      setRoundTurnOrder(newOrder);
      setRoundNumber(1);
      setPhase('DESCRIBE_TURN');
    }
  };

  // Backward step in reveal phase if passed too quickly
  const handleBackToPrevious = () => {
    if (currentRevealIndex > 0) {
      setCurrentRevealIndex((prev) => prev - 1);
      setPhase('ROLE_REVEAL');
    }
  };

  // Describe round finished -> go to voting
  const handleFinishDescribeRound = () => {
    setPhase('VOTING');
  };

  // Alive players list
  const alivePlayers = players.filter((p) => !p.isEliminated);

  // Designated voter rotates automatically each round through alive players
  const designatedVoter =
    alivePlayers.length > 0
      ? alivePlayers[voterRotationIndex % alivePlayers.length]
      : players[0];

  // Elimination handler from Voting screen
  const handleEliminatePlayer = (target: Player) => {
    const updatedPlayers = players.map((p) =>
      p.id === target.id
        ? { ...p, isEliminated: true, eliminatedRound: roundNumber }
        : p
    );

    setPlayers(updatedPlayers);
    const updatedTarget = updatedPlayers.find((p) => p.id === target.id)!;
    setLastEliminatedPlayer(updatedTarget);
    setPhase('ELIMINATION_REVEAL');
  };

  // Tied vote skip handler
  const handleTiedVoteSkip = () => {
    const nextRound = roundNumber + 1;
    const alive = players.filter((p) => !p.isEliminated);
    const newOrder = generateRoundTurnOrder(alive);
    setRoundTurnOrder(newOrder);
    setRoundNumber(nextRound);
    setVoterRotationIndex((v) => v + 1);
    setPhase('DESCRIBE_TURN');
  };

  // Proceed after viewing eliminated player's role
  const handleProceedAfterEliminationReveal = () => {
    if (!lastEliminatedPlayer || !currentWordPair) return;

    // Check win condition
    const result = checkWinCondition(
      players,
      currentWordPair.civilian,
      currentWordPair.undercover,
      currentWordPair.category,
      roundNumber
    );

    if (result) {
      // Record game scores: Surviving Civilian +2, Eliminated Civilian +0, Undercover +3, Mr White +4
      const { pointsEarned } = recordGamePoints(players, result.winner);
      result.pointsEarned = pointsEarned;

      // Automatically log completed match to device history
      saveMatchRecord({
        id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        roundsPlayed: roundNumber,
        winner: result.winner,
        winnerTitle: result.title,
        civilianWord: result.civilianWord,
        undercoverWord: result.undercoverWord,
        category: result.category,
        players: players.map((p) => ({
          name: p.name,
          role: p.role,
          isEliminated: p.isEliminated,
          eliminatedRound: p.eliminatedRound,
          pointsEarned: pointsEarned[p.name.trim()] || 0,
        })),
      });

      setGameResult(result);
      setPhase('GAME_OVER');
    } else {
      // Next round: reshuffle turn order cleanly (with Mr. White never first)
      const nextRound = roundNumber + 1;
      const alive = players.filter((p) => !p.isEliminated);
      const newOrder = generateRoundTurnOrder(alive);
      setRoundTurnOrder(newOrder);
      setRoundNumber(nextRound);
      setVoterRotationIndex((v) => v + 1);
      setPhase('DESCRIBE_TURN');
    }
  };

  // Play again with same players (points persist across games, next fresh word pair)
  const handlePlayAgainSamePlayers = () => {
    if (playerNames.length >= 3) {
      handleStartGame(playerNames);
    } else {
      setPhase('SETUP');
    }
  };

  // Reset to Home / Setup
  const handleRestart = () => {
    setPhase('HOME');
    setPlayers([]);
    setCurrentWordPair(null);
    setGameResult(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#1B2430] text-[#EDE6D6] font-sans flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-[#B08D57] selection:text-[#1B2430]">
      {/* Phone container */}
      <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-[760px] sm:h-[830px] bg-[#161E28] sm:rounded-3xl sm:border sm:border-[#2C3848] shadow-2xl flex flex-col justify-between overflow-hidden relative">
        {/* App Header */}
        <Header
          phase={phase}
          onOpenRules={() => setRulesOpen(true)}
          onOpenScoreboard={() => setScoreboardOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onRestart={handleRestart}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />

        {/* Screen View */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto">
          {phase === 'HOME' && (
            <HomeScreen
              onStartNewGame={() => setPhase('SETUP')}
              onOpenRules={() => setRulesOpen(true)}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          )}

          {phase === 'SETUP' && (
            <PlayerSetup
              onStartGame={handleStartGame}
              onBack={() => setPhase('HOME')}
            />
          )}

          {phase === 'PASS_TO_REVEAL' && players[currentRevealIndex] && (
            <PassPhoneScreen
              player={players[currentRevealIndex]}
              playerIndex={currentRevealIndex}
              totalPlayers={players.length}
              onProceed={() => setPhase('ROLE_REVEAL')}
              onBackToPrevious={currentRevealIndex > 0 ? handleBackToPrevious : undefined}
            />
          )}

          {phase === 'ROLE_REVEAL' && players[currentRevealIndex] && (
            <RoleRevealScreen
              player={players[currentRevealIndex]}
              playerIndex={currentRevealIndex}
              totalPlayers={players.length}
              onDoneReveal={handleDoneReveal}
              onBackToPrevious={currentRevealIndex > 0 ? handleBackToPrevious : undefined}
            />
          )}

          {phase === 'DESCRIBE_TURN' && (
            <DescribeRoundScreen
              roundNumber={roundNumber}
              turnOrder={roundTurnOrder.length > 0 ? roundTurnOrder : alivePlayers}
              onFinishRound={handleFinishDescribeRound}
            />
          )}

          {phase === 'VOTING' && designatedVoter && (
            <VotingScreen
              roundNumber={roundNumber}
              designatedVoter={designatedVoter}
              alivePlayers={alivePlayers}
              onEliminatePlayer={handleEliminatePlayer}
              onTiedVoteSkip={handleTiedVoteSkip}
            />
          )}

          {phase === 'ELIMINATION_REVEAL' && lastEliminatedPlayer && (
            <EliminationRevealModal
              eliminatedPlayer={lastEliminatedPlayer}
              onProceed={handleProceedAfterEliminationReveal}
            />
          )}

          {phase === 'GAME_OVER' && gameResult && (
            <GameOverScreen
              result={gameResult}
              onPlayAgain={handlePlayAgainSamePlayers}
              onGoHome={handleRestart}
              onOpenScoreboard={() => setScoreboardOpen(true)}
              onOpenHistory={() => setHistoryOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Rules Modal */}
      <HowToPlayModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
      />

      {/* Scoreboard Modal */}
      <ScoreboardModal
        isOpen={scoreboardOpen}
        onClose={() => setScoreboardOpen(false)}
      />

      {/* History & Match Analytics Modal */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}

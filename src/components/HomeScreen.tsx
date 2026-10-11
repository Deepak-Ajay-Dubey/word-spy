import { useState } from 'react';
import { Play, HelpCircle, Users, ChevronDown } from 'lucide-react';
import { playClick } from '../utils/audio';
import { CATEGORIES } from '../data/fallbackWords';

interface HomeScreenProps {
  onStartNewGame: () => void;
  onOpenRules: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export function HomeScreen({
  onStartNewGame,
  onOpenRules,
  selectedCategory,
  setSelectedCategory,
}: HomeScreenProps) {
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  return (
    <div
      id="home-screen"
      className="flex flex-col items-center justify-between min-h-[calc(100vh-68px)] max-w-md mx-auto px-4 py-8 text-center space-y-6"
    >
      {/* Central Clean Card */}
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="w-full bg-[#161E28] rounded-2xl p-6 border border-[#2C3848] shadow-sm space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#EDE6D6]">
              Word Spy
            </h1>
            <p className="text-sm text-[#EDE6D6]/70 max-w-xs mx-auto leading-relaxed">
              Pass one phone around. One player is Undercover with a different word, one might be Mr. White with no word at all. Find the imposter before you are exposed.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#EDE6D6]/50 pt-1">
            <Users className="w-3.5 h-3.5" />
            <span>3 to 15 Players • Single Device</span>
          </div>
        </div>
      </div>

      {/* Category selector & Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        {/* Word Category Selector */}
        <div className="relative">
          <button
            id="toggle-category-btn"
            type="button"
            onClick={() => {
              playClick();
              setShowCategorySelector(!showCategorySelector);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#161E28] hover:bg-[#1E2836] border border-[#2C3848] text-xs text-[#EDE6D6] flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="text-[#EDE6D6]/60">Category:</span>
            <span className="font-medium text-[#EDE6D6] flex items-center gap-1">
              {selectedCategory}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </span>
          </button>

          {showCategorySelector && (
            <div className="absolute bottom-full mb-2 left-0 right-0 p-2 bg-[#161E28] border border-[#2C3848] rounded-xl shadow-xl z-20 grid grid-cols-2 gap-1 animate-in fade-in duration-100 max-h-56 overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedCategory(cat);
                    setShowCategorySelector(false);
                  }}
                  className={`py-2 px-2.5 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#243040] text-[#EDE6D6] font-semibold'
                      : 'text-[#EDE6D6]/70 hover:bg-[#1B2430]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          id="home-start-game-btn"
          type="button"
          onClick={() => {
            playClick();
            onStartNewGame();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Play className="w-4 h-4 fill-[#1B2430]" />
          <span>Start Game</span>
        </button>

        {/* How to Play CTA */}
        <button
          id="home-how-to-play-btn"
          type="button"
          onClick={() => {
            playClick();
            onOpenRules();
          }}
          className="w-full py-2.5 px-6 rounded-xl bg-transparent hover:bg-[#161E28] text-[#EDE6D6]/70 hover:text-[#EDE6D6] text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How to Play</span>
        </button>
      </div>
    </div>
  );
}

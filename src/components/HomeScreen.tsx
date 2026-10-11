import { useState } from 'react';
import { Play, HelpCircle, Users, ChevronDown, Check, Layers, X } from 'lucide-react';
import { playClick } from '../utils/audio';
import { CATEGORIES } from '../data/fallbackWords';

interface HomeScreenProps {
  onStartNewGame: () => void;
  onOpenRules: () => void;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
}

export function HomeScreen({
  onStartNewGame,
  onOpenRules,
  selectedCategories,
  setSelectedCategories,
}: HomeScreenProps) {
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  // Exclude 'All Categories' from individual toggle items
  const realCategories = CATEGORIES.filter((c) => c !== 'All Categories');
  const isAllSelected =
    selectedCategories.includes('All Categories') ||
    selectedCategories.length === realCategories.length;

  const handleToggleCategory = (cat: string) => {
    playClick();
    if (cat === 'All Categories') {
      if (isAllSelected) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(['All Categories']);
      }
      return;
    }

    // Working with a specific category
    let currentList = selectedCategories.includes('All Categories')
      ? [...realCategories]
      : [...selectedCategories];

    if (currentList.includes(cat)) {
      currentList = currentList.filter((c) => c !== cat);
    } else {
      currentList.push(cat);
    }

    if (currentList.length === 0) {
      setSelectedCategories(['All Categories']);
    } else if (currentList.length === realCategories.length) {
      setSelectedCategories(['All Categories']);
    } else {
      setSelectedCategories(currentList);
    }
  };

  const handleSelectAll = () => {
    playClick();
    setSelectedCategories(['All Categories']);
  };

  const handleClearAll = () => {
    playClick();
    // Default to at least the first one or empty
    setSelectedCategories([realCategories[0]]);
  };

  // Label to show on the button
  let displayCategoryLabel = 'All Categories';
  if (isAllSelected) {
    displayCategoryLabel = 'All Categories';
  } else if (selectedCategories.length === 1) {
    displayCategoryLabel = selectedCategories[0];
  } else if (selectedCategories.length === 2) {
    displayCategoryLabel = `${selectedCategories[0]} & ${selectedCategories[1]}`;
  } else if (selectedCategories.length > 2) {
    displayCategoryLabel = `${selectedCategories.length} Categories Selected`;
  }

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
        {/* Word Category Selector Trigger */}
        <div className="relative">
          <button
            id="toggle-category-btn"
            type="button"
            onClick={() => {
              playClick();
              setShowCategorySelector(true);
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#161E28] hover:bg-[#1E2836] border border-[#2C3848] text-xs text-[#EDE6D6] flex items-center justify-between transition-colors cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2 text-left truncate">
              <Layers className="w-4 h-4 text-[#B08D57] shrink-0" />
              <div className="truncate">
                <span className="text-[#EDE6D6]/50 block text-[10px] uppercase font-semibold">Categories</span>
                <span className="font-medium text-[#EDE6D6] truncate block">{displayCategoryLabel}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 opacity-70 shrink-0 ml-2" />
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          id="home-start-game-btn"
          type="button"
          onClick={() => {
            playClick();
            onStartNewGame();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-sm tracking-wide active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
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
          className="w-full py-2.5 px-6 rounded-xl bg-transparent hover:bg-[#161E28] text-[#EDE6D6]/70 hover:text-[#EDE6D6] text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How to Play</span>
        </button>
      </div>

      {/* Multi-Category Selector Modal */}
      {showCategorySelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D131B]/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#161E28] border border-[#2C3848] rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] text-[#EDE6D6]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2C3848]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B08D57]" />
                <h3 className="text-sm font-semibold text-[#EDE6D6]">Select Categories</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowCategorySelector(false);
                }}
                className="p-1 rounded-lg hover:bg-[#243040] text-[#EDE6D6]/60 hover:text-[#EDE6D6] cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between py-2.5 px-1 text-xs">
              <span className="text-[#EDE6D6]/60">
                {isAllSelected
                  ? 'All categories active'
                  : `${selectedCategories.length} selected`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 rounded bg-[#243040] hover:bg-[#2C3848] text-xs text-[#EDE6D6] cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 rounded bg-[#243040] hover:bg-[#2C3848] text-xs text-[#EDE6D6]/70 hover:text-[#EDE6D6] cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Category Checkboxes List */}
            <div className="space-y-1.5 overflow-y-auto py-1 pr-1 flex-1 max-h-[50vh]">
              {/* All Categories Option */}
              <button
                type="button"
                onClick={() => handleToggleCategory('All Categories')}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs transition-colors cursor-pointer text-left ${
                  isAllSelected
                    ? 'bg-[#B08D57]/15 border-[#B08D57] text-[#EDE6D6] font-semibold'
                    : 'bg-[#1B2430] border-[#2C3848] text-[#EDE6D6]/70 hover:bg-[#243040]'
                }`}
              >
                <span>All Categories (Mix Everything)</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isAllSelected
                      ? 'bg-[#B08D57] border-[#B08D57] text-[#1B2430]'
                      : 'border-[#2C3848]'
                  }`}
                >
                  {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Individual Categories */}
              {realCategories.map((cat) => {
                const isChecked = isAllSelected || selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs transition-colors cursor-pointer text-left ${
                      isChecked
                        ? 'bg-[#243040] border-[#B08D57]/60 text-[#EDE6D6] font-medium'
                        : 'bg-[#1B2430] border-[#2C3848] text-[#EDE6D6]/60 hover:bg-[#222D3B]'
                    }`}
                  >
                    <span>{cat}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked
                          ? 'bg-[#B08D57] border-[#B08D57] text-[#1B2430]'
                          : 'border-[#2C3848]'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Done CTA */}
            <div className="pt-3 border-t border-[#2C3848] mt-2">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowCategorySelector(false);
                }}
                className="w-full py-3 rounded-xl bg-[#B08D57] hover:bg-[#C29D64] active:bg-[#9B7B47] text-[#1B2430] font-semibold text-xs tracking-wide cursor-pointer min-h-[44px]"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

# Word Spy: Expanded Word Library, Mobile-First UI, & Complete Game Enhancements

An exhaustive implementation plan for upgrading Word Spy with a vastly expanded word library (200+ new pairs), persistent anti-repeat memory, full mobile ergonomics with contained non-overflowing text boxes, custom default player management (Deepak, Harshad, shrey, Soham), role-leak-free audio, secure word re-peeking, multi-category selection, and survivor-weighted scoring.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Explicit confirmations for user requirements**:
> - **Massive Word Library Expansion (Included)**: Over 200+ new curated, distinct word pairs added across all categories (Everyday Life, Food & Kitchen, Cinema & Entertainment, Sports, Clothing, Technology, Nature, Travel), combined with persistent `localStorage` tracking so words do not repeat across games.
> - **Mobile-Friendly Architecture (Included)**: Built specifically for single-phone pass-and-play ergonomics with guaranteed text containment so secret words and buttons never overflow or clip outside card boundaries, plus touch targets $\ge 44\text{px}$.
> - **Default 4 Player Roster**: Initial players default to **Deepak**, **Harshad**, **shrey**, and **Soham**, with inline delete buttons to remove any player (when total $\ge 3$) and quick addition of new players up to 15.
> - **Faction Scoring Matrix**: Surviving Civilians earn **+2 points** on victory; eliminated Civilians earn **0 points** (points remain unchanged); Undercovers earn **+3 points** on victory; Mr. White earns **+4 points** on victory.
> - **Secret Word Re-Visit**: Accessible both via backward navigation during the initial pass-and-play reveal sequence and via a discreet press-and-hold "Peek Word" button during clue rounds.
> - **Multi-Category Selection**: Players can select any combination of multiple categories or "All Categories" together.
> - **Zero Acoustic Leakage**: Completely neutralize any audio differentiation for Mr. White or Undercover so acoustic leakage cannot reveal clandestine roles.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a polished, mobile-optimized, single-device social deduction game where friends pass one phone around. Eliminates repetitive words by maintaining an anti-repeat history across games and vastly expanding the vocabulary. Protects secret identities with identical neutral card sounds and ensures words are clearly readable within fixed card dimensions.
- **Target Audience / Persona**: Groups of 3–15 players (specifically starting with Deepak, Harshad, shrey, and Soham) passing a smartphone around in living rooms, cafes, or parties.
- **Key Value**: Fresh words every game without repetition, zero accidental role leaks from sound cues or screen overflows, flexible category filtering, and rewarding strategic survival with clear cumulative scores.

---

## 2. User Experience & Mobile Visual Design

### Mobile-First Layout & Touch Ergonomics
- **Screen Sizing & Containment**: Optimized for smartphone viewports (375px–430px wide, 100vh safe-area).
- **Contained Secret Word Box**:
  - The secret word display box is strictly bounded (`w-full max-w-xs mx-auto overflow-hidden rounded-xl border p-4`).
  - Text scales dynamically (`text-xl sm:text-2xl font-bold break-words line-clamp-2 uppercase text-center`) so long or two-word names never bleed or overflow outside the box.
- **Minimum Hitboxes**: All interactive buttons, remove triggers, and category checkboxes have $\ge 44\text{px}$ touch targets to prevent accidental mis-taps.

### Key User Flows

1. **Home Screen & Multi-Category Selection**:
   - The category selector provides a multi-select modal with clean checkboxes for each category:
     - Food & Kitchen
     - Everyday Life & Home
     - Clothing & Fashion
     - Technology & Media
     - Work & Office
     - Sports & Games
     - Travel & Places
     - Nature & Animals
     - Cinema & Pop Culture
     - People & Feelings
   - Includes "Select All" and "Clear All" shortcuts, as well as an active count badge (e.g., "3 Categories Selected").
   - Users can choose any custom combination of categories.

2. **Player Setup Screen**:
   - Prefilled by default with: **1. Deepak**, **2. Harshad**, **3. shrey**, **4. Soham**.
   - Each row has an inline delete/trash button (visible when player count > 3) to easily remove any specific player.
   - "+ Add Player" button appends Player 5, Player 6, etc., up to 15 players.

3. **Pass-and-Reveal & Re-Visit Word**:
   - During pass-and-play:
     - Clear instructions: "Hand device to Deepak".
     - "Back to Previous Player" button allows re-verifying a word if passed prematurely.
     - Reveal sound is a single, uniform card-swish sound for all roles (Civilian, Undercover, Mr. White). Mr. White glitch audio is completely removed.
   - Word container is strictly padded and bounded with responsive sizing.

4. **Clue / Describe Round with Discreet Re-Peek**:
   - During the speaking round, an unobtrusive "Peek Word" button appears on the current speaker card.
   - Tapping it opens a discreet modal: the current speaker can press and hold a confidential preview button to view their word privately; releasing immediately hides the word.

5. **Round End & Survivor-Weighted Scoring**:
   - When Civilians win: Surviving Civilians receive **+2 pts**; Civilians eliminated in earlier rounds receive **0 pts**.
   - When Undercovers win: Undercovers receive **+3 pts**.
   - When Mr. White wins: Mr. White receives **+4 pts**.
   - The Game Over screen clearly displays the points awarded this round next to each player, along with the updated session scoreboard.

---

## 3. Word Library Expansion & Anti-Repeat Engine

### Vast Word Pool Expansion (200+ New Pairs)
Adding over 200 high-quality, balanced word pairs across categories:
- **Food & Kitchen**: Samosa / Kachori, Dosa / Uttapam, Gulab Jamun / Rasgulla, Biryani / Pulao, Paneer Tikka / Chaap, Chai / Filter Coffee, Pizza / Calzone, etc.
- **Everyday Life & Home**: Blanket / Quilt, Balcony / Terrace, Mattress / Cushion, Key / Lock, Bucket / Tub, Broom / Mop, Torch / Flashlight, etc.
- **Clothing & Fashion**: Kurta / Sherwani, Saree / Lehenga, Jeans / Trousers, Hoodie / Jacket, Sneakers / Loafers, Scarf / Dupatta, etc.
- **Cinema & Pop Culture**: Bollywood / Hollywood, Hero / Villain, Cinema Hall / Multiplex, Director / Producer, Popcorn / Nachos, etc.
- **Sports & Games**: Cricket / Baseball, Badminton / Tennis, Football / Rugby, Chess / Carrom, Ludo / Snakes & Ladders, Gym / Yoga, etc.
- **Technology & Media**: Smartphone / Tablet, Instagram / Snapchat, YouTube / Netflix, Bluetooth / Wi-Fi, Laptop / Desktop, etc.
- **Nature & Animals**: Tiger / Leopard, Peacock / Sparrow, Monsoon / Winter, Mountain / Hill, River / Canal, etc.
- **Travel & Places**: Auto Rickshaw / Taxi, Metro / Local Train, Highway / Expressway, Airport / Railway Station, Hotel / Resort, etc.

### Anti-Repeat Cycling Mechanism
- Word pairs are tracked in a `Set` persisted in `localStorage` under `word_spy_used_words_v2`.
- When picking a pair for the selected categories, any pair in the used set is skipped.
- Only when all eligible words in the selected categories have been played will the history recycle, guaranteeing no repeating words across consecutive games.

---

## 4. Technical Architecture & Component Mapping

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                             │
│  State: phase, selectedCategories[], players[], scores      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     ┌─────────┴──────────┐        ┌──────────┴──────────┐
     ▼                    ▼        ▼                     ▼
┌─────────────┐   ┌────────────┐ ┌─────────────┐   ┌───────────┐
│ HomeScreen  │   │PlayerSetup │ │DescribeTurn │   │ GameOver  │
│ Multi-Select│   │Deepak,     │ │Discreet Peek│   │ +2 Surv., │
│ Category    │   │Harshad,    │ │Press-Hold   │   │ +3 Under.,│
│ Modal/Chips │   │shrey,      │ │Safe Modal   │   │ +4 White  │
│             │   │Soham       │ │             │   │           │
└─────────────┘   └────────────┘ └─────────────┘   └───────────┘
       │                 │              │                │
       ▼                 ▼              ▼                ▼
┌──────────────────┐  ┌────────────────────────────────────────┐
│  wordService.ts  │  │            scoreManager.ts             │
│  - Multi-cat pool│  │  - recordGamePoints(players, winner)   │
│  - LocalStorage  │  │  - Surviving Civilians: +2 pts         │
│    used-word set │  │  - Eliminated Civilians: +0 pts        │
│  - 250+ pairs    │  │  - Undercover win: +3 pts              │
└──────────────────┘  │  - Mr. White win: +4 pts               │
                      └────────────────────────────────────────┘
```

### Component Updates Planned
1. `src/data/fallbackWords.ts`: Add 200+ new pairs across all categories.
2. `src/utils/wordService.ts`: Filter across `selectedCategories: string[]`, maintain persistent anti-repeat cache in `localStorage`.
3. `src/utils/audio.ts`: Remove `playGlitch` and any distinctive role-reveal sounds; all card reveals use uniform soft card flip.
4. `src/utils/scoreManager.ts`: Update point calculations based on `isEliminated` status (Surviving Civilian: +2, Eliminated Civilian: 0, Undercover: +3, Mr. White: +4).
5. `src/components/HomeScreen.tsx`: Multi-category selector modal with checkboxes, Select All, and Clear All.
6. `src/components/PlayerSetup.tsx`: Default to Deepak, Harshad, shrey, Soham; add delete button per player; add player button.
7. `src/components/RoleRevealScreen.tsx` & `PassPhoneScreen.tsx`: Contained responsive text box for secret words, back button to re-visit previous player.
8. `src/components/DescribeRoundScreen.tsx`: Discreet press-and-hold "Peek Word" button for the current speaker.
9. `src/components/GameOverScreen.tsx`: Clear display of points awarded this round and updated scoreboard.
10. `src/App.tsx`: Wire multi-category selection, secret word re-peeking, back navigation, and elimination-aware score recording.

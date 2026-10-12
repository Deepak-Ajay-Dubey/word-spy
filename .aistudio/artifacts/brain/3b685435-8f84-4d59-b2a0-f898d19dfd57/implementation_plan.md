# Word Spy: Mr. White 3-Decoy Smoke Screen & 1,000+ Word Library Expansion

A strategic gameplay and content update introducing the **3-Decoy Smoke Screen** for Mr. White and expanding the game's core dictionary to over **1,000+ curated word pairs** organized into clean high-level categories.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed User Decisions**:
> 1. **3-Decoy Smoke Screen for Mr. White**:
>    - Remove artificial turn-order shielding (Mr. White can speak first or in any natural order).
>    - On Mr. White's secret card, present **3 broad themes / categories** (1 is the authentic category of the civilian word, and 2 are decoys).
>    - Displayed as espionage intel on Mr. White's card for bluffing—no mandatory button locks, keeping physical gameplay organic and high-stakes.
> 2. **Library Expansion to 1,000+ Pairs**:
>    - Selected from the 4,350 candidate pairs across 156 categories in the provided library.
>    - Grouped into clean, broad categories in the lobby category picker: **Indian Culture & Life**, **Food & Dining**, **Technology & Media**, **Everyday Home**, **Nature & Wildlife**, **Sports & Recreation**, **Pop Culture & Cinema**, and **Work & Campus**.
> 3. **Strict Zero-Code-Change Instruction**:
>    - No application source code has been altered. All execution is deferred until you review this plan and click "Proceed".

---

## 1. Overview & Core Concept

### A. The 3-Decoy Smoke Screen (Mr. White Overhaul)
- **The Problem Solved**: When Mr. White speaks early or goes first, having zero hints makes survival almost impossible. Conversely, artificially forcing Mr. White to the 3rd speaker position leaks his identity to clever players.
- **The Solution**: 
  - Every player's turn order is completely natural and unrigged.
  - When Mr. White flips his card, he sees an espionage radar:
    ```
    ┌──────────────────────────────────────────────┐
    │              TOP SECRET INTEL                │
    │  Intercepted 3 possible frequency channels:   │
    │  [ A: Indian Snacks ]                        │
    │  [ B: Office Tools  ]                        │
    │  [ C: Space & Astronomy ]                    │
    │                                              │
    │  * Only 1 is active. 2 are decoy channels.   │
    │    Choose your bluff wisely.                 │
    └──────────────────────────────────────────────┘
    ```
  - If Mr. White goes first, he has to gamble on which channel to bluff. If he picks the wrong one, Civilians catch him immediately. If he listens to others first, he can quickly identify the real channel and blend in.
  - Mr. White can also re-check his 3 decoy channels anytime during the discussion round using the discreet **Peek Word** modal.

### B. Massive 1,000+ Word Library Expansion
- Expand `fallbackWords.ts` from 468 pairs to **1,000+ high-quality pairs** using the candidate dictionary.
- Deduplicate pairs and organize micro-categories into 8 clean, vibrant top-level collections for the Category Selector:
  1. 🍛 **Indian Culture & Street Life** (Festivals, Heritage Sites, Regional Snacks, Street Culture, Local Transport)
  2. 🍕 **Food & Dining** (Indian Breads & Sweets, Bakery, Cafe Drinks, Rice Dishes, Cooking Methods, Desserts)
  3. 💻 **Technology & Media** (Social Apps, Digital Content, Gaming Genres, Computer Hardware, Gadgets)
  4. 🏠 **Everyday Home & Life** (Appliances, Furniture, Storage, Personal Care, DIY Tools)
  5. 🌿 **Nature & Wildlife** (Indian Wildlife & Birds, Big Cats, Marine Life, Trees, Weather, Landscapes)
  6. 🏏 **Sports & Games** (Cricket, Athletics, Racket Sports, Traditional Games, Board Games)
  7. 🎬 **Cinema & Pop Culture** (Bollywood/Regional Cinema, Music & Instruments, Slang, Party Games)
  8. 💼 **Work, Campus & Career** (Office Communication, Campus Life, Business Documents, Public Services)

---

## 2. User Experience & Visual Design

### A. Mr. White Card Experience (`RoleRevealScreen.tsx` & `DescribeRoundScreen.tsx`)
- **Visual Identity**: Espionage dossier with retro typewriter styling, amber/crimson alert tones (`#B3261E` / `#B08D57`), and clean unboxed thematic channel tags.
- **Reveal Animation**:
  - The card flips with the same uniform sound and timing as Civilians so screen peering never reveals his identity.
  - The card shows:
    - `"MR. WHITE"` badge with alert icon.
    - Subtitle: `"You have no secret word."`
    - `"Intercepted Signals (1 Real · 2 Decoys)"` panel featuring the 3 randomized themes in high-contrast legible layout.
    - Tactical tip: `"Listen to early clues or take a calculated bluff."`
- **Peek Modal Integration**:
  - In `DescribeRoundScreen.tsx`, when Mr. White holds down the "Peek" button during the clue round, the modal displays the exact same 3 decoy themes, allowing him to verify options mid-game without raising suspicion.

### B. Category Filter in Lobby (`HomeScreen.tsx`)
- Clean, scrollable category selection pills showing clear icons and pair counts (e.g. `Indian Culture (168)`, `Food & Dining (196)`).
- `"All Categories"` quick toggle remains the default, selecting from all 1,000+ pairs seamlessly.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Why | Alternative Considered |
| :--- | :--- | :--- | :--- |
| **Turn Order** | Pure random shuffle (Mr. White can be #1) | Eliminates meta-gaming where players deduce Mr. White because he never goes first. | Keeping Mr. White locked to slot #3+ (rejected: leaks role). |
| **Decoy Interaction** | Passive visual intel briefing on card | Preserves natural verbal party game dynamics; prevents forced screen lag. | Mandatory interactive click to lock in a guess (rejected: adds friction and can reveal role). |
| **Decoy Selection** | 1 real category + 2 distinct random categories | High contrast between channels makes deducing possible from 1-2 words. | 3 sub-categories of the same topic (too ambiguous to bluff). |
| **Library Packaging** | Pre-bundled TypeScript data file | Zero network latency, 100% offline-ready, instant game start. | Dynamic database queries (adds unnecessary latency to mobile games). |

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx & Game State                            │
│  - Active word pair loaded (e.g. Samosa / Kachori -> "Indian Snacks")  │
│  - Decoy themes generated for Mr. White: [Snacks, Space, Tools]        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────────────┐       ┌────────────────────────────────────┐
│      gameLogic.ts State Engine    │       │     wordService.ts & Library       │
│ - Unrestricted turn order shuffle │       │ - 1,000+ curated word pairs        │
│ - Decoy generator:                │       │ - Category taxonomy mapping        │
│   generateDecoyThemes(realCat)    │       │ - Zero-duplicate filter engine     │
└─────────────────┬─────────────────┘       └────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Player Secret Word Interface                         │
│ - Civilian / Undercover: Shows secret word                             │
│ - Mr. White: Shows 3 Decoy Signal Channels (1 Real · 2 Decoys)         │
│ - Peek Modal: Mirrors the 3 Decoys during discussion rounds            │
└────────────────────────────────────────────────────────────────────────┘
```

### Files Targeted for Execution:
1. `src/types.ts`: Extend `Player` type with optional `decoyThemes?: string[]` and update category taxonomies.
2. `src/data/fallbackWords.ts`: Populate with the 1,000+ deduplicated word pairs mapped to high-level parent categories.
3. `src/utils/gameLogic.ts`: 
   - Add `generateDecoyThemes(actualCategory: string): string[]`.
   - Remove index 0 restriction from `generateRoundTurnOrder()`.
4. `src/components/RoleRevealScreen.tsx`: Render the 3-Decoy espionage radar on Mr. White's card.
5. `src/components/DescribeRoundScreen.tsx`: Support displaying the 3 decoy channels in the Peek modal for Mr. White.
6. `src/components/HomeScreen.tsx`: Update category filters to reflect the 8 broad categories with updated counts.

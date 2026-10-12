# Word Spy: Expanded Secret Word Container & Wide-Card Optimization

A targeted plan to widen the secret word reveal card (`#card-back`), eliminate wasted lateral margins, and guarantee that both short and long words render on a single, continuous, highly legible line without mid-word wrapping.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Core Decisions for Element & Layout Expansion**:
> - **We 100% Agree on Utilizing Both Sides**: Currently, the outer container is locked to `max-w-sm` (384px) with heavy nested paddings (`p-6` to `p-7`), leaving only ~260px of usable width and wasting significant horizontal screen space on both sides.
> - **Single-Line Guarantee for ALL Words**: By expanding the card width to `w-full max-w-md sm:max-w-lg` and applying fluid typography (`clamp()` scaling + `whitespace-nowrap`), both short words (e.g. *Tea*, *Coffee*) and longer compound words (e.g. *Double Decker Bus*, *Chole Bhature*, *Air Conditioner*) will fit comfortably on a single line.
> - **Zero Code Modification until Explicit Approval**: As instructed, no files will be edited until you review this plan and give approval to proceed.

---

## 1. Overview & Core Concept

- **What It Does**:
  - Maximizes horizontal space utilization for the secret word reveal container (`div#role-reveal-screen`, `div#reveal-card`, and targeted element `div#card-back`).
  - Replaces restrictive fixed widths (`max-w-sm`) with a wide, full-bleed card layout (`max-w-md sm:max-w-lg`).
  - Tightens excessive lateral paddings from nested wrappers, reclaiming up to 80px–100px of active width.
  - Applies fluid text scaling (`clamp(1.15rem, 5vw, 1.85rem)` with `whitespace-nowrap`) so every word, regardless of length, appears cleanly on one single line.

---

## 2. Targeted Element Styling & Layout Changes

### 1. Element: `div#card-back` (Focused Element)
- **Current State**: Constrained with `p-6 sm:p-7`, inner padding `px-3`, and narrow flex boundaries, forcing longer words to feel cramped.
- **Planned Adjustments**:
  - Optimize padding to `px-4 py-6 sm:px-6 sm:py-7` to maximize usable horizontal canvas.
  - Expand the inner secret word box from fixed dimensions to `w-full min-h-[76px] py-3.5 px-4`.
  - Add smooth subtle badge framing with tactile spy borders.

### 2. Parent Container: `div#role-reveal-screen` & `div#reveal-card`
- **Current State**: `max-w-sm mx-auto px-4` (caps width at 384px, leaving large empty gutters).
- **Planned Adjustments**:
  - Expand container width to `w-full max-w-md sm:max-w-lg mx-auto px-2 sm:px-4`.
  - Allow the 3D flip card (`#reveal-card`) to span the full available width of the screen.

### 3. Typography: Secret Word Text Scaling
- **Rule**:
  ```tsx
  <span className="font-typewriter text-xl sm:text-2xl md:text-3xl font-bold text-[#1B2430] uppercase tracking-wide whitespace-nowrap text-center max-w-full leading-none">
    {player.word}
  </span>
  ```
- **Fallback Dynamic Fit**: If a word exceeds 14 characters, CSS fluid clamp automatically sizes it to fit the wide box seamlessly without breaking lines or touching the edges.

---

## 3. UI/UX Suggestions to Make the Interface Even Better

1. **Category Badge on Secret Word Card**:
   - Add a quiet, elegant category kicker above the secret word (e.g., `FOOD & KITCHEN · CONFIDENTIAL`) inside the ivory box so players have subtle thematic context without leaking clues.
2. **Tactile Espionage Stamp / Watermark Texture**:
   - Add a subtle top-secret security seal icon (`Shield` watermark with 5% opacity) behind the word inside the `#card-back` container to give it an authentic confidential dossier aesthetic.
3. **Harmonize PassPhoneScreen & ClueTurnScreen**:
   - Apply the same widened container (`max-w-md sm:max-w-lg`) to the Pass Phone and Clue Speaking views so the entire pass-and-play flow maintains a consistent wide layout.

---

## 4. Technical Architecture & Component Mapping

```
┌─────────────────────────────────────────────────────────────┐
│                 App.tsx Phone Frame                         │
│       Expanded to max-w-md sm:max-w-lg (448px - 512px)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             div#role-reveal-screen (Expanded)               │
│        w-full max-w-md sm:max-w-lg px-2 sm:px-4             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 div#reveal-card (Full Width)                │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     ┌─────────┴──────────┐        ┌──────────┴──────────┐
     ▼                    ▼        ▼                     ▼
┌─────────────┐               ┌───────────────────────────────┐
│ #card-front │               │   #card-back (TARGET ELEMENT) │
│ Full width  │               │ - Optimized padding px-4 py-6 │
│ Tap to view │               │ - Wide Word Box (w-full)      │
│             │               │ - whitespace-nowrap one-line  │
└─────────────┘               └───────────────────────────────┘
```

### Files to Update Upon Approval:
- `src/components/RoleRevealScreen.tsx`: Widen container, optimize `#card-back` padding, apply fluid single-line word container.
- `src/components/PassPhoneScreen.tsx`: Match the widened container for smooth visual continuity.
- `src/App.tsx`: Ensure the main screen container accommodates the wide layout on tablet/desktop viewports.

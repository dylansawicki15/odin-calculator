# Project: odin-calculator

## About me

- Working through **The Odin Project — Foundations**. This is the Calculator assignment.
- Comfortable enough with JavaScript functions to pass a function as an argument
  (`operate(1, 2, add)`) and explain why `add` has no parentheses there.
- Commits early and often already, in small honest steps. That habit is in place; the
  plan does not need to teach it.

### How this code got here

Self-reported, then probed:

| Part | Author | Status |
| --- | --- | --- |
| `script.js` — the four operators and `operate` | typed by hand | probed and confirmed |
| `index.html` — the markup inside `.calculator` | AI-written | not probed |
| `styles.css` — the CSS Grid layout | AI-written | not probed |
| `styles.css` — the rest (colors, sizing, flex) | mixed / unprobed | not probed |

Reason given for the AI-written parts: *"was too lazy to type that myself."* Typing
seventeen `<button>` tags by hand teaches nothing, so that trade is sound for the HTML.
CSS Grid is different — that is a real concept, and it gets reclaimed.

### Self-assessment worth keeping

On the grid: *"not because I don't understand it, but because I don't have the
understanding of someone who would have written it himself. That's the trade."*

This is the recognition-vs-recall distinction, correctly identified without prompting.
It is evidence of good calibration. It is **not** evidence of knowing CSS Grid — the
grid stays `parked` and earns a reclaim task.

## The idea

A working four-function calculator in the browser. Vanilla HTML, CSS, and JavaScript —
no frameworks, no build step, no package manager. Open `index.html` in a browser and it
runs.

The Odin assignment is the spec. No backlog needed to be invented.

## MVP

### In

Assignment steps 5–7:

1. Digit buttons update a number variable and the display.
2. `=` runs `operate()` on the stored first number, operator, and second number.
3. The seven gotchas:
   - Only ever evaluate **one** pair at a time — `12 + 7 - 1 =` chains to `18`.
   - Round long decimals so they don't overflow the display.
   - `=` pressed early must not break anything.
   - `clear` really wipes all state.
   - Divide by zero shows a snarky message and does not crash.
   - Consecutive operator presses do not evaluate — the last operator wins.
   - A digit pressed after a displayed result starts a new calculation.

Then, as later sections (chosen: *core first, extras after*):

4. Decimal `.` button, disabled when the display already has one.
5. Backspace button.
6. Keyboard support.

### Frozen

Nothing. There are no half-built features to freeze — the project is four files and
about 130 lines, all of it either finished or not yet started.

### Parking lot

- **README.md** is one line (`# odin-calculator`). Fine for now; worth writing properly
  before this goes in a portfolio.
- **Deployment** (GitHub Pages) — not required by the assignment, but this is a static
  site and would be a cheap first taste of shipping.
- **The `0` button** is missing the `digit` class its siblings have. A one-line
  inconsistency that will bite during step 5. Not fixed yet on purpose — it makes a good
  first debugging moment.

## Triage decision: **Adopt**

Reasoning, shown so it can be argued with:

- **The app runs.** It loads and renders correctly. It is *unfinished*, not broken —
  a different thing, and a much better starting position.
- **Nothing to trim.** No abandoned features, no dead code, no dependency sprawl.
- **The AI-written portion is small and bounded** — the button markup and one grid
  layout. That is a reclaim task, not a reason to restart.
- **The hand-written portion is the conceptually hardest part.** `operate` taking a
  function as an argument is a real idea, and it was understood well enough to explain
  on demand.
- **Git already exists** with seven sane commits.

Rebuilding from scratch was never close. Trimming had nothing to trim.

## State at adoption (2026-08-28)

- Branch `main`, 7 commits, HEAD `31711ae`.
- One uncommitted change: `class="digit"` added to buttons 7,8,9,4,5,6,1,2,3 in
  `index.html` — evidence of an in-progress reach toward assignment step 5.
- Assignment steps 1–4 complete. Steps 5–7 not started; no event listeners exist yet.

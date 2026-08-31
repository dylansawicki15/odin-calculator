# File map — odin-calculator

Every file on disk, why it exists, and whether it has been *demonstrated* — not
whether it works. Status comes only from what was explained out loud in
conversation.

**Statuses:** `known` = explained on demand · `parked` = not yet earned, with a
due date · `generated` = machine-made, never hand-edit

This ledger is **parked-heavy on purpose**. Every parked line is a lesson already
scheduled, not a failure. The CSS file is mostly parked because it was mostly
unprobed — absence of evidence, recorded honestly.

Last updated: 2026-08-31 (Section 5, task 5.2)

---

## Root

### `index.html` — the page, and the data source your JS reads
Holds the calculator's structure and, crucially, the CSS classes JavaScript will
use to find things. Split by region because the regions differ in status.

| Region | Status | Why |
| --- | --- | --- |
| `<script defer src="script.js">` (line 7) | `known` | Explained the mechanism *and* predicted that `querySelector` would return `null` if removed. → [[script-loading-defer]] |
| `class="digit"` on 7,8,9,4,5,6,1,2,3 | `known` | Own uncommitted work; explained the plan (listen for clicks, branch on the class). → [[event-delegation]] |
| `<div class="display"></div>` (line 14) | `known` | **Emptied 2026-08-28, own edit.** Was dummy content (`1234.56`); now blank, matching the deliberate blank-on-load decision. Tradeoff identified unprompted: a failed script and an untouched calculator now look the same. → [[textcontent]], [[silent-failure]] |
| The button markup inside `.calculator` | `known` | **Reclaimed 2026-08-28.** Accounted for all seven classes and identified `digit` as the only behaviour hook among six style hooks. Operator buttons since gained `data-op` values (`add`/`subtract`/`multiply`/`divide`) so code never has to read the typographic labels. → [[behavior-vs-style-hooks]], [[data-attributes]], [[unicode-operator-labels]] |
| `<button class="btn digit span-three">0</button>` (line 36) | `known` | **Own edit, uncommitted, found 2026-08-28.** Was missing the `digit` class its nine siblings have. Separately, traced the resulting silent failure correctly in conversation. Timing of the edit relative to that reasoning is unknown and not claimed. → [[silent-failure]] |

### `script.js` — the math, and nothing else
The only file with no DOM code in it. A pure library of four operators plus a
dispatcher, waiting for a caller. This is why nothing has broken yet: it cannot
break until it touches the page.

| Region | Status | Why |
| --- | --- | --- |
| `add` / `subtract` / `multiply` / `divide` | `known` | Hand-written. Parameters renamed to `a`/`b` on 2026-08-28 so they no longer shadow the globals — `add` can no longer be broken into silently returning `0`. → [[function-declarations]], [[scope-and-shadowing]] |
| `operate` (lines 5–7) | `known` | Probed: gave `operate(1, 2, add)` and explained why `add` has no parentheses. → [[first-class-functions]] |
| `display` / `buttons` selections + the delegated click listener | `known` | Agent-written skeleton, learner-written handler body. One listener on `.buttons`; a guard rejects anything without the `digit` class, so gap clicks are ignored. → [[event-delegation]], [[truthiness-and-guards]] |
| `appendDigit(digit)` / `renderDisplay(value)` | `known` | Learner-written, including the split. `appendDigit` concatenates onto `currentInput`; `renderDisplay` writes a passed-in value, mapping `""` to `"0"` so the view never hides a value the state already holds. → [[single-responsibility]], [[dom-as-state]] |
| `let currentInput = ""` (line 4) | `known` | The typing buffer, and the single source of truth for what's been entered. Deliberately a string: digit entry is concatenation, not arithmetic. → [[dom-as-state]], [[string-vs-number-coercion]] |
| `clearAll()` + the four-branch click handler | `known` | Learner-written. Routes digits, `.clear`, `.operator`, `.equals`, each with an early return. The operator branch distinguishes three states: a complete pending pair (evaluate), a fresh first number (capture), and an operator correction (change nothing but the operator). → [[truthiness-and-guards]], [[calculator-state-machine]] |
| `let num / operator / currentInput / showingResult` (lines 1–4) | `known` | Four pieces of state. `showingResult` is the one that can't be derived from the others: `"8"` in `currentInput` means different things depending on whether the user typed it or the calculator produced it. → [[calculator-state-machine]] |
| `operate`'s third parameter, still named `operator` | `known` | **Reclaimed 2026-08-28.** The one remaining shadow, kept knowingly: deleting this parameter throws a loud `TypeError`, unlike the `a`/`b` case which failed silently. → [[scope-and-shadowing]] |
| `getOperation(name)` | `known` | Turns a `data-op` string into the function it names. Shell agent-written after the learner got stuck on `return` scope; all four cases learner-written. → [[operator-string-to-function]], [[return-scope]] |
| `typedNumber()` / `evaluate()` | `known` | Learner-written and both pure. `typedNumber` is the single definition of how typed text becomes a number; `typedNumber` takes **no parameters** — it reads the global `currentInput`, so handing it an argument silently does nothing. `evaluate` is the one place a pending calculation runs, shared by the operator and `=` branches. It **decides only** — returns the number, or `null` when `Number.isFinite` rejects the result — and never renders or mutates. → [[dry-knowledge-duplication]], [[pure-functions]], [[sentinel-return-values]], [[function-arity]] |
| `showError(message)` + `const infinityError` (line 5) | `known` | Learner-written. `showError` resets state via `clearAll` and paints the message; the message lives in one `const` because both call sites need it. Both callers test `result === null` and `return` — a falsy test would misfire on a legitimate `0`, which the learner predicted before it could bite. → [[truthiness-and-guards]], [[sentinel-return-values]] |
| `roundForDisplay(value)` + `const MAX_DECIMALS` (line 6) | `known` | Learner-written. Rounds a result **for painting only** — both call sites wrap the argument to `renderDisplay`, while `num` and `currentInput` keep full precision, so `1 ÷ 3 = × 3 =` still gives `1`. `Number(...)` wraps `toFixed` because `toFixed` returns a string. Deliberately *not* inside `renderDisplay`, which also receives strings. Fixes decimal overflow only — a 16-digit integer result still overflows. → [[rounding-floats]], [[dom-as-state]], [[function-arity]] |

### `styles.css` — presentation, and the largest file here
108 lines. Mostly parked, and that is a statement about evidence, not quality —
almost none of it was probed.

| Region | Status | Why |
| --- | --- | --- |
| `.buttons { display: grid; grid-template-columns: repeat(4, 1fr) }` (51–57) | `known` | **Reclaimed 2026-08-28.** Broke it to `100px` tracks, observed and explained the overflow, then explained implicit row creation. → [[css-grid]], [[flex-axis]] |
| `.equals { grid-row: span 2 }`, `.span-two`, `.span-three` (92–108) | `parked` | The spanning rules that make the layout non-rectangular. Unprobed. **Due:** with the grid reclaim. → [[css-grid]] |
| `* { box-sizing: border-box }` (1–5) | `known` | **Reclaimed 2026-08-28.** Learner's own addition, not inherited. Makes `width` include padding and border, which is what keeps the 400px calculator actually 400px. → [[box-sizing]] |
| `body`, `.container` centering (7–23) | `parked` | Flexbox centering. Unprobed. **Due:** Section 2 reclaim. → [[flexbox-centering]] |
| `.display` flex + `overflow: hidden` (36–49) | `parked` | Right-aligns the number and hides overflow — which is *why* long decimals must be rounded rather than allowed to spill. **Due:** next — task 5.3. → [[flexbox-centering]] |
| `.btn:hover` / `:active`, `.operator`, `.clear`, `.equals` colors (59–100) | `parked` | Pseudo-class states and how later rules override `.btn`. Unprobed. **Due:** low priority — cosmetic, no logic depends on it. → [[css-specificity]] |

### `README.md` — one line
`# odin-calculator`, nothing else. `parked`. **Due:** before this goes in a
portfolio. Not blocking any code. → [[project-documentation]]

---

## Machine-managed

### `.git/` — `generated`
Git's own database: every commit, branch, and object. Never hand-edit; it is
managed entirely through `git` commands. Currently 15 commits on `main`, HEAD
`a2d6b9d`. → [[git-basics]]

### `learning/` — this method's files
`project.md` (triage), `file-map.md` (this file), `knowledge-graph.md` (what is
known and when it was proven), `plan.md` (what gets built next). Written by the
adoption process, read by `/next-lesson`. Not part of the app — but **should be
committed**, so the record of understanding lives with the code.

---

## Not present, and that is the point

Absence is curriculum too. None of these exist, and each is a lesson waiting for
the moment it turns load-bearing:

- **No tests.** Nothing verifies `divide(1, 0)` behaves. → [[automated-testing]]
- **No `package.json`, no build step, no dependencies.** Correct for this project —
  worth understanding as a deliberate choice rather than an accident. → [[static-sites]]
- **No deployment.** This is a static site; publishing it is cheap. → [[deployment]]
- **No event listeners anywhere.** The entire interactive layer is unbuilt. That is
  the plan, not a gap. → [[event-listeners]]

# File map — odin-calculator

Every file on disk, why it exists, and whether it has been *demonstrated* — not
whether it works. Status comes only from what was explained out loud in
conversation.

**Statuses:** `known` = explained on demand · `parked` = not yet earned, with a
due date · `generated` = machine-made, never hand-edit

This ledger is **parked-heavy on purpose**. Every parked line is a lesson already
scheduled, not a failure. The CSS file is mostly parked because it was mostly
unprobed — absence of evidence, recorded honestly.

Last updated: 2026-09-02 (through task 8.5)

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
| `<button class="btn digit point">.</button>` (line 37) | `known` | **Own edit 2026-08-31.** Carries `digit`, so the existing handler appends it with no new code — `appendDigit` concatenates onto a string buffer and is indifferent to the character. `point` is a second hook: **as of 2026-09-01 it is the selection handle** JavaScript uses to reach this button, It never became the styling handle: 6.4 styled `.btn:disabled` instead, because the disabled state lives on the element itself and CSS can match it directly. `.point` still has no CSS rule and may never need one. **Must stay a `<button>` (8.1):** `syncPointButton` sets `point.disabled`, and only a real button honours it — as a `<div>` the property is an inert expando, `3.1.4` becomes typeable, and `evaluate` reports it as `Error: infinity`. Part of this app's validation lives in the element type. → [[behavior-vs-style-hooks]], [[css-grid]], [[html-button-semantics]], [[guards-for-impossible-states]] |
| `<button class="btn backspace">` (line 18) + `.clear` losing `span-two` (line 17) | `known` | **Own edit 2026-09-01.** `Clear` gave up its second column so the full grid had a cell to spare; the button sits between `Clear` and `÷` **in the markup**, because auto-placement follows DOM order and a freed cell left behind stays empty. `backspace` is a behaviour hook with no CSS rule — the click handler will match the class, never the label. Inert as of 7.2: no branch matches it, so **Wired 7.3.** Between the two tasks the hook was briefly changed to `class="operator" data-op="backspace"` to borrow the orange, which routed clicks into the operator branch and made `=` throw a `TypeError`; reverted to a routing class of its own, with the colour taken from CSS instead. Label is `⌫` (U+232B) and no code reads it. → [[css-grid]], [[behavior-vs-style-hooks]], [[data-attributes]], [[silent-failure]] |
| The button markup inside `.calculator` | `known` | **Reclaimed 2026-08-28.** Accounted for all seven classes and identified `digit` as the only behaviour hook among six style hooks. Operator buttons since gained `data-op` values (`add`/`subtract`/`multiply`/`divide`) so code never has to read the typographic labels. → [[behavior-vs-style-hooks]], [[data-attributes]], [[unicode-operator-labels]] |
| `<button class="btn digit span-two">0</button>` (line 36) | `known` | **Own edit, uncommitted, found 2026-08-28.** Was missing the `digit` class its nine siblings have. Separately, traced the resulting silent failure correctly in conversation. Timing of the edit relative to that reasoning is unknown and not claimed. **Narrowed to `span-two` 2026-08-31** to free a column for `.`. → [[silent-failure]] |

### `script.js` — the math, and nothing else
The only file with no DOM code in it. A pure library of four operators plus a
dispatcher, waiting for a caller. This is why nothing has broken yet: it cannot
break until it touches the page.

| Region | Status | Why |
| --- | --- | --- |
| `add` / `subtract` / `multiply` / `divide` | `known` | Hand-written. Parameters renamed to `a`/`b` on 2026-08-28 so they no longer shadow the globals — `add` can no longer be broken into silently returning `0`. → [[function-declarations]], [[scope-and-shadowing]] |
| `operate` (lines 5–7) | `known` | Probed: gave `operate(1, 2, add)` and explained why `add` has no parentheses. → [[first-class-functions]] |
| `display` / `buttons` selections + the delegated click listener | `known` | Agent-written skeleton, learner-written handler body. One listener on `.buttons`; a guard rejects anything without the `digit` class, so gap clicks are ignored. → [[event-delegation]], [[truthiness-and-guards]] |
| `appendDigit(digit)` / `renderDisplay(value)` | `known` | Learner-written, including the split. `appendDigit` concatenates onto `currentInput`, and as of 2026-09-01 carries one guard: a `.` pressed on an empty buffer prefixes `"0"` first, so `currentInput` can never be the non-numeric string `"."`. That guard is why `Number.isFinite` in `evaluate` now only ever rejects `Infinity` — the one case its error message actually names; `renderDisplay` writes a passed-in value, mapping `""` to `"0"` so the view never hides a value the state already holds. → [[single-responsibility]], [[dom-as-state]] |
| `let currentInput = ""` (line 4) | `known` | The typing buffer, and the single source of truth for what's been entered. Deliberately a string: digit entry is concatenation, not arithmetic. → [[dom-as-state]], [[string-vs-number-coercion]] |
| `clearAll()` + the four-branch click handler | `known` | Learner-written. Routes digits, `.clear`, `.operator`, `.equals`, each with an early return. The operator branch distinguishes three states: a complete pending pair (evaluate), a fresh first number (capture), and an operator correction (change nothing but the operator). → [[truthiness-and-guards]], [[calculator-state-machine]] |
| `let num / operator / currentInput / showingResult` (lines 1–4) | `known` | Four pieces of state. `showingResult` is the one that can't be derived from the others: `"8"` in `currentInput` means different things depending on whether the user typed it or the calculator produced it. → [[calculator-state-machine]] |
| `operate`'s third parameter, still named `operator` | `known` | **Reclaimed 2026-08-28.** The one remaining shadow, kept knowingly: deleting this parameter throws a loud `TypeError`, unlike the `a`/`b` case which failed silently. → [[scope-and-shadowing]] |
| `getOperation(name)` | `known` | Turns a `data-op` string into the function it names. Shell agent-written after the learner got stuck on `return` scope; all four cases learner-written. → [[operator-string-to-function]], [[return-scope]] |
| `typedNumber()` / `evaluate()` | `known` | Learner-written and both pure. `typedNumber` is the single definition of how typed text becomes a number; `typedNumber` takes **no parameters** — it reads the global `currentInput`, so handing it an argument silently does nothing. `evaluate` is the one place a pending calculation runs, shared by the operator and `=` branches. It **decides only** — returns the number, or `null` when `Number.isFinite` rejects the result — and never renders or mutates. → [[dry-knowledge-duplication]], [[pure-functions]], [[sentinel-return-values]], [[function-arity]] |
| `showError(message)` + `const infinityError` (line 5) | `known` | Learner-written. `showError` resets state via `clearAll` and paints the message; the message lives in one `const` because both call sites need it. Both callers test `result === null` and `return` — a falsy test would misfire on a legitimate `0`, which the learner predicted before it could bite. → [[truthiness-and-guards]], [[sentinel-return-values]] |
| `roundForDisplay(value)` + `const MAX_DECIMALS` (line 6) | `known` | Learner-written. Rounds a result **for painting only** — both call sites wrap the argument to `renderDisplay`, while `num` and `currentInput` keep full precision, so `1 ÷ 3 = × 3 =` still gives `1`. `Number(...)` wraps `toFixed` because `toFixed` returns a string. Deliberately *not* inside `renderDisplay`, which also receives strings. Fixes decimal overflow only — a 16-digit integer result still overflows. → [[rounding-floats]], [[dom-as-state]], [[function-arity]] |
| `const point` + `syncPointButton()` and its five call sites | `known` | Learner-written. The `.` button's enabled-ness is **derived**, never stored: `point.disabled = !showingResult && currentInput.includes(".")`, recomputed everywhere `currentInput` changes — `appendDigit`, `clearAll`, the `showingResult` reset, the operator branch, and the `=` branch. Order matters at the `=` site: it must run *after* `showingResult = true`, or it reads stale state and leaves the button dead. **Five call sites for one rule is the fragile part** — a single sync at the end of the click handler would be order-proof, but every branch returns early, so it would need restructuring first. → [[derived-state]], [[dom-selection]], [[calculator-state-machine]], [[silent-failure]] |
| the `.backspace` branch of the click handler | `known` | **Learner-written 2026-09-01.** Three lines: `currentInput.slice(0, -1)`, a `syncPointButton()` call, a repaint. `slice(0, -1)` is chosen over length arithmetic because it returns `""` on an empty string rather than throwing, so the branch needs no emptiness guard. The `syncPointButton()` call is the sixth site and was worked out unaided: deleting the `.` out of `3.14` has to re-enable the button. Routing is unambiguous — every button carries exactly one of `digit`/`clear`/`backspace`/`operator`/`equals`, so branch order carries no meaning. **7.4 added `showingResult = false`**: editing the buffer means it is no longer the calculator's answer, so the next digit appends instead of replacing. It sits **above** `syncPointButton()` — below it, the sync reads a stale flag and `1 ÷ 3 =`, `⌫`, `.` produces `0.3.`. → [[derived-state]], [[calculator-state-machine]], [[behavior-vs-style-hooks]] |
| the `keydown` listener on `document` | `known` | **Learner-written 2026-09-01.** On `document` rather than `.buttons` because the container is never focusable; `event.key` rather than the physical-position property so numpad and number-row keys arrive identically. Since 8.3 it drives the calculator: it looks the key up in `keyToButton` and calls `.click()` on the match. Unrecognised keys — every modifier and function key fires one — fall out on the `if (!button) return`. Key repeat on hold is left alone deliberately; repeating digits is what typing should do. **8.4 added six more keys and changed this file not at all** — `script.js` is byte-identical across the whole task, which is the 8.3 design paying off. **8.5 added `event.preventDefault()`**, placed *after* the guard so only handled keys lose their default. A mouse-focused button was being activated natively by `Enter` on top of the synthetic click on `=`, so clicking `7` then pressing `Enter` gave `77`. Suppressing the default also stopped Firefox's `/` quick-find bar opening over the app — a second bug nobody had noticed. **The trade:** this app now owns `Enter` globally, so `Tab`+`Enter` no longer activates the focused button; `Space` still does, because it never matches the `Map` and falls out on the guard with its default intact. **Platform note:** Safari and Firefox-on-macOS do not focus buttons on mouse click, so the original bug is invisible there. → [[keyboard-events]], [[synthetic-click-activation]], [[event-listeners]], [[html-button-semantics]] |
| `keyToButton`, the key → button `Map` | `known` | **Built 8.3.** One entry per `data-key` attribute in the markup, assembled once at load (the script is `defer`red, so the buttons all exist). Exists so that keyboard input reaches the calculator through the *same* click handler the mouse uses — which is what keeps `point.disabled` and the `showingResult` reset working for typed input without a second copy of either rule. → [[map-lookup]], [[data-attributes]], [[dry-knowledge-duplication]] |
| `data-key` on all eighteen buttons | `known` | **Digits and `.` in 8.3, the other seven in 8.4.** The exact string `event.key` reports for the key that reaches that button — its value is dictated by the reader (`keyToButton.get(event.key)`), not by what the button is called. That is the distinction from `data-op`, whose value must be a name `getOperation`'s switch resolves. Six now diverge from the label: `÷`→`/`, `×`→`*`, `−`→`-`, `=`→`Enter`, `Clear`→`Escape`, `⌫`→`Backspace`. **Keeping the glyphs was a decision, 2026-09-02:** matching the three labels that *could* match their keys would re-couple label to input, and `=`/`Clear`/`⌫` can never match theirs, so `data-key` is required either way. `=` is bound to `Enter` alone — one attribute holds one string, so a second key for the same button would mean changing the markup format, not the loop. **Nothing validates this:** two buttons claiming the same key is legal and silent, and the last one in DOM order wins the `Map` entry. → [[data-attributes]], [[unicode-operator-labels]], [[map-lookup]], [[silent-failure]] |

### `styles.css` — presentation, and the largest file here
114 lines. Mostly reclaimed as of 2026-09-01. What stays parked is cosmetic or
not yet load-bearing, and each parked line names the task that comes for it.

| Region | Status | Why |
| --- | --- | --- |
| `.buttons { display: grid; grid-template-columns: repeat(4, 1fr) }` (51–57) | `known` | **Reclaimed 2026-08-28.** Broke it to `100px` tracks, observed and explained the overflow, then explained implicit row creation. → [[css-grid]], [[flex-axis]] |
| `.equals { grid-row: span 2 }`, `.span-two` (98–109) | `known` | **Reclaimed 2026-09-01.** The three rules that make the layout non-rectangular: 17 buttons fill a 4×5 grid because `Clear` and `0` each take two columns and `=` takes two rows. `span 2` is a **size, not a position** — `=` is placed in row 4 col 4 by auto-placement and grows downward, which is why row 5 col 4 is occupied before `0` and `.` are placed. **`.span-three` deleted 2026-09-01** (`af99c7e`) — `0` carried it until 6.1, and nothing has matched it since; found and removed unprompted. → [[css-grid]] |
| `* { box-sizing: border-box }` (1–5) | `known` | **Reclaimed 2026-08-28.** Learner's own addition, not inherited. Makes `width` include padding and border, which is what keeps the 400px calculator actually 400px. → [[box-sizing]] |
| `body`, `.container` centering (7–23) | `parked` | The same three properties reclaimed on `.display`, with `center` instead of `flex-end`. Not probed on these two selectors specifically, so it stays parked — but the concept behind it now sits at `practicing`, so this is a short walk, not a lesson. **Due:** opportunistically, whenever the page layout next changes. → [[flexbox-centering]] |
| `.display` flex + `overflow: hidden` (36–49) | `known` | **Reclaimed 2026-08-31.** Default `flex-direction: row` makes the main axis horizontal, so `justify-content: flex-end` pins the number right and `align-items: flex-end` drops it to the bottom. `overflow: hidden` clips what doesn't fit — off the **left**, because the right edge is pinned, so a too-long number silently shows its tail and hides its head. Removing it changes no layout at all; the digits just paint over the grey. → [[flexbox-centering]], [[flex-axis]], [[overflow-vs-layout]], [[line-breaking-opportunities]] |
| `.btn` + its `:hover` / `:active` / `:disabled` states, `.operator`, `.clear`, `.equals` colors (59–106) | `known` | **Reclaimed 2026-09-01.** `.operator` beats `.btn` on **source order**, not specificity — both score (0,1,0), so position is the only tiebreaker. `.btn:disabled` is the opposite case: a pseudo-class counts at the class level, making it (0,2,0), so it wins wherever it sits. That rule is learner-written. Its placement **after** `:hover` and `:active` is load-bearing — all three tie at (0,2,0), so moving it above `:hover` makes a disabled button light up under the mouse. `cursor: not-allowed` stops `.btn`'s unconditional `cursor: pointer` from lying. **2026-09-01:** `.backspace` joined `.operator` as a **selector list** on both the base and hover rules, so `⌫` gets the orange without the two colour values being written a second time — styling shared, routing class still its own. → [[css-specificity]], [[dry-knowledge-duplication]] |

### `README.md` — one line
`# odin-calculator`, nothing else. `parked`. **Due:** before this goes in a
portfolio. Not blocking any code. → [[project-documentation]]

---

## Machine-managed

### `.git/` — `generated`
Git's own database: every commit, branch, and object. Never hand-edit; it is
managed entirely through `git` commands. On `main`. Commit count and HEAD deliberately not recorded
here — they go stale every commit. → [[git-basics]]

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
- **No input validation outside the click handler.** Every keystroke routes through the
  same handler the mouse uses, so exactly one place decides what a press means. Deliberate,
  and the reason `point.disabled` guards typed input for free.
  → [[synthetic-click-activation]], [[dry-knowledge-duplication]]

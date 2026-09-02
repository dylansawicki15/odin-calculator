# Plan — odin-calculator

Nine sections. Each one ends in something you can open in a browser and show
someone. Each one carries **exactly one reclaim task** — a piece of code you did
not write, or wrote without fully owning, that you take back by explaining it,
breaking it on purpose, predicting the failure, and fixing it.

Every section says where it came from. Nothing here was invented.

Written: 2026-08-28

---

## Decisions this code already made

These were chosen before the plan existed — mostly by The Odin Project's
curriculum, one by omission. All four are the boring, correct choice.

| Decision | What it does for this app | Status |
| --- | --- | --- |
| **Vanilla JavaScript**, no framework | You talk to the browser's API directly. Nothing is hidden behind a library, which is the entire point of Foundations. | Inherited from Odin, understood |
| **No build step, no `package.json`** | Nothing compiles your code — the files you write are the files the browser runs. | **Understood.** Explained on demand: "I just open index.html in the browser." Boundary named: `file://` breaks once ES modules or `fetch()` appear, and then a local server is required. |
| **Plain CSS**, no preprocessor or utility framework | Selectors and properties by hand, in one 108-line file. | Inherited from Odin, understood |
| **CSS Grid** for the keypad | A 4-column grid with two spanning buttons produces the calculator layout. | **Still fuzzy.** Outcome known, mechanism not. Revisited in Section 2's reclaim task. |
| **`0` on load** — reversed from blank | A freshly loaded calculator shows `0`. `renderDisplay` maps `""` to `"0"`; `currentInput` stays `""` so appending still works. | **Decided blank 2026-08-28, reversed the same day.** Reason for the reversal, learner's own: pressing an operator first makes `firstNum` `0`, so a display showing `0` states a value that genuinely exists — the view and the state agree. Side benefit: a blank display now means the script failed to run. |
| **No persistence** — no database, no `localStorage` | Refresh and the calculator forgets everything. Correct: a calculator has no reason to remember. | Decision by omission, named here so it's a choice rather than an accident |

**Automated testing stays out of scope**, deliberately and with a reason. Adding
a test runner would mean npm, Node, and a build step — undoing the "no build
step" decision above for a 130-line project. The assignment's own testing story
is the browser console, and that is what Section 3 uses. `automated-testing`
stays `seed` in the graph and comes due in a later project, not this one.

---

## Section 1 — Make the ground solid

**Deliverable:** the project can never be lost. Git is clean, the app opens
reliably, and the record of what you understand lives alongside the code.

- Commit the uncommitted `digit` classes sitting in `index.html`.
- Commit `learning/` so the map and graph are versioned with the project.
- Establish a known-good baseline you can `git diff` against when something breaks.

**Reclaim task:** the button markup inside `.calculator` — AI-written and never
probed. Account for **every class on every button**, out loud. This is where you
find that `0` is missing the `digit` class its nine siblings have.

*Receipts:* uncommitted change found in `git status`; parked entries in
[file-map.md](file-map.md) for the `.calculator` markup and the `0` button.

### Tasks

- [x] **1.1** Reclaim the button markup — account for every class on every button, find the odd one out, and fix it.
- [x] **1.2** Commit the `digit`-class fix and `learning/`. **No lesson** — your workflow, your message. *(`69f65f6`)*

> **Re-scoped 2026-08-28, at your request.** The original 1.2–1.4 taught the staging
> area, commit-message conventions, and `git diff` recovery. Cut: you have four years
> of professional experience and git is not the gap. Nothing else in the plan changed —
> the CSS reclaim tasks and the Section 3–5 state-machine work stand as written.

---

## Section 2 — Digits reach the screen

**Deliverable:** click `7`, and `7` appears on the display. Click `3`, it becomes
`73`. Click Clear, it empties. Assignment step 5, done.

Concepts: `querySelector` / `querySelectorAll`, `addEventListener`, event
delegation, `textContent`, and clearing the dummy `1234.56` on first press.

**Reclaim task:** **CSS Grid.** Rebuild `.buttons` from a blank block. Then break
it on purpose — change `repeat(4, 1fr)` to `repeat(4, 100px)`, predict what
happens to a 400px calculator, then run it. `fr` divides *leftover* space; that
is the sentence you should be able to say without looking.

*Receipts:* assignment step 5; `css-grid` sits at `introduced` with a partial
model in [knowledge-graph.md](knowledge-graph.md); self-flagged as the least-owned
code in the project.

### Tasks

- [x] **2.1** Reclaim CSS Grid — explain what holds the current layout together, break `1fr` on purpose, predict the failure, restore.
- [x] **2.2** One delegated click listener on `.buttons` that reports which button was clicked.
- [x] **2.3** Digit clicks append to the display, with the dummy `1234.56` cleared on first press.
- [x] **2.4** Clear wipes the display back to a known state.

---

## Section 3 — One operation works

> **Carried in from Section 2:** `clearAll` resets `firstNum` to `0`. Since `0` is a
> number a user can legitimately type, that initial value cannot distinguish "no number
> entered" from "the user typed zero". Harmless if the operator is the state switch (as
> described during the inventory); a bug if anything ever tests `firstNum` for
> truthiness. Decide explicitly when building the state machine.

**Deliverable:** `3 + 5 =` puts `8` on the screen. The hardest section in the
project, and the one the assignment warns you about.

Concepts: the state machine you already described out loud (no operator set →
`firstNum`; operator set → `secondNum`), turning the string `"+"` into the
function `add`, and converting the display's string `"37"` into the number `37`.
Verified in the browser console, which is the assignment's own testing story.

**Reclaim task:** the shadowing in `operate`. Your `operator` **parameter** hides
the `operator` **global** of the same name. Explain which one line 6 uses, then
break it — delete the parameter so the function reaches the global string
instead, predict the exact error, and run it.

*Receipts:* assignment step 6; parked entries in [file-map.md](file-map.md) for
the three globals and for the shadowing; `operator-string-to-function` sits at
`seed`.

### Tasks

- [x] **3.1** Reclaim `operate` — say which `operator` line 7 actually uses, break the shadowing on purpose, predict the error, restore.
- [x] **3.2** Give the operator buttons machine-readable values with `data-` attributes, so `÷` maps to something code can switch on.
- [x] **3.3** Clicking an operator stores the first number and the chosen operator, and starts a fresh input buffer.
- [x] **3.4** `=` converts the strings to numbers, calls `operate`, and renders the result.

---

## Section 4 — Chaining without breaking

**Deliverable:** `12 + 7 - 1 =` shows `18`. Pressing `+` twice in a row does not
evaluate `2 + 2`. Pressing a digit after a result starts fresh instead of
appending.

This is where the third piece of state comes in — the flag that tells "just
pressed `=`" apart from "just chained an operator." You named this gap yourself
during the inventory.

**Reclaim task:** `* { box-sizing: border-box }`, the reset at the top of your
stylesheet. Explain what it changes, then remove it and predict what happens to a
400px calculator holding four 1fr columns with 10px gaps and 20px padding.

*Receipts:* assignment step 7, gotchas 1, 6, and 7; `box-sizing` at `seed`.

### Tasks

- [x] **4.1** Chaining — pressing an operator while one is already pending evaluates the previous pair first, so `12 + 7 -` shows `19`.
- [x] **4.2** Consecutive operators don't evaluate; the last one pressed wins.
- [x] **4.3** A digit pressed after a displayed result starts a new calculation instead of appending.
- [x] **4.4** Reclaim `box-sizing` — explain it, remove it, predict what happens to a 400px calculator.

---

## Section 5 — Refusing to crash

**Deliverable:** divide by zero and get a snarky message instead of `Infinity`.
Press `=` with nothing entered and nothing breaks. Long decimals get rounded
instead of spilling out of the display. Clear really wipes everything.

Concepts: guard clauses, truthiness, and rounding floats.

**Reclaim task:** `.display`'s `overflow: hidden` and its flexbox alignment.
Explain why the display is right-aligned, then remove `overflow: hidden`, type a
number with fifteen decimal places, and watch what happens to the layout. That
mess is *why* the rounding gotcha exists.

*Receipts:* assignment step 7, gotchas 2, 3, 4, and 5; `flexbox-centering` and
`rounding-floats` at `seed`.

### Tasks

- [x] **5.1** Divide by zero shows a snarky message instead of `Infinity`, and the calculator stays usable afterwards.
- [x] **5.2** Long decimals get rounded so they can't overflow the display.
- [x] **5.3** Reclaim `.display` — its flex alignment and `overflow: hidden`, which is *why* rounding is required.

> **Scoped down 2026-08-28.** Two of this section's four gotchas were already satisfied
> by earlier work: `=` pressed early is caught by the `operator === ""` guard (Section 3),
> and `clearAll` resets all four state variables (Sections 2 and 4). Not re-done here.

---

## Section 6 — The decimal point

**Deliverable:** you can type `3.14`. The `.` button goes disabled once the
display already has one, so `12.3.56.5` is impossible.

**Reclaim task:** CSS specificity. A disabled button needs its own look, which
means understanding why `.btn:disabled` beats `.btn` — and why `.operator` already
overrides `.btn`'s background today.

*Receipts:* extra credit item 1; `css-specificity` at `seed`; scope choice made
during triage — *core first, extras after*.

### Tasks

- [x] **6.1** Add the `.` button to the keypad. The grid is full — something has to give up a slot before it can exist.
- [x] **6.2** Clicking `.` appends to the typing buffer, so `3.14 + 1 =` shows `4.14`.
- [x] **6.3** The `.` button disables itself once the current number already has one, and comes back when a new number starts.
- [x] **6.4** Reclaim CSS specificity — give a disabled button its own look, explain why `.btn:disabled` wins over `.btn`, break it on purpose.
- [x] **6.5** A lone `.` with no digits stops reporting the wrong error.

> **6.2 came free with 6.1, 2026-08-31.** The `.` button was given the `digit` class,
> so the existing handler already routes it: `appendDigit` concatenates `textContent`
> onto a string buffer and does not care which character it gets. `3.14 + 1 =` showed
> `4.14` with no JavaScript written. Marked done on the observable, not skipped.
>
> **Not fixed in 6.3, moved to 6.5.** A lone `.` with no digits makes `Number(".")` →
> `NaN`, which `evaluate()` rejects via `Number.isFinite` and reports as `Error: infinity`
> — a real guard firing with the wrong message. Task 6.3 made `3..14` impossible but left
> this untouched, so it gets its own task rather than being quietly dropped.

> **Note on 6.1 and Section 7.** Making room for `.` means changing a spanning rule,
> which is a slice of Section 7's reclaim task. It does not spend it: after `.` lands the
> grid is completely full, so adding backspace forces a real restructure rather than
> borrowing slack. Section 7's reclaim stands as written.

---

## Section 7 — Backspace

**Deliverable:** a backspace button that undoes your last keypress.

**Reclaim task:** the grid's spanning rules — `.equals { grid-row: span 2 }`,
`.span-two`, `.span-three`. Adding a tenth button means the layout has to give up
a slot. You cannot place it without understanding how the spans currently fill
the grid, which makes this the real test of Section 2's reclaim.

*Receipts:* extra credit item 2; parked entry in [file-map.md](file-map.md) for
the spanning rules.

### Tasks

- [x] **7.1** Reclaim the spanning rules — map every cell of the 4-column grid, find the rule that no longer matches anything, break `grid-row: span 2` on purpose and predict where each button lands.
- [x] **7.2** Make room for backspace. The grid is completely full, so a span has to give up a cell before the button can exist.
- [x] **7.3** Backspace deletes the last character from the typing buffer and the display updates.
- [x] **7.4** Backspace survives the awkward states — an empty buffer, and a displayed result that was never typed.

---

## Section 8 — Keyboard support

**Deliverable:** type `12+7=` on your actual keyboard and the calculator responds.

**Reclaim task:** `<button>` semantics. Why the markup uses `<button>` and not
`<div>` — focus, `Enter` and `Space` activation for free, screen-reader support —
and the bug this creates: a focused button that re-fires when you press `Enter`
for `=`.

*Receipts:* extra credit item 3; `html-button-semantics` and `keyboard-events` at
`seed`.

### Tasks

- [x] **8.1** Reclaim `<button>` semantics — say what `<button>` gives you that a `<div>` with a click listener wouldn't, then swap one and find out.
- [x] **8.2** A `keydown` listener reports which key was pressed.
- [x] **8.3** Digits and `.` typed on the keyboard reach the display.

> **Open decision, raised 2026-09-01 during 8.1.** `infinityError` was renamed to
> `defaultErrorMsg` and its text cut from `"Error: infinity"` to `"Error"`, anticipating
> that keyboard input could put a non-numeric string in `currentInput`. That door is not
> open yet: today `Number.isFinite` has exactly one reachable rejection, so the specific
> message is accurate and the generic one discards Section 5's deliverable. **Decide in
> 8.3** whether the keyboard is allowed to open it.
>
> **Settled the same day: reverted to `"Error: infinity"`.** The generic message hedged against
> a failure that cannot currently occur, at the cost of the one that can. 8.3 now carries the
> real question — route keys through the existing machinery and the door stays shut; open it
> deliberately and the honest fix is making `evaluate` report *which* failure, not blurring the
> one it can already name.
>
> **Closed in 8.3.** Keys route through `keyToButton` → `.click()`, so every keystroke enters through
> the click handler that already validates. Nothing can put a non-numeric string in `currentInput`,
> the door stays shut, and `"Error: infinity"` remains accurate.
- [x] **8.4** Operators, Enter, Escape and Backspace all work from the keyboard.
- [ ] **8.5** The focus bug: click a button with the mouse, then press Enter, and it fires again. Find the cause and fix it.

---

## Section 9 — Ship it

**Deliverable:** a live URL you can send to someone, and a README that explains
what they're looking at.

**Reclaim task:** `static-sites` — why "no build step" makes deployment nothing
more than copying files to a web server, and what would have to change if you
ever added one.

*Receipts:* parking lot in [project.md](project.md) — README and deployment were
both logged there during triage.

---

## What this plan is not

- **No task breakdown.** `/next-lesson` breaks down one section at a time, when
  you reach it. Breaking down Section 7 today would be guessing.
- **No invented features.** Every section traces to the assignment you pasted, the
  parking lot, or the file map. Nothing was added because it seemed nice.

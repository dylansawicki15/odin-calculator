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
- [ ] **1.2** Commit that fix. You write the message.
- [ ] **1.3** Commit `learning/` so the record of understanding is versioned with the code.
- [ ] **1.4** Prove the baseline works — break something on purpose, find it with `git diff`, and restore it.

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

---

## Section 3 — One operation works

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

---

## Section 6 — The decimal point

**Deliverable:** you can type `3.14`. The `.` button goes disabled once the
display already has one, so `12.3.56.5` is impossible.

**Reclaim task:** CSS specificity. A disabled button needs its own look, which
means understanding why `.btn:disabled` beats `.btn` — and why `.operator` already
overrides `.btn`'s background today.

*Receipts:* extra credit item 1; `css-specificity` at `seed`; scope choice made
during triage — *core first, extras after*.

---

## Section 7 — Backspace

**Deliverable:** a backspace button that undoes your last keypress.

**Reclaim task:** the grid's spanning rules — `.equals { grid-row: span 2 }`,
`.span-two`, `.span-three`. Adding a tenth button means the layout has to give up
a slot. You cannot place it without understanding how the spans currently fill
the grid, which makes this the real test of Section 2's reclaim.

*Receipts:* extra credit item 2; parked entry in [file-map.md](file-map.md) for
the spanning rules.

---

## Section 8 — Keyboard support

**Deliverable:** type `12+7=` on your actual keyboard and the calculator responds.

**Reclaim task:** `<button>` semantics. Why the markup uses `<button>` and not
`<div>` — focus, `Enter` and `Space` activation for free, screen-reader support —
and the bug this creates: a focused button that re-fires when you press `Enter`
for `=`.

*Receipts:* extra credit item 3; `html-button-semantics` and `keyboard-events` at
`seed`.

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

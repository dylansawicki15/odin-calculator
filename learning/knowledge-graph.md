# Knowledge graph — odin-calculator

What is actually known, and what proved it. Statuses move **only** on something
demonstrated in conversation or visible in the repo — never on self-report,
never on "I read that once."

## The ladder

| Status | Means |
| --- | --- |
| `seed` | Named, on the map, not yet engaged with. The honest default. |
| `introduced` | Reasoned about out loud, correctly. No code written using it yet. |
| `practicing` | Code exists that uses it **and** it can be explained on demand. |
| `understood` | Can write it from a blank file, and can predict how it fails. |

Most of this graph is `seed`. That is what an honest graph looks like on day one.

Seeded: 2026-08-28

---

## JavaScript — language

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `function-declarations` | `practicing` | — | Wrote `add`/`subtract`/`multiply`/`divide` by hand, four functions with a consistent shape. | 2026-08-28 |
| `first-class-functions` | `practicing` | `function-declarations` | Probed: produced `operate(1, 2, add)` unprompted and explained that `add` without parentheses is the function itself, not its result. | 2026-08-28 |
| `scope-and-shadowing` | `seed` | `function-declarations` | Named in conversation (the `operator` parameter hides the `operator` global) but not engaged with. Comes due in Section 3. | — |
| `string-vs-number-coercion` | `introduced` | `textcontent` | Wrote `firstNum += digit` (number `0` plus a string) during 2.3, then debugged their way to a string accumulator (`currentInput`). Reached the right answer; the coercion rule itself was never stated aloud, so this stays `introduced`. | 2026-08-28 |
| `truthiness-and-guards` | `practicing` | `calculator-state-machine` | Wrote the first guard clause after being given the shape. Later restructured the handler unaided into two positive branches with an early return, and wrote `clearAll` resetting all four state variables in one place — proposing that design himself when asked how to avoid forgetting a variable later. | 2026-08-28 |
| `rounding-floats` | `seed` | `calculator-state-machine` | `0.1 + 0.2` and long decimals overflowing a fixed-width display. | — |

## JavaScript — the browser (DOM)

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `script-loading-defer` | `practicing` | — | Probed: explained that `defer` waits for the HTML, then correctly predicted that without it `document.querySelector` runs before `<body>` exists. Given the precision that it returns `null` rather than throwing. | 2026-08-28 |
| `dom-selection` | `introduced` | `script-loading-defer` | Reasoned about `document.querySelector(".display")` and what it returns when the element isn't there yet. The two `querySelector` lines now in `script.js` were agent-written, so this stays `introduced` — no selection code authored yet. | 2026-08-28 |
| `textcontent` | `practicing` | `dom-selection` | Explained the append-and-clear plan in conversation, then wrote `console.log(event.target.textContent)` and confirmed it printed `7`. | 2026-08-28 |
| `event-listeners` | `practicing` | `dom-selection` | The `addEventListener` call and the two `querySelector` lines were agent-written; the handler body is the learner's. Verified in the browser: clicking `7` logged `7`. | 2026-08-28 |
| `event-delegation` | `practicing` | `event-listeners` | Predicted correctly that a click in the 10px `gap` reports `.buttons` as `event.target`, reasoning that gaps belong to the container. Then wrote the guard `if (!event.target.matches(".digit")) return;` and confirmed gap clicks log nothing. | 2026-08-28 |
| `keyboard-events` | `seed` | `event-listeners` | Extra credit. Not discussed. | — |
| `behavior-vs-style-hooks` | `introduced` | `event-delegation` | Searched the stylesheet and found that `digit` is the only class with no CSS rule, then explained why it's there anyway: a hook for JavaScript to find buttons, not a way to style them. | 2026-08-28 |
| `data-attributes` | `seed` | `behavior-vs-style-hooks` | Named as the professional alternative to a JS-only class. Now has a concrete forcing reason (see `unicode-operator-labels`). **Due:** Section 3. | — |
| `unicode-operator-labels` | `seed` | `textcontent` | Verified by inspecting the file: `÷` is U+00F7, `×` is U+00D7, `−` is U+2212 — none are `/`, `*`, `-`. Digits are plain ASCII, so `textContent` is safe for them and unsafe for operators. Told, not yet demonstrated. | — |
| `silent-failure` | `practicing` | `event-delegation` | Traced the missing-`digit` bug precisely: listener fires, class check rejects, nothing happens, no error. **Retrieved again later in a new context**: after removing the dummy from the HTML, identified unprompted that "js failed to load" and "nothing has been typed yet" now look identical. | 2026-08-28 |

## The application logic

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `calculator-state-machine` | `introduced` | `event-listeners`, `first-class-functions` | Stated the routing rule correctly and unprompted: no operator set → the digit belongs to `firstNum`; operator set, `=` not yet pressed → `secondNum`. No code implements it. The gap named: telling "just pressed `=`" apart from "just chained an operator" needs a third piece of state. | 2026-08-28 |
| `dom-as-state` | `practicing` | `textcontent` | Asked what breaks if the display is the source of truth once rounding is added: answered "you'd read back the rounded number, so the error compounds." Then built it the other way — `currentInput` holds the string, the DOM renders it. | 2026-08-28 |
| `single-responsibility` | `practicing` | — | Diagnosed the smell unaided: `updateDisplay("")` needed a fake argument because the function "is doing two things, appending and rendering." Then split it into a mutator and a renderer, making the renderer take its value as a parameter rather than reading the global. | 2026-08-28 |
| `operator-string-to-function` | `seed` | `first-class-functions`, `calculator-state-machine` | The crux of assignment step 6: a button hands over `"+"`, `operate` wants `add`. Named, not solved. | — |

## CSS

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `css-grid` | `practicing` | `box-sizing` | **Reclaimed 2026-08-28.** Broke `repeat(4, 1fr)` → `repeat(4, 100px)`, observed the 70px overflow past the container, and described it accurately without help. Then explained implicit row creation unprompted: grid manufactures rows as auto-placement runs out of columns. Started the session with outcome-without-mechanism; ended with the mechanism. | 2026-08-28 |
| `flex-axis` | `introduced` | — | **Wrong prediction, corrected.** Expected `flex: 1` on `.buttons` to widen `.calculator`. It doesn't: `.calculator` is `flex-direction: column`, so `flex: 1` grows height only, and a flex item never resizes its parent. Not yet re-tested. | 2026-08-28 |
| `box-sizing` | `seed` | — | `* { box-sizing: border-box }` sits at the top of the stylesheet, unprobed. | — |
| `flexbox-centering` | `seed` | — | Used in `body`, `.container`, and `.display`. Unprobed. | — |
| `css-specificity` | `seed` | — | `.operator` and `.clear` override `.btn`; `:hover`/`:active` layer on top. Unprobed, cosmetic. | — |
| `html-button-semantics` | `seed` | — | Why `<button>` and not `<div>` — focusability, keyboard activation. Becomes load-bearing at the keyboard-support stage. | — |

## Engineering practice

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `git-basics` | `out-of-scope` | — | Repo evidence: 7 commits, each small and scoped, with honest messages. Beyond that, **not assessed** — declined probing, citing ~4 years of professional experience. Recorded as out of scope rather than promoted on self-report, which would be a false evidence entry either way. | 2026-08-28 |
| `git-commit-messages` | `out-of-scope` | `git-basics` | Cut with the rest of Section 1's git content at the learner's request. | 2026-08-28 |
| `static-sites` | `introduced` | — | Explained on demand how the app runs: "I just open index.html in the browser." Given the boundary — `file://` breaks once ES modules or `fetch()` appear, and a local server is needed. | 2026-08-28 |
| `automated-testing` | `seed` | `function-declarations` | **Absent from the project.** Nothing verifies `divide(1, 0)`. Absence is curriculum. | — |
| `deployment` | `seed` | `static-sites` | **Absent from the project.** A static site is the cheapest possible first deploy. | — |
| `project-documentation` | `seed` | — | **Absent.** `README.md` is one line. | — |

---

## Summary at seeding

| Status | Count |
| --- | --- |
| `practicing` | 11 |
| `introduced` | 6 |
| `seed` | 13 |
| `out-of-scope` | 2 |

Nothing sits at `understood` yet, and nothing should — that status means writing
it from a blank file and predicting its failure modes, which no probe in a single
conversation can prove.

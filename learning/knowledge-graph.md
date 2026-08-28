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
| `string-vs-number-coercion` | `seed` | `textcontent` | Flagged as a coming problem: `textContent += "7"` builds a string, `add()` needs a number. Not yet reasoned about. | — |
| `truthiness-and-guards` | `seed` | `calculator-state-machine` | Needed for divide-by-zero and for `=` pressed too early. | — |
| `rounding-floats` | `seed` | `calculator-state-machine` | `0.1 + 0.2` and long decimals overflowing a fixed-width display. | — |

## JavaScript — the browser (DOM)

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `script-loading-defer` | `practicing` | — | Probed: explained that `defer` waits for the HTML, then correctly predicted that without it `document.querySelector` runs before `<body>` exists. Given the precision that it returns `null` rather than throwing. | 2026-08-28 |
| `dom-selection` | `introduced` | `script-loading-defer` | Reasoned about `document.querySelector(".display")` and what it returns when the element isn't there yet. No selection code written. | 2026-08-28 |
| `textcontent` | `introduced` | `dom-selection` | Explained setting `.textContent = 7`, appending with `+=`, and — unprompted — that the dummy `1234.56` must be cleared first. No code written. | 2026-08-28 |
| `event-listeners` | `introduced` | `dom-selection` | Described attaching a click listener to the buttons as the plan behind the uncommitted `digit` classes. Nothing wired up yet. | 2026-08-28 |
| `event-delegation` | `introduced` | `event-listeners` | Arrived at the shape independently — "*if it contained digit*" — without knowing the name. Later used the term unprompted and traced a click through both levels: the container listener fires, the `if` check is what rejects it. Still no code written. | 2026-08-28 |
| `keyboard-events` | `seed` | `event-listeners` | Extra credit. Not discussed. | — |
| `behavior-vs-style-hooks` | `introduced` | `event-delegation` | Searched the stylesheet and found that `digit` is the only class with no CSS rule, then explained why it's there anyway: a hook for JavaScript to find buttons, not a way to style them. | 2026-08-28 |
| `data-attributes` | `seed` | `behavior-vs-style-hooks` | Named as the professional alternative to a JS-only class (`data-digit="7"`, immune to being deleted as dead CSS). Explicitly parked — comes due in Section 2. | — |
| `silent-failure` | `introduced` | `event-delegation` | Traced the missing-`digit` bug precisely: the listener still fires, the class check rejects it, nothing happens and no error appears. Contrasted against a `TypeError`, which at least points at a line. | 2026-08-28 |

## The application logic

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `calculator-state-machine` | `introduced` | `event-listeners`, `first-class-functions` | Stated the routing rule correctly and unprompted: no operator set → the digit belongs to `firstNum`; operator set, `=` not yet pressed → `secondNum`. No code implements it. The gap named: telling "just pressed `=`" apart from "just chained an operator" needs a third piece of state. | 2026-08-28 |
| `operator-string-to-function` | `seed` | `first-class-functions`, `calculator-state-machine` | The crux of assignment step 6: a button hands over `"+"`, `operate` wants `add`. Named, not solved. | — |

## CSS

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `css-grid` | `introduced` | `box-sizing` | Probed: got the outcome (`repeat(4, 1fr)` → four equal columns) but not the mechanism (`fr` splits *leftover* space after fixed sizes). Self-identified as the least-owned code in the project — "I don't have the understanding of someone who would have written it himself." | 2026-08-28 |
| `box-sizing` | `seed` | — | `* { box-sizing: border-box }` sits at the top of the stylesheet, unprobed. | — |
| `flexbox-centering` | `seed` | — | Used in `body`, `.container`, and `.display`. Unprobed. | — |
| `css-specificity` | `seed` | — | `.operator` and `.clear` override `.btn`; `:hover`/`:active` layer on top. Unprobed, cosmetic. | — |
| `html-button-semantics` | `seed` | — | Why `<button>` and not `<div>` — focusability, keyboard activation. Becomes load-bearing at the keyboard-support stage. | — |

## Engineering practice

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `git-basics` | `practicing` | — | Visible in the repo, not self-reported: 7 commits, each one small and scoped to a single change, with honest messages. The habit is already in place. | 2026-08-28 |
| `git-commit-messages` | `introduced` | `git-basics` | Messages are honest and readable but informal ("nvm this is the fixed css to get rid of the ."). The Odin Commit Messages lesson is the reference. | 2026-08-28 |
| `static-sites` | `introduced` | — | Explained on demand how the app runs: "I just open index.html in the browser." Given the boundary — `file://` breaks once ES modules or `fetch()` appear, and a local server is needed. | 2026-08-28 |
| `automated-testing` | `seed` | `function-declarations` | **Absent from the project.** Nothing verifies `divide(1, 0)`. Absence is curriculum. | — |
| `deployment` | `seed` | `static-sites` | **Absent from the project.** A static site is the cheapest possible first deploy. | — |
| `project-documentation` | `seed` | — | **Absent.** `README.md` is one line. | — |

---

## Summary at seeding

| Status | Count |
| --- | --- |
| `practicing` | 4 |
| `introduced` | 10 |
| `seed` | 12 |
| `understood` | 0 |

Nothing sits at `understood` yet, and nothing should — that status means writing
it from a blank file and predicting its failure modes, which no probe in a single
conversation can prove.

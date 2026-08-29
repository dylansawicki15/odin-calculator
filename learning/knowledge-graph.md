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
| `first-class-functions` | `practicing` | `function-declarations` | Probed: produced `operate(1, 2, add)` unprompted and explained that `add` without parentheses is the function itself. Later returned functions out of a `switch` and passed the result through `operate` in live code. | 2026-08-28 |
| `scope-and-shadowing` | `practicing` | `function-declarations` | Named which binding line 7 resolves to and why. Predicted the `TypeError` from deleting `operate`'s third parameter, then predicted the worse case unprompted: `add` with its parameters deleted returns `0` silently. Renamed the parameters to `a`/`b` across all five functions to remove the shadow. | 2026-08-28 |
| `string-vs-number-coercion` | `practicing` | `textcontent` | Traced an uncorrected `firstNum = currentInput` by hand and predicted **both** outcomes correctly: `3 + 5` gives `"35"`, `3 - 5` gives `-2`. Then applied `Number(currentInput)`. Earlier hit the same class of bug with `firstNum += digit` and debugged out of it. | 2026-08-28 |
| `return-scope` | `introduced` | `function-declarations` | Wrote a `switch` with `return add;` directly inside the click handler, which returned the function to the browser and discarded it. The rule — `return` exits the function it is written inside, so a lookup needs its own function — was explained rather than derived. Applied correctly afterwards. | 2026-08-28 |
| `truthiness-and-guards` | `practicing` | `calculator-state-machine` | `practicing` | `event-listeners`, `first-class-functions` | Stated the routing rule correctly during the inventory, then built the first half of it: the operator branch captures `firstNum`, records `operator`, and resets the buffer. Verified in the console — `firstNum = 6`, `operator = "add"`. The `=` half and the chaining rule are still unbuilt. | 2026-08-28 |
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
| `behavior-vs-style-hooks` | `practicing` | `event-delegation` | Found that `digit` is the only class with no CSS rule and explained why it exists anyway. Later added a second kind of hook — `data-op` — separating the machine-readable value from both the styling classes and the human-readable label. | 2026-08-28 |
| `data-attributes` | `practicing` | `behavior-vs-style-hooks` | Explained the read side unprompted (`element.dataset.op`), then added `data-op` to all four operator buttons with values matching the function names — `divide`, `multiply`, `subtract`, `add`. | 2026-08-28 |
| `unicode-operator-labels` | `introduced` | `textcontent` | Verified by inspection: `÷` is U+00F7, `×` is U+00D7, `−` is U+2212 — none match `/`, `*`, `-`. Applied the mitigation (`data-op`) without needing the reason restated, but never re-derived the problem independently. | 2026-08-28 |
| `silent-failure` | `practicing` | `event-delegation` | Traced the missing-`digit` bug precisely: listener fires, class check rejects, nothing happens, no error. **Retrieved again later in a new context**: after removing the dummy from the HTML, identified unprompted that "js failed to load" and "nothing has been typed yet" now look identical. Third retrieval: identified that `add` stripped of its parameters would return `0` with no error at all, in contrast to `operate`'s loud `TypeError`. | 2026-08-28 |

## The application logic

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `calculator-state-machine` | `introduced` | `event-listeners`, `first-class-functions` | Stated the routing rule correctly and unprompted: no operator set → the digit belongs to `firstNum`; operator set, `=` not yet pressed → `secondNum`. No code implements it. The gap named: telling "just pressed `=`" apart from "just chained an operator" needs a third piece of state. | 2026-08-28 |
| `dom-as-state` | `practicing` | `textcontent` | Asked what breaks if the display is the source of truth once rounding is added: answered "you'd read back the rounded number, so the error compounds." Then built it the other way — `currentInput` holds the string, the DOM renders it. | 2026-08-28 |
| `single-responsibility` | `practicing` | — | Diagnosed the `updateDisplay("")` smell unaided — the function "is doing two things" — and split it. Later applied the same fix to a variable rather than a function: `operator` was holding both the chosen operation's *name* and the *function*, so a second `=` crashed; separated into `operator` and a local `operation`. | 2026-08-28 |
| `operator-string-to-function` | `practicing` | `first-class-functions`, `calculator-state-machine` | Sketched the `switch` shape unprompted in 3.2, wrote all four cases himself. Got stuck on where `return` sends its value — the wrapper-function shape was agent-supplied after that. Then fixed the follow-on bug: `operator` was being reassigned to hold the looked-up function, breaking a second `=` press. | 2026-08-28 |

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
| `practicing` | 16 |
| `introduced` | 6 |
| `seed` | 9 |
| `out-of-scope` | 2 |

Nothing sits at `understood` yet, and nothing should — that status means writing
it from a blank file and predicting its failure modes, which no probe in a single
conversation can prove.

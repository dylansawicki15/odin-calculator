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
| `string-vs-number-coercion` | `practicing` | `textcontent` | Predicted both outcomes correctly from a hand trace (`3 + 5` → `"35"`, `3 - 5` → `-2`). **But has written this bug three times in three different syntactic positions** — `firstNum += digit`, `firstNum = currentInput`, `operate(num, currentInput, …)` — and on the third reached for `Number(evaluate())`, patching the output rather than the input. **2026-08-31, a near-fourth:** proposed returning the error *message string* out of `evaluate()`, which would have put a string in `num` and concatenated it onto the next operand. Moved off it to `0` on his own before the consequence was demonstrated — a different design instinct, not coercion reasoning. Recognition is solid; converting at the boundary is not yet automatic. | 2026-08-31 |
| `return-scope` | `introduced` | `function-declarations` | Wrote a `switch` with `return add;` directly inside the click handler, which returned the function to the browser and discarded it. The rule — `return` exits the function it is written inside, so a lookup needs its own function — was explained rather than derived. Applied correctly afterwards. | 2026-08-28 |
| `dry-knowledge-duplication` | `introduced` | `single-responsibility` | Reached for "probably make it into a helper function" unprompted when the `=` and operator branches needed the same three lines, and extracted `evaluate()`. Took `typedNumber()` after the rule — deduplicate *knowledge*, not characters — was explained rather than derived. **2026-08-31:** hoisted the error message to a single `const infinityError` once the two-call-site duplication was flagged; did not spot it independently. | 2026-08-31 |
| `pure-functions` | `practicing` | `function-declarations` | Wrote `evaluate()` and `renderDisplay(value)` as functions that read inputs and return or render without mutating. Explained on demand why calling `evaluate()` twice in a row was safe: "evaluate doesn't mutate anything." **2026-08-31:** briefly gave `evaluate()` side effects — it called `showError`, which wiped state and painted the screen — and restored it to decide-only after the contradiction with his own earlier explanation was pointed out. The final `evaluate()` is pure and was written unaided. | 2026-08-31 |
| `truthiness-and-guards` | `practicing` | `event-delegation` | Wrote the `.digit` class guard and the four early-return branches of the click handler. **2026-08-31:** reached for `if (!result)` as the no-answer test, then predicted unaided what that does to a legitimate `0 ÷ 5 =` — "it would show the error message since 0 is falsy" — and replaced it with `result === null`. Separately needed telling that `showError(...)` is an ordinary function call and not control flow: both call sites invoked it and then fell straight through to overwrite the message. | 2026-08-31 |
| `sentinel-return-values` | `practicing` | `truthiness-and-guards` | **Introduced 2026-08-31.** Needed the requirement supplied — the "no answer" value must sit outside the space of real answers, so it cannot be a number — after proposing the message string and then `0`, and tracing each correctly when asked. `null` itself was agent-named. Then wrote `evaluate()`'s `return null` and both `result === null` guards unaided, and demonstrated the underlying point without prompting by predicting that a falsy check would misfire on `0 ÷ 5 =`. | 2026-08-31 |
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
| `calculator-state-machine` | `practicing` | `event-listeners`, `first-class-functions` | Stated the routing rule during the inventory, then built it. Derived the chaining condition unaided — `operator !== "" && currentInput !== ""` — and worked out that the evaluation belongs in the operator branch, not `=`, after checking whether `=` ever runs on `12 + 7 -`. Collapsed `firstNum`/`secondNum` into a single `num`, correctly seeing that the second operand is always just what's typed. Diagnosed the consecutive-operator bug unaided (`num` wiped to `0` by `Number("")`), though needed the three-case breakdown spelled out before seeing that two branches were hiding three states. Identified unaided that after `=` the result existed only on screen and nowhere in state, and named both fixes (`currentInput` holds the result; `operator` clears). Needed the `showingResult` flag broken down into its four touch-points before writing it. | 2026-08-28 |
| `dom-as-state` | `practicing` | `textcontent` | Answered what breaks if the display is the source of truth once rounding lands: "you'd read back the rounded number, so the error compounds." Built it the other way. Later hit the mirror-image bug — updated `num` on chaining without rendering, so the state was right and the screen was stale. | 2026-08-28 |
| `single-responsibility` | `practicing` | — | Diagnosed the `updateDisplay("")` smell unaided — the function "is doing two things" — and split it. Later applied the same fix to a variable rather than a function: `operator` was holding both the chosen operation's *name* and the *function*, so a second `=` crashed; separated into `operator` and a local `operation`. | 2026-08-28 |
| `operator-string-to-function` | `practicing` | `first-class-functions`, `calculator-state-machine` | Sketched the `switch` shape unprompted in 3.2, wrote all four cases himself. Got stuck on where `return` sends its value — the wrapper-function shape was agent-supplied after that. Then fixed the follow-on bug: `operator` was being reassigned to hold the looked-up function, breaking a second `=` press. | 2026-08-28 |

## CSS

| Concept | Status | Depends on | Evidence | Date |
| --- | --- | --- | --- | --- |
| `css-grid` | `practicing` | — | **Reclaimed 2026-08-28.** Rebuilt the model out loud, then broke `repeat(4, 1fr)` to `repeat(4, 100px)`. Predicted `.calculator` would widen; it did not — the buttons overflowed `.buttons` instead, which is what actually happened and what got explained. Also explained implicit row creation: grid wraps every four items onto a new row without those rows being declared. | 2026-08-28 |
| `flex-axis` | `introduced` | — | **Wrong prediction, corrected.** Expected `flex: 1` on `.buttons` to widen `.calculator`. It doesn't: `.calculator` is `flex-direction: column`, so `flex: 1` grows height only, and a flex item never resizes its parent. Not yet re-tested. | 2026-08-28 |
| `box-sizing` | `practicing` | — | **Reclaimed 2026-08-28.** Explained the model unprompted and completely — padding counts inside the declared width, so `400px` with `20px` padding leaves `360px` of content — including the rationale ("so you don't have to do weird calculations in your head"). Then derived the `content-box` rendering exactly — 440 × 640 — from the model alone, without running the experiment. Learner's own addition to the stylesheet, not inherited. | 2026-08-28 |
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

## Summary (recomputed 2026-08-31)

| Status | Count |
| --- | --- |
| `practicing` | 20 |
| `introduced` | 6 |
| `seed` | 8 |
| `out-of-scope` | 2 |

Nothing sits at `understood` yet, and nothing should — that status means writing
it from a blank file and predicting its failure modes, which no probe in a single
conversation can prove.

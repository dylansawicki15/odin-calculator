# Calculator

A four-function calculator that runs in the browser — digits, `+ - x /`, a decimal
point, backspace, clear, and full keyboard support. Built as the final project of
[The Odin Project's Foundations course](https://www.theodinproject.com/lessons/foundations-calculator),
so it is a learning project: no framework, no dependencies, every line written by
hand. Three files — `index.html`, `styles.css`, `script.js`.

## Running it

Clone or download the repo and open `index.html` in a browser. That is the whole
procedure: nothing to install, nothing to build.

That works because this page never triggers a cross-origin check — the script is a
plain `<script defer>` rather than an ES module, and nothing fetches anything at
runtime. Change either of those and opening the file directly stops working; it
then has to be served over `http://`. So it is not that HTML, CSS and JavaScript
never need a server. It is that *this* page doesn't.

## Decisions

Behaviour a reader would otherwise file as a bug.

- **No operator precedence — it evaluates strictly left to right, one pair at a
  time.** `2 + 3 x 4 =` gives `20`, not `14`. Only one pending operation is ever
  held, which is also how a cheap physical calculator behaves.

- **Results round to two decimals on screen, but the full value carries into the
  next calculation.** `1 / 3 =` shows `0.33`; press `x 3 =` and you get `1`, not
  `0.99`. Rounding is a display concern, so it happens on the way to the screen and
  never touches the stored number.

- **Dividing by zero shows `Error: infinity` and clears everything.** JavaScript
  treats `Infinity` as a perfectly good number, so nothing crashes by itself. The
  result is checked before it is displayed, and an unusable state is wiped rather
  than carried into the next calculation.

- **`Enter` always means `=`, even when a button has keyboard focus.** Clicking a
  button leaves it focused in some browsers, so `Enter` would otherwise fire both
  `=` and that button. The keyboard handler suppresses the browser's default
  action, which costs the usual `Tab` + `Enter` activation — `Space` still does it.

---
name: equation-exercise
description: Turn a pasted equation/placeholder sample (e.g. "24 + [ ][ ] + [ ] = ...") into a working digit-box exercise, reusing the shared equation + tab framework — use after /new-activity when the user describes a new exercise via bracket notation instead of writing the logic themselves.
---

# equation-exercise

Translates the shorthand the user pastes for a new exercise into working `generate` / `render` /
`checkAnswer` code, using the shared framework in `assets/css/main.css` and `assets/js/main.js`.
`/new-activity` scaffolds the folder/boilerplate; this skill is what fills in the actual exercise
once the user has described it. Read `CLAUDE.md` first if you haven't already.

**Reference implementation**: `activities/four-operations/` is the canonical worked example —
decomposition equations for +/-, single-step fact checks for ×/÷, and the tab switcher for
multiple modes on one page. Copy its shape for new samples rather than inventing a new layout.

## Reading the notation

When the user pastes a sample like:

```
24 + 25
  =
24 + [ ][ ] + [ ]
  =
[ ][ ] + [ ]
  =
[ ][ ]
== SOLUTION sample
24 + 25
=
24 + 20 + 5
=
44 + 5
=
49
```

- A plain number (`24`, `25`) is a **given** value — shown, never edited.
- `[ ]` is a **one-digit input box** the learner fills in.
- Stacked lines joined by `=` are the **steps** revealed to the learner, top to bottom.
- The `== SOLUTION sample ==` block is worked with *specific* numbers — use it to pin down the
  exact arithmetic relationship between steps (which digits repeat, which are derived), not just
  the box layout. Don't guess the relationship from the blank template alone.

## Shared building blocks (check before adding anything new)

CSS (`assets/css/main.css`):
- `.digit-input` / `.is-readonly` / `.is-valid` / `.is-invalid` — one-digit boxes, auto-styled by
  `MathFramework.validateFields`.
- `.equation` / `.equation-row` / `.operand` — stacked equation layout; `.operand` is a plain
  (non-boxed) number for values that are shown whole and never decomposed digit-by-digit (see the
  ×/÷ panels in four-operations).
- `.op-tabs` / `.op-tab` / `.is-active` / `.is-hidden` — tab switcher for exercises with multiple
  modes (operations, levels, ...) on one page.

JS (`assets/js/main.js`, namespace `MathFramework`):
- `setupDigitInputs(container)` — auto-advance/backspace/digits-only for editable boxes.
- `clearInputs(container)` — resets editable boxes before a new problem.
- `validateFields([{ el, expected }, ...])` — compares, toggles `.is-valid`/`.is-invalid`, returns
  overall correctness.
- `setFeedback(el, success, message)` — writes the feedback line/class.
- `randInt(min, max)`.
- `setRole(container, role, value)` / `getField(container, name)` — look up `[data-role]` (givens
  to fill) and `[data-field]` (editable inputs to validate) by name.
- `setupTabs(tabButtons, panels, onActivate)` — wires `.op-tab` clicks to show/hide same-keyed
  panels and calls `onActivate(op)`; call the returned `activate(initialOp)` once at load.

Most new exercises should need **zero** new shared CSS/JS — these cover the whole digit-box
pattern. Only add to `main.css`/`main.js` when a genuinely new shape recurs, per CLAUDE.md.

## Steps

1. If the activity folder doesn't exist yet, run `/new-activity` first for the boilerplate.
2. Parse the sample into rows; for each token decide: given digit (readonly `.digit-input`),
   given whole number never decomposed (`.operand`), or learner input (editable `.digit-input`).
3. Tag every slot: `data-role="<name>"` for anything filled by `setRole` (givens/derived-but-fixed
   values), `data-field="<name>"` for anything checked by `validateFields`. Name by *meaning*
   (`add-decomp-tens`), not position, since `render`/`checkAnswer` look these up by name.
4. Write `generate<Case>()`: do the arithmetic once, return a plain object exposing every digit
   needed by both rendering and validation (don't recompute in two places).
5. Write `render<Case>(panel, problem)` using `MathFramework.setRole` for every `data-role` slot.
6. In `checkAnswer`, build `{ el: MathFramework.getField(panel, name), expected }` for every
   `data-field`, then `MathFramework.validateFields(fields)` + `MathFramework.setFeedback`.
7. Multiple modes in one sample set (operations, levels, ...) → wire `.op-tabs` +
   `MathFramework.setupTabs` like four-operations. Single mode → skip tabs entirely.
8. Number ranges/constraints the sample doesn't spell out (e.g. avoiding a trivial decomposition,
   capping sums so results stay two-digit): pick a default consistent with what the child already
   knows, implement it, and call out the choice for review rather than blocking on asking first.
9. **Verify without a browser** (none is installed in this sandbox, and installing one just for a
   check isn't worth it):
   - `node --check` every JS file.
   - Dry-run the `generate` function thousands of times in a throwaway Node script to confirm the
     arithmetic invariants hold (decomposition sums match, ranges stay in bounds).
   - For a real interactive pass, `npm install jsdom` in a scratch dir *outside the repo*
     (e.g. `/tmp`), load the activity's `index.html` with `JSDOM.fromFile(..., { runScripts:
     "dangerously" })`, and script clicks/fills/checks end to end. Delete the scratch dir after.
10. Tell the user to eyeball the result on iPad/laptop before considering it done — this
    environment can't render a real browser, so a script-level pass is not a substitute for their
    visual check (touch targets, portrait/landscape, general feel).

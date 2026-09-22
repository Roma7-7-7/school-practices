# School Practices

A small static site of interactive learning exercises (currently math), built for one specific
kid to practice on an iPad or laptop, hosted via GitHub Pages. This file is the source of truth
for conventions — read it before adding or changing anything.

## What this is (and isn't)

- Plain HTML + CSS + JS. **No build step, no bundler, no npm, no framework.** GitHub Pages
  serves the repo as-is; anything requiring a build defeats that.
- Code, comments, commit messages, and docs are in **English**. All UI text the learner sees
  (titles, labels, buttons, feedback messages) is in **Ukrainian**.
- Primary device is an **iPad** (Safari), secondary is a laptop browser. Design and test for
  touch first.
- Audience/topic scope is intentionally loose ("mixed / will grow over time") — don't hardcode
  a grade level or a fixed subject list anywhere. New activities can be any school subject, not
  just math, even though math comes first.

## Repo structure

```
index.html                     Entry point — lists activities, GitHub Pages root
assets/css/main.css            Design tokens + shared components (buttons, cards, digit-input, feedback)
assets/js/main.js              Shared behavior: digit-input navigation, validation/feedback
                                helpers, random-int + data-role/data-field lookup helpers, tab
                                switcher for multi-mode activities, stopwatch (see the file's
                                own comments)
assets/js/activities-data.js   Registry of activities shown on the index page
assets/js/index-page.js        Renders the registry into the index page grid
activities/<slug>/index.html   One folder per activity; owns its own script.js and, if truly needed, style.css
math-1.html, math-2.html       Legacy activities, pre-dating this framework. Left as-is; linked
                                from a "Старі вправи" section on the index page until reimplemented
                                one at a time into activities/<slug>/. Do not edit their content
                                unless explicitly asked — the user is reimplementing them by hand
                                and will use the originals only as reference.
.claude/skills/new-activity/     Skill that scaffolds a new activity folder + registry entry
.claude/skills/equation-exercise/ Skill that turns a pasted bracket/placeholder sample (e.g.
                                  "24 + [ ][ ] + [ ]") into generate/render/validate code using
                                  the shared digit-box/equation/tab framework
```

## Critical rule: relative paths only

This site is very likely served as a GitHub Pages *project* site
(`https://<user>.github.io/<repo>/`), not at a domain root. A root-absolute path like
`/assets/css/main.css` will resolve to the wrong place. **Always use relative paths**
(`../../assets/css/main.css` from an activity two levels deep, `assets/css/main.css` from
`index.html`).

## Adding a new activity

Use the `/new-activity` skill rather than hand-rolling the boilerplate — it keeps every page
consistent. It will:

1. Create `activities/<slug>/index.html` and `activities/<slug>/script.js`.
2. Wire the page up to `../../assets/css/main.css` and `../../assets/js/main.js`.
3. Add an entry to `assets/js/activities-data.js` so it shows up on the index page.

Conventions the skill (and any manual work) must follow:

- `<html lang="uk">`, all learner-facing text in Ukrainian.
- Include the standard meta tags (viewport + `apple-mobile-web-app-capable`) — see any existing
  activity or `index.html` for the exact block. This matters for iPad "Add to Home Screen" use.
- Reuse `assets/css/main.css` component classes (`.card`, `.btn`, `.digit-input`, `.feedback`,
  `.badge`, `.stopwatch`) instead of inventing new ad-hoc styles. Add new shared components to
  `main.css` itself when a pattern is genuinely reused across activities, not per-activity.
- Reuse `MathFramework.setupDigitInputs`, `MathFramework.validateFields`, `MathFramework.setFeedback`,
  `MathFramework.randInt`, `MathFramework.setRole`/`getField`, `MathFramework.setupTabs`, and
  `MathFramework.setupStopwatch` from `main.js` for the digit-box equation pattern (see that
  file's comments, and the `equation-exercise` skill for how to turn a pasted sample into code)
  instead of re-implementing auto-advance/validation/tabs/timing per activity — this was the main
  duplication problem in the legacy pages. `activities/four-operations/` is a worked reference
  implementation, including a stopwatch reset on tab switch.
- No persistence/score-tracking across sessions (by explicit decision — keep activities
  stateless: generate → check → try again). Revisit only if asked.
- Tag activities in `activities-data.js` with whatever topics genuinely apply
  (`"додавання"`, `"розрядність"`, etc.) — tags are free-form and additive, not a fixed enum.

## iPad-friendliness checklist

- Touch targets ≥ 44×44px (`--touch-target-min` in `main.css`).
- No functionality that depends on `:hover` alone.
- Number inputs use `inputmode="numeric"` (not `type="number"`, which adds spinner UI and
  allows `e`/`-` in some browsers) plus a digit-only keydown/input guard.
- Test both portrait and landscape.
- Avoid text selection/callout popups on tap-heavy UI (`-webkit-touch-callout: none` where
  relevant, already set in `main.css` base styles).

## Design system quick reference

See `assets/css/main.css` for the full token list. Don't invent parallel one-off colors/spacing —
extend the token set there if something is missing.

## Future: hierarchical organization

The site currently shows a flat list of activities, but it's expected to eventually grow into a
tree — subject (math/literature/english/...) → level (basics/advanced/pro/...) → activity. Don't
build that hierarchy now (shape is still unknown), but keep these guardrails so it's cheap later:

- The registry (`activities-data.js`) is the single source of truth for an activity's location
  (`path`) and categorization (`tags`, and later probably dedicated `subject`/`level` fields).
  `index-page.js` renders purely from that data — introducing grouping should mean changing how
  the registry is rendered (group by field), not how activities are built.
- Keep activity **slugs and folder names flat and purely descriptive** of the exercise itself
  (e.g. `add-two-digit`, not `math-basics-add-two-digit`). Categorization belongs in registry
  fields, which are cheap to add/extend — folder/slug renames later are not.
- If activities eventually move into nested folders (e.g. `activities/math/add-two-digit/`),
  each moved activity's relative asset paths (`../../assets/...`) will need a depth update.
  That's an expected, mechanical migration step, not a sign of a design mistake.

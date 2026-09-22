---
name: new-activity
description: Scaffold a new activity page (folder, index.html, script.js, registry entry) following this project's conventions — use when adding a new exercise to school-practices.
---

# new-activity

Scaffolds a new activity folder for this project. Read `CLAUDE.md` at the repo root first if you
haven't already — it has the full convention list (relative paths, Ukrainian UI, shared CSS/JS,
iPad checklist, no persistence). This skill just automates the boilerplate; it does not write the
actual exercise generation/validation logic — that's activity-specific and comes from the user or
a follow-up implementation step.

## Steps

1. **Gather what's needed** (ask the user for whatever isn't already given in the conversation):
   - A short English slug for the folder name (kebab-case, e.g. `add-two-digit`).
   - Ukrainian title and one-line description for the index card.
   - Free-form tags (Ukrainian topic words, e.g. `["додавання", "розрядність"]`).
   - Whether the activity uses the digit-box equation pattern (`MathFramework`) or needs
     something custom.

2. **Create `activities/<slug>/index.html`** using this template — fill in the title/description
   and swap `<!-- EXERCISE MARKUP -->` for the actual layout once known:

   ```html
   <!DOCTYPE html>
   <html lang="uk">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
     <meta name="apple-mobile-web-app-capable" content="yes">
     <meta name="theme-color" content="#4763e4">
     <title>{{Ukrainian title}}</title>
     <link rel="stylesheet" href="../../assets/css/main.css">
   </head>
   <body>
     <div class="page">
       <a class="back-link" href="../../index.html">← На головну</a>
       <header class="site-header">
         <h1>{{Ukrainian title}}</h1>
       </header>

       <!-- EXERCISE MARKUP -->

       <div class="btn-row">
         <button class="btn btn-primary" id="generateBtn">Нова вправа</button>
         <button class="btn btn-secondary" id="checkBtn">Перевірити</button>
       </div>

       <div id="feedback" class="feedback"></div>
     </div>

     <script src="../../assets/js/main.js"></script>
     <script src="script.js"></script>
   </body>
   </html>
   ```

3. **Create `activities/<slug>/script.js`** with the generate/validate skeleton, wired to
   `MathFramework.setupDigitInputs` / `validateFields` / `setFeedback` if the activity uses the
   digit-box pattern. Leave the actual problem-generation math for the user to specify unless
   they've already described it.

4. **Add an entry to `assets/js/activities-data.js`**, appending to the `ACTIVITIES` array:

   ```js
   { slug: "<slug>", title: "{{title}}", description: "{{description}}", tags: [/* ... */], path: "activities/<slug>/index.html" }
   ```

5. **Sanity-check before finishing:**
   - All asset links use relative paths (`../../assets/...`), never root-absolute.
   - `<html lang="uk">` and every learner-facing string is Ukrainian.
   - Buttons/inputs meet the 44px touch-target minimum (default `.btn`/`.digit-input` classes
     already satisfy this — don't override with a smaller custom size).
   - Open `index.html` and confirm the new card renders and links correctly.

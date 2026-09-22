/*
 * Registry of activities shown on the index page.
 * Each entry: { slug, title, description, tags, path }
 *   - title/description: Ukrainian, shown to the learner.
 *   - tags: free-form array of topic strings, e.g. "додавання", "розрядність".
 *   - path: relative to index.html, e.g. "activities/add-two-digit/index.html".
 *
 * The /new-activity skill appends entries here automatically. Currently empty —
 * math-1.html / math-2.html are linked separately from the legacy section
 * in index.html until they're reimplemented into activities/<slug>/.
 */
window.ACTIVITIES = [];

# Premium V15 — Orbital Research Experience

## What changed

- Reworked the homepage hero atmosphere with a restrained orbital/network motif, animated rings, soft lighting and subtle globe movement. This is an original visual direction for AllConferenceAlerts, not a copy of the reference site's artwork.
- Rebuilt the Saved conferences overlay as a React portal mounted to `document.body`. The overlay can no longer be trapped beneath the sticky header's stacking context or clipped by the page shell.
- The Saved drawer now fills the viewport, keeps the saved list independently scrollable, locks background scrolling while open, closes with Escape or a backdrop click, and respects `prefers-reduced-motion`.
- Retained local-device saved items and existing navigation behavior.
- Added responsive layout rules for desktop and mobile.

## SEO preservation

The changes are limited to presentation and drawer interaction. The existing route definitions, indexed URL manifest, page copy, canonical URLs, title/description metadata, structured data components, sitemap generation and prerendering scripts were not intentionally changed. The SEO asset generator reported that it preserved all 273 previously published sitemap URLs.

## Build validation limitation

A full production build could not be completed in this environment because the local Vite executable was missing. `npm run build` stopped at `vite: not found`. An offline dependency reinstall was unavailable because a package tarball was not cached, and the online install did not complete within the environment timeout. Please run `npm ci` and `npm run build` in a normal network-enabled environment before deploying.

## Feature roadmap — useful next additions

These are recommendations, not features claimed as already implemented:

1. **Semantic conference discovery** — use embeddings to find relevant conferences when users search natural-language phrases rather than exact keywords. Keep server-side ranking explainable and show why each result matched.
2. **Personal research radar** — optional browser-based saved-search alerts for topics, countries, formats and date windows. Ask permission before notifications and provide an obvious opt-out.
3. **Calendar and deadline tools** — one-click `.ics` exports, reminders for abstract submission deadlines, and clear timezone handling where source data exists.
4. **Trust and provenance signals** — show organizer/source links, last-verified dates and a correction/report path. Never imply a conference is verified unless it has actually been checked.
5. **Accessibility and performance** — keyboard-first navigation, reduced-motion support, robust focus management, and Core Web Vitals monitoring.

Research used for the roadmap: Forrester's 2026 B2B events analysis highlights audience participation, personalization and integration; InEvent's 2026 review describes practical AI use cases including registration workflows and personalized session recommendations. Any AI feature should be introduced only with quality source data, privacy controls and human review.

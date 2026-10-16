# AllConferenceAlerts V11 — Premium visual redesign

This release adds a new visual-only stylesheet (`src/premium-v11.css`) on top of the existing V10 design. It refreshes the hero, navigation, search bar, statistics, category cards, event cards, destinations, calendar, editorial content and organizer CTA with a higher-contrast evergreen/ivory/lime palette, larger editorial typography, deeper visual hierarchy, refined borders and responsive layouts.

## SEO and route preservation
- No route definitions, route paths, page data, SEO component props, canonical URLs, structured-data components, sitemap/prerender scripts, or indexed URL manifest were edited for this visual refresh.
- `src/main.jsx` only imports the new stylesheet after the existing style sheets.
- The design continues to use semantic page sections and existing page content.

## Verification
- The SEO asset generator ran and reported: 250 pages, 14 blog URLs, 9 conference URLs; 273 previously published sitemap URLs preserved.
- The full build could not proceed in this environment because the local install does not contain the Vite executable (`sh: 1: vite: not found`). Run `npm ci` and then `npm run build` before deployment.

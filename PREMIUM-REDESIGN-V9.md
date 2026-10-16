# Premium redesign V9 — AllConferenceAlerts.net

## Design direction
- Editorial, premium visual system with warm off-white surfaces, deep research-green/navy panels, and restrained lime accents.
- Reworked the homepage hero visual into a research-discovery card with direct links to existing conference categories.
- Refined the navigation, CTA, search/filter panel, section spacing, event cards, category cards, destination grid, editorial cards, footer and responsive breakpoints.
- Applied a shared visual layer to existing route pages so the conference directory, conference detail, category, country, role and blog pages feel like one product.

## SEO and URL preservation
This is a presentation-only refresh. The following files/areas were not intentionally changed:
- `src/seo/` metadata, canonical, schema and structured-data components
- `scripts/generate-seo-assets.mjs`, `scripts/prerender.mjs`, `scripts/audit-seo.mjs`
- `src/data/indexedUrlManifest.js` and conference/blog data
- Existing route paths in `src/App.jsx`
- Existing page titles, descriptions, canonical URLs, robots rules, sitemap/prerender route generation

`src/App.jsx` only adds a wrapper class for scoped styling. `src/main.jsx` imports the new stylesheet after the existing stylesheet. Existing routes and page content remain in place.

## Build validation
The project dependency installation could not complete in this environment (the `npm ci` process stalled), so a full Vite build and SEO audit were not run here. The existing SEO scripts passed Node syntax checks, CSS delimiter counts are balanced, and the archive is checked for ZIP integrity. Run the full build locally before deployment:

```bash
npm ci
npm run build
```

Do not deploy if the SEO audit fails. Compare `dist/sitemap.xml`, generated route HTML, canonical URLs and descriptions against the previous release before publishing.

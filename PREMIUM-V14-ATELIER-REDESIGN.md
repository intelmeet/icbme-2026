# AllConferenceAlerts V14 — Atelier redesign

## Intent
A more editorial, art-directed visual structure with a deep evergreen hero, oversized serif typography, an asymmetrical hero/artwork layout, warm ivory content surfaces, restrained lime/champagne accents, more deliberate card hierarchy, and a calmer responsive experience.

## Saved drawer bug fix
`src/components/Header.jsx` used `FaCheckCircle` in the saved drawer footer without importing it. This can throw a runtime ReferenceError when the drawer is rendered, causing the app to appear blank. The icon is now imported. The empty-state CTA now links to `/upcoming-conferences` and closes the drawer.

## SEO preservation
This release changes presentation CSS and the saved drawer UI only. It does not intentionally modify route definitions, page SEO components, canonical handling, structured data, sitemap generation, prerendering, conference datasets, or the indexed URL manifest.

## Validation status
- ZIP integrity checked after packaging.
- Full dependency-backed production build must be run in the user's environment (`npm ci && npm run build`) before deployment.

# AllConferenceAlerts V13 — Premium Design & Useful Features

## Design direction
- Deep evergreen / ink background, warm ivory surfaces, restrained champagne detail and lime highlight.
- Editorial serif headlines, high contrast, larger negative space, subtle layered depth, refined borders, consistent corner radius.
- Motion kept subtle and CSS-driven; respects `prefers-reduced-motion`.
- Existing route and SEO rendering architecture retained.

## npm ecosystem research (official documentation reviewed 16 Oct 2026)
- **Motion for React (`motion`)**: spring, gesture and scroll animations. Official docs: https://motion.dev/docs/react. Useful for a later, measured enhancement to the Matchmaker and route transitions; not added here because this release should avoid introducing a new runtime dependency before the SEO/build baseline is confirmed.
- **Embla Carousel (`embla-carousel-react`)**: accessible-to-style, swipe-friendly carousels with React integration and optional autoplay. Docs: https://www.embla-carousel.com/docs/v8/get-started/react. Useful for a future touch-first featured conference carousel, but not necessary for current comparison feature.
- **Lucide React (`lucide-react`)**: tree-shakable inline SVG icons with customizable size/color/stroke. Docs: https://lucide.dev/guide/react/. Current project already has `react-icons`; adding a second icon pack would increase bundle weight and create inconsistency, so existing icons are reused.
- **shadcn/ui**: accessible, customizable component source patterns. Docs: https://ui.shadcn.com/docs/official. The project currently uses Tailwind v3 and bespoke CSS; a wholesale component-system migration would be disproportionate and risky for a design refresh.

## New feature implemented
- **Side-by-side conference comparison**: users can select up to three existing events, see a sticky shortlist dock, remove entries, and compare published date, country, format, category and event detail links in one panel. All data comes from the current conference dataset; no invented deadlines or organizer verification badges are added.
- Works without login and does not mutate URLs, route config, canonical tags, schema, sitemap or prerender behavior.

## SEO safety boundaries
- No changes intended to `src/seo`, `scripts/`, route definitions, canonical metadata, schema, sitemap generator, indexed URL manifest or conference/blog data.
- The added comparison UI is rendered only within the existing homepage component. Existing static/prerendered text and metadata remain in the same component.
- Run `npm run build` and confirm the existing SEO audit passes before deployment. No production build claim is made until verified.

# AllConferenceAlerts V10 — Premium discovery redesign

## What changed
- Rebuilt the homepage into a premium, editorial-style global conference discovery experience with a deep evergreen hero, original globe/network illustration, prominent search, fast filters, category discovery, featured listings, destination exploration, month navigation, research guidance, and an organizer CTA.
- Added live category/destination counts derived from the existing conference data. No unsupported audience or conference-volume claims were added.
- Added browser-local conference shortlisting. Researchers can save from homepage cards, directory cards, or conference detail pages; the header opens a drawer with saved items. Shortlist data stays in local browser storage and does not require an account.
- Added responsive desktop/tablet/mobile layouts, reduced-motion handling, keyboard-accessible buttons/labels, descriptive image alt text, and hover/focus feedback.
- Refreshed the shared header/footer and visual treatment of existing listing pages without replacing their content or route structure.

## SEO and URL preservation
- Kept the existing route definitions, conference and blog datasets, SEO component, canonical logic, JSON-LD/schema components, sitemap generators, prerender script, SEO audit, and indexed URL manifest unchanged.
- The homepage keeps its existing title, meta description, and canonical URL.
- The new illustration is a local SVG asset bundled by Vite; no third-party image request is required.
- Saved-conference state is loaded after hydration, so it does not change server-rendered metadata or initial SEO HTML.

## Build and QA
Run from the extracted project directory:

```bash
npm ci
npm run build
npm run dev
```

The production build runs the existing asset generation, Vite build, prerender and SEO audit pipeline. Do not deploy unless `npm run build` completes and the SEO audit passes. After deployment, verify the homepage, a conference detail page, a category page, a country page and a blog page, then confirm their canonical URLs and page titles in the live source.

## Important notes
- Existing URL paths are preserved; do not rename or remove indexed paths during deployment.
- Saved conferences are stored only in the current browser/device. Clearing browser storage removes the shortlist.
- A visual redesign cannot guarantee a particular Google ranking. Search performance still depends on useful original content, crawlability, performance and authority.

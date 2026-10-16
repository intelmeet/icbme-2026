# Build fix V8 — prerendered SEO metadata

The V7 build successfully prerendered 273 routes, but the SEO audit reported a missing meta description and canonical URL for every route.

Cause: `src/seo/SEO.jsx` uses `<Helmet prioritizeSeoTags>`. In `react-helmet-async`, prioritized tags are serialized under `context.helmet.priority`; the prerender helper was serializing the other Helmet buckets but not `priority`. As a result, those tags were dropped from generated HTML even though the React render completed.

Fix: `scripts/prerender.mjs` now serializes the `priority` bucket first, then the other Helmet buckets. The audit remains strict and will still fail if descriptions or canonical URLs are actually missing.

## Verify

Run from the project root:

```bash
npm ci
npm run build
```

Expected: the prerender step completes and the SEO audit checks all sitemap URLs. The build has not been independently executed in this packaging environment, so verify locally before deployment.

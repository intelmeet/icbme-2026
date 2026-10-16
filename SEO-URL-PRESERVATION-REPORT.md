# Search Console URL Preservation Report

Prepared: 2026-10-16
Canonical host: `https://www.allconferencealerts.net`

## What was protected

- Added an explicit manifest containing **241 unique URL paths** supplied from Google Search Console.
- Sitemap generation includes every manifest path and continues preserving URLs found in the previous sitemap files.
- The current sitemap generation produced **273 unique URLs** across the three sitemap shards:
  - `sitemap-pages.xml`: 250 URLs
  - `sitemap-blogs.xml`: 14 URLs
  - `sitemap-conferences.xml`: 9 URLs
- A local check confirmed all 241 manifest paths are present and the generated sitemap shards contain no duplicate URL values.
- The historic `/conferences-in-rome` route now has a dedicated page.
- Country/region labels normalize common aliases such as `usa`, `united-states`, `uae`, and region slugs without changing their URL paths.
- Conference detail pages can fall back to an existing basic directory record when the richer details object is missing, rather than immediately returning a noindex page.

## Files to review

- `src/data/indexedUrlManifest.js` — all URL paths supplied from Search Console
- `scripts/generate-seo-assets.mjs` — sitemap generation and preservation logic
- `scripts/prerender.mjs` — writes HTML files for sitemap routes
- `scripts/audit-seo.mjs` — checks sitemap URLs, generated HTML, canonicals, titles, descriptions, H1s, structured data, and accidental noindex on protected URLs
- `src/pages/CityLanding.jsx` — `/conferences-in-rome`
- `src/utils/locationNames.js` — country/region normalization

## Before production deployment

1. Run `npm ci` and `npm run build` on a network-enabled machine.
2. Resolve any build or audit errors. The full Vite build was not runnable in this environment because package-registry installation failed.
3. Compare the generated sitemap with the live Search Console list; keep the manifest updated as a protection mechanism.
4. Deploy the complete `dist/` output to the existing S3 origin and apply the CloudFront clean-URL function described in `README.md`.
5. Use Search Console URL Inspection to test representative pages from every route family and confirm Google-selected canonicals after deployment.

## Important limitations

Preserving a URL does not by itself guarantee rankings or indexing. The local project still has a limited conference dataset compared with the many indexed country/topic URLs. Do not fabricate event records to fill these pages; connect verified production data and improve the unique usefulness of pages over time. No code change can guarantee position #1 in Google.

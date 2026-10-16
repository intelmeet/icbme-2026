# AllConferenceAlerts — React + Vite Premium SEO Project

This project keeps the existing public host and route patterns for **https://www.allconferencealerts.net/** while improving the discovery experience, technical SEO, page metadata, structured data, and crawlable HTML output.

## Stack

- React 18 + Vite
- React Router 6
- React Helmet Async for page metadata
- Tailwind CSS and existing custom design system
- S3 + CloudFront deployment support

## Local development

Use Node.js 20 LTS or newer.

```bash
npm ci
npm run dev
```

Vite prints the local development URL. The dev server uses client rendering; the production build includes pre-rendered route HTML.

## Production build and SEO checks

```bash
npm run build
npm run preview
```

The production build performs these steps:

1. `scripts/generate-seo-assets.mjs` generates `sitemap.xml`, `sitemap-pages.xml`, `sitemap-blogs.xml`, `sitemap-conferences.xml`, and `robots.txt`. It preserves URLs found in the previous sitemap files and the 241 URL paths supplied from Google Search Console in `src/data/indexedUrlManifest.js`. It does not add query-parameter search URLs.
2. Vite builds the client assets.
3. `scripts/prerender.mjs` renders each canonical sitemap URL to static HTML with its page-specific title, description, canonical, social metadata, visible content, and JSON-LD. This helps crawlers receive meaningful page HTML without depending solely on JavaScript execution.
4. `scripts/audit-seo.mjs` verifies that sitemap URLs are unique and have generated HTML, matching canonicals, titles, descriptions, an H1, valid JSON-LD, and that every supplied legacy path remains in the sitemap and is not marked `noindex`.

You can also run individual steps:

```bash
npm run seo:generate
npm run build:client
npm run seo:prerender
npm run seo:audit
```

## Existing URL preservation

- Keep `https://www.allconferencealerts.net/` as the canonical host unless you intentionally migrate the domain.
- Existing sitemap URLs and all 241 supplied Search Console URL paths are preserved by the sitemap generator and distributed among sitemap shards without changing their paths. The manifest is an explicit migration guard; update it only when a URL has been deliberately retired or redirected.
- Conference URLs remain under `/conference/:slug`.
- Blog URLs remain under `/blog/:slug`.
- Country, category, industry, role, contact, privacy, terms, and submission route patterns remain unchanged.
- Filtered and paginated search URLs are `noindex,follow` and canonicalize to the base conference directory. Curated country/topic pages can be indexed when they are included in the sitemap.
- Keep the current `www`/non-`www` redirect and HTTPS redirect consistent with the canonical host.

## AWS S3 + CloudFront deployment

The pre-renderer writes route files such as `dist/conference/example-slug/index.html`. Configure CloudFront to map clean URLs to these files:

1. Upload the complete **contents** of `dist/` to the existing S3 origin. Do not upload only `index.html`.
2. In CloudFront, create a CloudFront Function from `deploy/cloudfront-function.js`.
3. Associate the function with the distribution's **Viewer request** event. It rewrites clean routes such as `/conference/example-slug` to `/conference/example-slug/index.html`; asset and public file URLs such as `/assets/app.js`, `/robots.txt`, and `/sitemap.xml` are left unchanged.
4. Keep `index.html` as the default root object.
5. Configure a custom error response for missing S3 objects (typically 403 and/or 404 depending on the origin) to serve `/404.html` with HTTP status **404**. Test a real unknown URL and verify it returns 404, not 200.
6. Invalidate CloudFront cache after uploading, especially `/`, `/sitemap.xml`, `/sitemap-pages.xml`, `/sitemap-blogs.xml`, `/sitemap-conferences.xml`, `/robots.txt`, and previously cached route paths.
7. Test representative URLs directly, including a conference, a blog post, a country page, a topic page, `/about`, and an invalid path.

Do not enable a blanket 200-response fallback for all missing paths if you can use the pre-rendered route files. Soft 404s can waste crawling resources and weaken the user experience.

## Google Search Console launch checklist

- Inspect the homepage and several existing indexed URLs with URL Inspection; check the rendered HTML and Google-selected canonical.
- Submit `https://www.allconferencealerts.net/sitemap.xml` after deployment.
- Compare the previous and new sitemaps to confirm all important indexed URLs are still present.
- Check Page Indexing, Core Web Vitals, HTTPS, mobile usability, and Crawl Stats over the following weeks.
- Monitor impressions/clicks for existing query groups before and after deployment. Avoid changing URLs during the redesign.
- Do not expect instant ranking changes. Crawl, indexing, and ranking updates take time.

## Content and data maintenance

- Conference display dates, ISO `startDate`/`endDate`, registration deadlines, venue/mode, organizer, and official website should agree. Update the data in `src/data/conferenceDetails.js` and `src/data/conferences.js` together when a verified event change occurs.
- Do not invent dates, publication/indexing guarantees, registration fees, organizer credentials, or venues. Confirm critical event details against the organizer's official page.
- Add a new conference to the appropriate data sources and ensure its slug is unique before publishing. The build automatically adds detail URLs to the conference sitemap.
- Add new blog posts to `src/data/blogs.js`; their `/blog/:slug` URLs are included in the blog sitemap.
- Write genuinely useful, original information for each country/topic/industry page. Do not mass-produce near-identical landing pages just to target keyword variations.
- Keep form endpoints and analytics IDs secured and valid. Public frontend code cannot keep API secrets confidential; use a server-side endpoint for sensitive credentials.

## SEO implementation included

- Per-route title, meta description, robots directives, canonical URL, Open Graph, and Twitter metadata.
- Sitewide `WebSite`/`Organization` JSON-LD and page-level Event/BlogPosting/Breadcrumb schemas where available.
- Static route pre-rendering so search engines can read page content and metadata before client JavaScript runs.
- Split XML sitemaps for main pages, blog content, and conference details.
- Filtered search and pagination URLs are not allowed to create a large index of duplicate parameter pages.
- Deferred loading of the third-party chat widget to reduce early main-thread/network contention.
- A build-time audit to catch missing route HTML, duplicate sitemap URLs, missing titles/descriptions/H1s, canonical mismatches, malformed JSON-LD, and accidental removal or `noindex` on supplied legacy URLs.
- Explicit Search Console URL manifest (`src/data/indexedUrlManifest.js`) and legacy city-route support for `/conferences-in-rome`.
- Better country/region slug normalization (including `usa`, `uae`, and regional archive URLs) and category-specific topic copy.
- Conference detail fallback for known directory entries where a full detail record is temporarily unavailable; only verified fields are displayed.

## Ranking expectations

No implementation can guarantee position #1. Results depend on search intent, competing sites, link reputation, content quality, event accuracy, user experience, and how Google crawls and evaluates the site. Use this project as a stronger technical foundation and continue improving the real event data and editorial usefulness.

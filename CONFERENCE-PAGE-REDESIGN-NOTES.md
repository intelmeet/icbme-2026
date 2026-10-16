# AllConferenceAlerts.net — Conference detail refresh

## Included
- Premium responsive conference detail template at `src/pages/Conference.jsx`.
- Breadcrumbs and in-site routes to conference listings, categories, and related conferences.
- Topic chips, audience section, event dates, organizer contact and official event link.
- A custom CSS/SVG-like abstract artwork cover generated from each event's category when no poster is available; existing posters are retained where provided.
- One shared interest form component rendered on every conference detail page, with name, email, participant type, consent, conference-specific metadata, loading/success/error states, and spam honeypot.
- Updated dates across the eight conference records in `src/data/conferenceDetails.js` and corresponding records in `src/data/conferences.js`: 7 Nov, 13 Nov, 19 Nov, 25 Nov, 1 Dec, 7 Dec, 13 Dec, 19 Dec 2026. Existing slugs/URLs are unchanged.
- Removed a duplicate `/conference/:slug` route so the intended conference page consistently handles the existing URL.

## Before deployment
1. Run `npm ci` then `npm run build`.
2. Test all eight existing `/conference/<slug>` URLs, the interest form, category links, mobile layout, and the official organizer links.
3. Verify the Web3Forms access key is active and submissions arrive at the intended inbox. Do not expose private keys; the current access key was already in the source project.
4. Confirm the requested November/December event dates and submission deadlines with the event organizer before publishing. Dates were changed per request, but they must reflect real schedules.
5. Confirm `/privacy-policy` exists and is the correct live policy URL before publishing the consent link.
6. Check rendered page metadata, canonical URL, Event structured data, sitemap, and Google Search Console URL Inspection after deployment.

## Important
- Existing conference slugs and `/conference/:slug` URL format are preserved.
- A generated category-themed artwork is used when a conference does not have an existing poster. Replace with approved official event posters when available.
- The conference form sends interest submissions via the project's existing Web3Forms integration. It does not represent confirmed registration or payment.

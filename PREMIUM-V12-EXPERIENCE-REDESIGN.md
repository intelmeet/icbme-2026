# Premium V12 experience redesign

This update adds an interactive Conference Matchmaker section to the existing homepage. Visitors can select a research subject, preferred format, and country to generate a shortlist from the existing conference dataset, then open individual conference detail pages or the full results directory. The component is client-side and uses existing routes/data only.

SEO preservation: no route definitions, SEO metadata components, canonical handling, structured data, sitemap generation, prerender scripts, conference data, or indexed URL manifest were intentionally changed. Visual styles are appended to the existing stylesheet.

Validation: ZIP integrity and source-level review completed. A dependency-backed `npm run build` could not be completed in this environment because `npm ci` timed out. Run `npm ci` and `npm run build` locally and do not deploy unless prerendering and the SEO audit pass.

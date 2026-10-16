# Build and SEO audit fix — V7

The V6 build successfully prerendered 273 pages, but the SEO audit showed that route-specific descriptions and canonical tags were missing from the generated HTML. The prerenderer had therefore not proven that the Helmet provider and Helmet components were sharing the same context instance.

V7 routes all `Helmet` and `HelmetProvider` imports through `src/seo/Helmet.jsx`, including browser entrypoint and prerenderer. The prerenderer now fails early with a clear route-specific error if Helmet metadata is not populated, instead of silently writing generic HTML. Also changed React's unsupported `fetchPriority` JSX prop to lowercase `fetchpriority` to remove the React warning.

Run on Windows:

```bash
npm ci
npm run build
```

The build is only accepted when the final SEO audit passes. A successful Vite compilation alone is not sufficient.

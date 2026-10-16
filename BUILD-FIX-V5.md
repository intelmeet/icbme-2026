# Build fix V5 — react-helmet-async SSR interop

The browser build succeeded, but prerendering failed because Vite externalized `react-helmet-async` during SSR and then treated its ESM entry as CommonJS, rejecting the named `Helmet` export.

The app keeps the package's documented named imports (`Helmet` and `HelmetProvider`) for the browser/Rollup build. `vite.config.js` now sets `ssr.noExternal: ["react-helmet-async"]` so Vite transforms this dependency during server-side rendering instead of asking Node's external-module interop to interpret it.

## Verify locally

```bash
npm ci
npm run build
```

A successful build should finish all four steps: SEO asset generation, Vite production build, prerendering, and SEO audit. The Browserslist `caniuse-lite` message is a database-age warning, not the failure described above.

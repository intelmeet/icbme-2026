# Build fix V6 — Helmet SSR instance mismatch

The V5 prerenderer loaded `HelmetProvider` with Node's `require()`, while route components loaded `Helmet` through Vite's SSR-transformed module graph. That could create two separate `react-helmet-async` instances, leading to `helmetInstances` being undefined inside `HelmetDispatcher`.

V6 removes the direct Node `require()` and loads `src/seo/SSRHelmetProvider.jsx` using `server.ssrLoadModule()`. The provider and the Helmet components now resolve through the same Vite SSR module graph. The Vite `ssr.noExternal` setting remains so Vite transforms the dependency consistently during prerender.

Run from a fresh extraction on Windows:

```bash
npm ci
npm run build
```

The expected build sequence is SEO asset generation, Vite production build, prerender of sitemap routes, and the SEO audit. This package has been syntax-checked and ZIP-validated; a full dependency-backed build was not run in this environment.

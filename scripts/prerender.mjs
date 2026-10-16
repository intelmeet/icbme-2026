import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const siteOrigin = "https://www.allconferencealerts.net";
const sitemapFiles = ["sitemap-pages.xml", "sitemap-blogs.xml", "sitemap-conferences.xml"];
const template = await readFile(path.join(dist, "index.html"), "utf8");
const server = await createServer({
  configFile: path.join(root, "vite.config.js"),
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

function getPaths(xml) {
  return [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gs)]
    .map((match) => match[1].replaceAll("&amp;", "&").trim())
    .filter((url) => url.startsWith(`${siteOrigin}/`))
    .map((url) => new URL(url).pathname)
    .filter((pathname) => !pathname.includes("?") && !pathname.includes("#"));
}

function getHelmetMarkup(helmet) {
  // react-helmet-async moves prioritized SEO tags (including the description
  // and canonical link) into `priority` when <Helmet prioritizeSeoTags> is used.
  // Omitting this bucket silently drops those tags from every prerendered page.
  return ["priority", "base", "title", "meta", "link", "script", "noscript", "style"]
    .map((key) => helmet?.[key]?.toString?.() || "")
    .filter(Boolean)
    .join("\n    ");
}

function stripStaticSeo(html) {
  return html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b(?=[^>]*\bname=["'](?:description|robots|googlebot|twitter:card|twitter:title|twitter:description|twitter:image)["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:[^"']+["'])[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["'](?:canonical|prev|next)["'])[^>]*>/gi, "")
    .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");
}

try {
  // Warm every lazy route module so the static render does not emit Suspense
  // loading placeholders for pages that should be indexable.
  // Load HelmetProvider through Vite's SSR module graph. Requiring the package
  // directly here creates a second react-helmet-async instance, so Helmet
  // components loaded by Vite cannot see the provider's context/dispatcher.
  const { HelmetProvider } = await server.ssrLoadModule("/src/seo/Helmet.jsx");

  const pageModules = [
    "/src/pages/Home.jsx", "/src/pages/Country.jsx", "/src/pages/Category.jsx",
    "/src/pages/Conference.jsx", "/src/pages/ConferenceList.jsx",
    "/src/pages/CategoryCountry.jsx", "/src/pages/Industry.jsx", "/src/pages/IndustryCountry.jsx",
    "/src/pages/Role.jsx", "/src/pages/BlogList.jsx", "/src/pages/BlogPost.jsx",
    "/src/pages/SubmitConference.jsx", "/src/pages/InfoPage.jsx", "/src/pages/NotFound.jsx", "/src/pages/CityLanding.jsx",
  ];
  await Promise.all(pageModules.map((modulePath) => server.ssrLoadModule(modulePath)));
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  await new Promise((resolve) => setTimeout(resolve, 0));

  const allPaths = new Set();
  for (const sitemapFile of sitemapFiles) {
    try {
      const xml = await readFile(path.join(dist, sitemapFile), "utf8");
      for (const pathname of getPaths(xml)) allPaths.add(pathname);
    } catch {
      throw new Error(`Missing ${sitemapFile}; run SEO asset generation before prerendering.`);
    }
  }
  allPaths.add("/");

  let rendered = 0;
  for (const pathname of [...allPaths].sort((a, b) => a.length - b.length || a.localeCompare(b))) {
    const context = {};
    const appTree = createElement(
      HelmetProvider,
      { context },
      createElement(StaticRouter, { location: pathname }, createElement(App)),
    );
    let markup = renderToString(appTree);
    // React.lazy starts its importer on the first render. Give that import a
    // turn to settle, then retry before writing any crawlable HTML.
    for (let attempt = 0; markup.includes("Loading...") && attempt < 10; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      markup = renderToString(appTree);
    }
    if (markup.includes("Loading...")) {
      throw new Error(`A Suspense placeholder remained while prerendering ${pathname}. Check the route's lazy import.`);
    }
    const headMarkup = getHelmetMarkup(context.helmet);
    if (!context.helmet || !context.helmet.title || !context.helmet.meta || !context.helmet.link) {
      throw new Error(`react-helmet-async did not populate SSR metadata for ${pathname}. Check that all Helmet imports use src/seo/Helmet.jsx.`);
    }
    let html = stripStaticSeo(template);
    html = html.replace("</head>", `    ${headMarkup}\n  </head>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

    const relativePath = pathname === "/" ? "index.html" : `${decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "")}/index.html`;
    const outputPath = path.join(dist, relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);
    rendered += 1;
  }

  // A generic fallback lets the app render its React 404 page when the hosting
  // layer is configured to return this file for missing objects.
  const fallbackHead = `<title>Page not found | AllConferenceAlerts</title>
    <meta name="description" content="The requested page could not be found. Browse upcoming conferences by research topic, country, and date." />
    <meta name="robots" content="noindex,follow" />`;
  const fallbackHtml = stripStaticSeo(template)
    .replace("</head>", `    ${fallbackHead}\n  </head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
  await writeFile(path.join(dist, "404.html"), fallbackHtml);
  console.log(`Pre-rendered ${rendered} route pages with route-specific HTML and metadata.`);
} finally {
  await server.close();
}

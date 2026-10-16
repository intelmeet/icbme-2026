import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexedUrlPaths } from "../src/data/indexedUrlManifest.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const site = "https://www.allconferencealerts.net";
const sitemapFiles = ["sitemap-pages.xml", "sitemap-blogs.xml", "sitemap-conferences.xml"];
const errors = [];
const urls = [];

for (const sitemapFile of sitemapFiles) {
  const xml = await readFile(path.join(dist, sitemapFile), "utf8");
  if (!xml.startsWith("<?xml")) errors.push(`${sitemapFile}: missing XML declaration`);
  for (const match of xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gs)) urls.push(match[1].replaceAll("&amp;", "&").trim());
}
if (new Set(urls).size !== urls.length) errors.push("Duplicate URLs found across sitemap shards.");
const sitemapPaths = new Set(urls.map((url) => { try { return new URL(url).pathname; } catch { return ""; } }));
for (const pathname of indexedUrlPaths) {
  const absolute = `${site}${pathname}`;
  if (!sitemapPaths.has(pathname)) errors.push(`Previously indexed URL missing from sitemap: ${absolute}`);
}

for (const url of urls) {
  let parsed;
  try { parsed = new URL(url); } catch { errors.push(`Invalid sitemap URL: ${url}`); continue; }
  if (parsed.origin !== site) errors.push(`Wrong canonical host in sitemap: ${url}`);
  if (parsed.search || parsed.hash) errors.push(`Sitemap URL contains query/hash: ${url}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const relative = pathname === "/" ? "index.html" : `${pathname.replace(/^\/+|\/+$/g, "")}/index.html`;
  const htmlPath = path.join(dist, relative);
  try { await stat(htmlPath); } catch { errors.push(`No prerendered HTML for sitemap URL: ${url}`); continue; }
  const html = await readFile(htmlPath, "utf8");
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["']([^"']*)["'][^>]*>/i)?.[1]
    || html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["']([^"']*)["']/i)?.[1];
  const canonical = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["']/i)?.[1]
    || html.match(/<link\b(?=[^>]*\bhref=["']([^"']+)["'])[^>]*\brel=["']canonical["']/i)?.[1];
  if (!title) errors.push(`${url}: missing title`);
  if (!description || description.length < 50) errors.push(`${url}: missing or too-short meta description`);
  if (canonical !== url) errors.push(`${url}: canonical mismatch (${canonical || "missing"})`);
  if (!/<h1\b/i.test(html)) errors.push(`${url}: no H1 found in prerendered HTML`);
  if (indexedUrlPaths.includes(pathname) && /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["'][^"']*noindex/i.test(html)) {
    errors.push(`${url}: a previously indexed URL is marked noindex`);
  }
  for (const schemaMatch of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(schemaMatch[1]); } catch { errors.push(`${url}: invalid JSON-LD schema`); }
  }
}

const indexHtml = await readFile(path.join(dist, "index.html"), "utf8");
if (!indexHtml.includes('id="root"')) errors.push("Built index.html is missing the React root.");
if (!await stat(path.join(dist, "og-default.webp")).catch(() => null)) errors.push("Missing default Open Graph image.");
if (!await stat(path.join(dist, "sitemap.xml")).catch(() => null)) errors.push("Missing sitemap index.");

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed: ${urls.length} unique sitemap URLs have prerendered HTML, canonical tags, titles, descriptions, H1s, and parseable JSON-LD.`);
  console.log(`Preserved all ${indexedUrlPaths.length} supplied Google Search Console URL paths.`);
}

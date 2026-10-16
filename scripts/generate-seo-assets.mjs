import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { conferences } from "../src/data/conferences.js";
import { conferenceDetails } from "../src/data/conferenceDetails.js";
import { blogs } from "../src/data/blogs.js";
import { countries } from "../src/data/countries.js";
import { industries } from "../src/data/industries.js";
import { isUpcomingConference } from "../src/utils/conferenceUtils.js";
import { indexedUrlPaths } from "../src/data/indexedUrlManifest.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const SITE = "https://www.allconferencealerts.net";
const today = new Date();
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

async function readExistingUrls(filename) {
  try {
    const xml = await readFile(path.join(publicDir, filename), "utf8");
    return [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gs)].map((match) => match[1].replaceAll("&amp;", "&").trim());
  } catch {
    return [];
  }
}

const existing = new Set([
  ...(await readExistingUrls("sitemap-pages.xml")),
  ...(await readExistingUrls("sitemap-blogs.xml")),
  ...(await readExistingUrls("sitemap-conferences.xml")),
  ...indexedUrlPaths.map((pathname) => `${SITE}${pathname.startsWith("/") ? pathname : `/${pathname}`}`),
].filter((url) => url === `${SITE}/` || url.startsWith(`${SITE}/`)));

const pagePaths = new Set([
  `${SITE}/`,
  ...[
    "/upcoming-conferences", "/about", "/contact", "/privacy-policy", "/terms", "/submit-conference", "/blog",
  ].map((item) => `${SITE}${item}`),
  ...countries.map((country) => `${SITE}/conferences/${country}`),
  ...["environmental-conferences", "life-science-conferences", "engineering-conferences", "medical-conferences"].map((slug) => `${SITE}/category/${slug}`),
  ...industries.map((slug) => `${SITE}/industry/${slug}`),
  ...["phd-scholars", "industry-professionals", "faculty", "startups"].map((slug) => `${SITE}/conferences-for/${slug}`),
]);
const blogPaths = new Set([`${SITE}/blog`, ...blogs.map((blog) => `${SITE}/blog/${blog.slug}`)]);
const conferencePaths = new Set(conferenceDetails.map((conference) => `${SITE}/conference/${conference.slug}`));

// Preserve every URL already present in the published sitemap files and every URL
// supplied from Google Search Console. Move URLs into the appropriate sitemap shard
// without changing their public paths.
for (const url of existing) {
  const pathname = new URL(url).pathname;
  if (pathname.startsWith("/blog/")) blogPaths.add(url);
  else if (pathname.startsWith("/conference/")) conferencePaths.add(url);
  else pagePaths.add(url);
}

const categoryMatches = {
  "environmental-conferences": ["environmental"],
  "life-science-conferences": ["life science", "life science"],
  "engineering-conferences": ["engineering"],
  "medical-conferences": ["medical"],
};
for (const [categorySlug, terms] of Object.entries(categoryMatches)) {
  const matched = conferences.some((event) => isUpcomingConference(event, today) && terms.some((term) => (event.category || "").toLowerCase().includes(term)));
  if (matched) {
    for (const country of countries) {
      const countryName = country.replace(/-/g, " ");
      const countryMatch = conferences.some((event) => isUpcomingConference(event, today)
        && (event.country || "").toLowerCase() === countryName
        && terms.some((term) => (event.category || "").toLowerCase().includes(term)));
      if (countryMatch) pagePaths.add(`${SITE}/${categorySlug}/${country}`);
    }
  }
}

const industryTerms = {
  "business-conferences": ["business", "economics", "finance"],
  "technology-conferences": ["computer science", "data science", "technology"],
  "medical-conferences": ["medical"],
  "engineering-conferences": ["engineering"],
};
for (const [industrySlug, terms] of Object.entries(industryTerms)) {
  for (const country of countries) {
    const countryName = country.replace(/-/g, " ");
    const matched = conferences.some((event) => isUpcomingConference(event, today)
      && (event.country || "").toLowerCase() === countryName
      && terms.some((term) => (event.category || "").toLowerCase().includes(term)));
    if (matched) pagePaths.add(`${SITE}/industry/${industrySlug}/${country}`);
  }
}

// Keep only canonical, clean URLs in XML. Query-based search/filter URLs are
// intentionally excluded; curated, useful directory pages remain crawlable.
const clean = (items) => [...new Set(items)].filter((url) => {
  try {
    const parsed = new URL(url);
    return parsed.origin === SITE && !parsed.search && !parsed.hash && !parsed.pathname.includes("//");
  } catch { return false; }
}).sort((a, b) => a.localeCompare(b));

const pageUrls = clean([...pagePaths].filter((url) => new URL(url).pathname !== "/blog" && !new URL(url).pathname.startsWith("/blog/") && !new URL(url).pathname.startsWith("/conference/")));
const blogUrls = clean([...blogPaths]);
const conferenceUrls = clean([...conferencePaths]);

function urlset(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
}

await writeFile(path.join(publicDir, "sitemap-pages.xml"), urlset(pageUrls));
await writeFile(path.join(publicDir, "sitemap-blogs.xml"), urlset(blogUrls));
await writeFile(path.join(publicDir, "sitemap-conferences.xml"), urlset(conferenceUrls));
await writeFile(path.join(publicDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${SITE}/sitemap-pages.xml</loc></sitemap>\n  <sitemap><loc>${SITE}/sitemap-blogs.xml</loc></sitemap>\n  <sitemap><loc>${SITE}/sitemap-conferences.xml</loc></sitemap>\n</sitemapindex>\n`);
await writeFile(path.join(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const urls = [...pageUrls, ...blogUrls, ...conferenceUrls];
if (new Set(urls).size !== urls.length) throw new Error("A URL appears in more than one sitemap shard.");
console.log(`SEO sitemaps generated: ${pageUrls.length} pages, ${blogUrls.length} blog URLs, ${conferenceUrls.length} conference URLs.`);
console.log(`Preserved ${existing.size} previously published sitemap URLs.`);

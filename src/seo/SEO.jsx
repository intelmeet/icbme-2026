import { Helmet } from "./Helmet";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.allconferencealerts.net";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.webp`;

function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function SEO({
  title,
  description,
  canonical,
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  prev,
  next,
  schema,
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  const location = useLocation();
  const cleanPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
  const canonicalUrl = canonical || `${SITE_URL}${cleanPath}`;
  const pageTitle = title || "International Conferences & Academic Events | AllConferenceAlerts";
  const pageDescription = (description || "Discover international academic conferences by research topic, country and date on AllConferenceAlerts.").replace(/\s+/g, " ").trim().slice(0, 300);
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonicalUrl} />
      {prev && <link rel="prev" href={prev} />}
      {next && <link rel="next" href={next} />}

      <meta property="og:site_name" content="AllConferenceAlerts" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="AllConferenceAlerts — discover international academic conferences" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      {schemas.map((item, index) => (
        <script key={`${item?.["@type"] || "schema"}-${index}`} type="application/ld+json">
          {safeJsonLd(item)}
        </script>
      ))}
    </Helmet>
  );
}

import { Helmet } from "./Helmet";

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AllConferenceAlerts",
    url: "https://www.allconferencealerts.net/",
    description: "Discover international academic conferences by research topic, country, and date.",
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.allconferencealerts.net/upcoming-conferences?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AllConferenceAlerts",
    url: "https://www.allconferencealerts.net/",
    logo: "https://www.allconferencealerts.net/brand-logo.webp",
    description: "A directory for discovering academic and professional conferences by topic, country, and date.",
  },
];

export default function SiteStructuredData() {
  return (
    <Helmet>
      {schemas.map((schema) => (
        <script key={schema["@type"]} type="application/ld+json">
          {JSON.stringify(schema).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
}

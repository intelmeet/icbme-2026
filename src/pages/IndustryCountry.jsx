import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import ConferenceCards from "../components/ConferenceCards";
import { conferences } from "../data/conferences";
import { isUpcomingConference } from "../utils/conferenceUtils";
import { formatLocationSlug } from "../utils/locationNames";

export default function IndustryCountry() {
  const { industrySlug, country } = useParams();

  const countryName = formatLocationSlug(country);

  const industryMap = {
    "business-conferences": "Business & Management Conferences",
    "technology-conferences": "Technology Conferences",
    "medical-conferences": "Medical & Healthcare Conferences",
    "engineering-conferences": "Engineering Conferences",
  };

  const industryName = industryMap[industrySlug];

  if (!industryName) {
    return (
      <SEO
        title="Page Not Found"
        description="The industry conference page you are looking for does not exist."
        robots="noindex,follow"
      />
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/industry/${industrySlug}/${country}`;
  const topicMatch = {
    "business-conferences": ["business", "economics", "finance"],
    "technology-conferences": ["computer science", "data science"],
    "medical-conferences": ["medical"],
    "engineering-conferences": ["engineering"],
  }[industrySlug] || [];
  const events = conferences.filter((event) => event.country?.toLowerCase() === countryName.toLowerCase() && topicMatch.some((topic) => event.category?.toLowerCase().includes(topic)) && isUpcomingConference(event));

  return (
    <>
      <SEO
        title={`${industryName} in ${countryName} 2026 | International Conferences`}
        description={`Discover upcoming ${industryName.toLowerCase()} in ${countryName} 2026. Explore global industry-focused conferences, networking opportunities, and professional events.`}
        canonical={canonicalUrl}
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.allconferencealerts.net/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": industryName,
              "item": `https://www.allconferencealerts.net/industry/${industrySlug}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": countryName,
              "item": canonicalUrl
            }
          ]
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">
          {industryName} in {countryName} 2026
        </h1>

        <p className="max-w-3xl text-gray-700 mb-8">
          Explore upcoming {industryName.toLowerCase()} in {countryName} for 2026.
          These conferences are designed for professionals, executives,
          researchers, entrepreneurs, and decision-makers seeking industry
          insights and global networking.
        </p>

        <p className="max-w-3xl text-gray-700 mb-10">
          {countryName} continues to host high-impact {industryName.toLowerCase()},
          supported by industry associations, academic institutions, and global
          organizations.
        </p>

        <ConferenceCards
          events={events}
          title={`${industryName} in ${countryName}`}
          description="Explore current event listings for this destination and professional field."
          emptyText="No future-dated event currently matches this field and country. Browse the wider directory to find other opportunities."
        />

        <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-slate-900">
          Who Should Attend?
        </h2>

        <ul className="list-disc ml-6 text-gray-700 mb-10">
          <li>Industry professionals and practitioners</li>
          <li>Business leaders and executives</li>
          <li>Researchers and consultants</li>
          <li>Startups and entrepreneurs</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Explore Related Pages
        </h2>

        <ul className="list-disc ml-6 text-primary font-medium">
          <li>
            <Link to={`/industry/${industrySlug}`}>
              {industryName} Worldwide
            </Link>
          </li>
          <li>
            <Link to={`/conferences/${country}`}>
              All Conferences in {countryName}
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}

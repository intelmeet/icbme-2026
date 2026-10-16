import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import ConferenceCards from "../components/ConferenceCards";
import { conferences } from "../data/conferences";
import { isUpcomingConference } from "../utils/conferenceUtils";

export default function Industry() {
  const { industrySlug } = useParams();

  const industryMap = {
    "business-conferences": {
      title: "Business & Management Conferences 2026",
      description:
        "Explore upcoming business and management conferences 2026 covering leadership, entrepreneurship, finance, marketing, strategy, and organizational development.",
    },
    "technology-conferences": {
      title: "Technology Conferences 2026",
      description:
        "Find upcoming technology conferences 2026 focusing on AI, data science, cloud computing, cybersecurity, software engineering, and emerging technologies.",
    },
    "medical-conferences": {
      title: "Medical & Healthcare Conferences 2026",
      description:
        "Browse upcoming medical and healthcare conferences 2026 covering clinical research, medicine, public health, healthcare innovation, and patient care.",
    },
    "engineering-conferences": {
      title: "Engineering Conferences 2026",
      description:
        "Discover upcoming engineering conferences 2026 across civil, mechanical, electrical, computer science, and interdisciplinary engineering domains.",
    },
  };

  const industry = industryMap[industrySlug];

  if (!industry) {
    return (
      <SEO
        title="Industry Page Not Found"
        description="The industry conference page you are looking for does not exist."
        robots="noindex,follow"
      />
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/industry/${industrySlug}`;
  const topicMatch = {
    "business-conferences": ["business", "economics", "finance"],
    "technology-conferences": ["computer science", "data science"],
    "medical-conferences": ["medical"],
    "engineering-conferences": ["engineering"],
  }[industrySlug] || [];
  const events = conferences.filter((event) => topicMatch.some((topic) => event.category?.toLowerCase().includes(topic)) && isUpcomingConference(event));

  return (
    <>
      <SEO
        title={`${industry.title} | International Conferences`}
        description={industry.description}
        canonical={canonicalUrl}
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.allconferencealerts.net/" },
            { "@type": "ListItem", position: 2, name: industry.title, item: canonicalUrl },
          ],
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{industry.title}</h1>

        <p className="max-w-4xl text-gray-700 mb-8">
          {industry.description} These international conferences bring together
          professionals, researchers, entrepreneurs, executives, and industry
          experts from across the world.
        </p>

        <ConferenceCards
          events={events}
          title={`Upcoming ${industry.title.toLowerCase()}`}
          description="Explore relevant listings with dates, locations and participation formats in one place."
          emptyText="There are no future-dated listings in this field in the current directory. Browse all conferences or revisit this page for new events."
        />

        <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-slate-900">
          Who Should Attend These Conferences?
        </h2>

        <ul className="list-disc ml-6 text-gray-700 mb-10">
          <li>Industry professionals and practitioners</li>
          <li>Business leaders and decision makers</li>
          <li>Researchers and academicians</li>
          <li>Startups and entrepreneurs</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Explore Conferences by Country
        </h2>

        <ul className="grid md:grid-cols-2 gap-3 text-primary font-medium">
          <li><Link to={`/industry/${industrySlug}/united-states`}>United States</Link></li>
          <li><Link to={`/industry/${industrySlug}/united-kingdom`}>United Kingdom</Link></li>
          <li><Link to={`/industry/${industrySlug}/germany`}>Germany</Link></li>
          <li><Link to={`/industry/${industrySlug}/canada`}>Canada</Link></li>
          <li><Link to={`/industry/${industrySlug}/australia`}>Australia</Link></li>
        </ul>
      </main>
    </>
  );
}

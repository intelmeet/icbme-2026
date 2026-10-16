import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import ConferenceCards from "../components/ConferenceCards";
import { conferences } from "../data/conferences";
import { isUpcomingConference } from "../utils/conferenceUtils";
import { formatLocationSlug, isRegionSlug, regions } from "../utils/locationNames";

export default function CategoryCountry() {
  const { categorySlug, country } = useParams();

  const countryName = formatLocationSlug(country);
  const region = regions[country.toLowerCase()];
  const isRegion = isRegionSlug(country);

  const categoryMap = {
    "environmental-conferences": "Environmental Conferences",
    "life-science-conferences": "Life Science Conferences",
    "engineering-conferences": "Engineering Conferences",
    "medical-conferences": "Medical Conferences",
  };

  const categoryName = categoryMap[categorySlug];

  if (!categoryName) {
    return (
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        robots="noindex,follow"
      />
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/${categorySlug}/${country}`;
  const categoryMatch = {
    "environmental-conferences": "environmental",
    "life-science-conferences": "life science",
    "engineering-conferences": "engineering",
    "medical-conferences": "medical",
  }[categorySlug];
  const events = conferences.filter((event) => {
    if (!isUpcomingConference(event) || !event.category?.toLowerCase().includes(categoryMatch)) return false;
    if (isRegion) return region.countries.some((name) => event.country?.toLowerCase() === name.toLowerCase());
    return event.country?.toLowerCase() === countryName.toLowerCase();
  });
  const categoryGuidance = {
    "environmental-conferences": "Explore research on climate science, conservation, sustainability, environmental policy, renewable energy and ecosystem management.",
    "life-science-conferences": "Explore research in biology, biotechnology, genetics, microbiology, biomedical science and interdisciplinary life-science research.",
    "engineering-conferences": "Explore civil, mechanical, electrical, industrial, software and interdisciplinary engineering research, including emerging technologies and applied methods.",
    "medical-conferences": "Explore clinical research, public health, medical education, healthcare systems, diagnostics and evidence-based practice.",
  }[categorySlug];

  return (
    <>
      <SEO
        title={`${categoryName} in ${countryName} ${new Date().getFullYear()} | Academic Events`}
        description={`Find listed ${categoryName.toLowerCase()} associated with ${countryName}. Compare available dates, topics and event formats, then verify venue and registration details with each official organizer.`}
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
              "name": categoryName,
              "item": `https://www.allconferencealerts.net/category/${categorySlug}`
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
          {categoryName} in {countryName} {new Date().getFullYear()}
        </h1>

        <p className="max-w-3xl text-gray-700 mb-6">
          Browse the available {categoryName.toLowerCase()} associated with {countryName}. Use the listings to compare event dates, subjects and participation formats; the official organizer remains the source of truth for venue, fees and submission deadlines.
        </p>
        <p className="max-w-3xl text-gray-700 mb-10">{categoryGuidance}</p>

        <ConferenceCards
          events={events}
          title={`${categoryName} in ${countryName}`}
          description="See the currently listed events that match this research area and destination."
          emptyText="No future-dated event currently matches both this topic and country. Explore the topic worldwide or browse all conferences."
        />

        <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-slate-900">
          Why Attend {categoryName} in {countryName}?
        </h2>

        <ul className="list-disc ml-6 text-gray-700 mb-10">
          <li>Check whether the event scope matches your research or professional work.</li>
          <li>Review submission deadlines, review processes and presentation formats.</li>
          <li>Verify organizers, fees, venue and publication details before registering.</li>
          <li>Compare in-person, virtual and hybrid attendance options where listed.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          Explore Related Pages
        </h2>

        <ul className="list-disc ml-6 text-primary font-medium">
          <li>
            <Link to={`/conferences/${country}`}>
              All Conferences in {countryName}
            </Link>
          </li>
          <li>
            <Link to={`/category/${categorySlug}`}>
              {categoryName} Worldwide
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}

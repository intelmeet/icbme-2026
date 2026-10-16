import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import ConferenceCards from "../components/ConferenceCards";
import { conferences } from "../data/conferences";
import { isUpcomingConference } from "../utils/conferenceUtils";

export default function Category() {
  const { slug } = useParams();

  const categoryMap = {
    "environmental-conferences": {
      title: "Environmental Conferences 2026",
      description:
        "Find upcoming environmental conferences 2026 focusing on climate change, sustainability, ecology, environmental engineering, and green technologies.",
      match: "environmental",
    },
    "life-science-conferences": {
      title: "Life Science Conferences 2026",
      description:
        "Explore upcoming life science conferences 2026 covering biology, biotechnology, medical sciences, genetics, and interdisciplinary life science research.",
      match: "life science",
    },
    "engineering-conferences": {
      title: "Engineering Conferences 2026",
      description:
        "Discover upcoming engineering conferences 2026 covering civil, mechanical, electrical, computer science, and emerging engineering technologies.",
      match: "engineering",
    },
    "medical-conferences": {
      title: "Medical Conferences 2026",
      description:
        "Browse upcoming medical conferences 2026 focusing on healthcare, clinical research, medicine, public health, and medical innovations.",
      match: "medical",
    },
  };

  const category = categoryMap[slug];

  if (!category) {
    return (
      <SEO
        title="Conference Category Not Found"
        description="The conference category you are looking for does not exist."
        robots="noindex,follow"
      />
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/category/${slug}`;
  const events = conferences.filter((event) => event.category?.toLowerCase().includes(category.match) && isUpcomingConference(event));

  return (
    <>
      <SEO
        title={`${category.title} | International Conferences`}
        description={category.description}
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
              "name": "Categories",
              "item": "https://www.allconferencealerts.net/category"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": category.title,
              "item": canonicalUrl
            }
          ]
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">
          {category.title}
        </h1>

        <p className="max-w-4xl text-gray-700 text-lg mb-10">
          {category.description} These international conferences bring together
          researchers, academicians, professionals, and industry experts to
          discuss recent advancements, research findings, and future directions.
        </p>

        <ConferenceCards
          events={events}
          title={`Upcoming ${category.title.toLowerCase()}`}
          description="Browse current listings, compare event dates and formats, and open a conference page for more information."
          emptyText="There are no future-dated listings in this topic in the current directory. Browse all events to explore other research areas."
        />

        <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-slate-900">
          Why Attend {category.title}?
        </h2>

        <p className="max-w-4xl text-gray-700 mb-10">
          Attending {category.title.toLowerCase()} provides opportunities to
          present research, publish academic papers, network with global experts,
          and collaborate on international research initiatives. These conferences
          are ideal for PhD scholars, faculty members, researchers, and industry
          professionals.
        </p>

        {/* CATEGORY × COUNTRY LINKS (HIGH-IMPACT SEO) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            {category.title} by Country
          </h2>

          <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
            <li>
              <Link
                to={`/${slug}/united-states`}
                className="seo-inline-link"
              >
                {category.title} in United States
              </Link>
            </li>
            <li>
              <Link
                to={`/${slug}/united-kingdom`}
                className="seo-inline-link"
              >
                {category.title} in United Kingdom
              </Link>
            </li>
            <li>
              <Link
                to={`/${slug}/germany`}
                className="seo-inline-link"
              >
                {category.title} in Germany
              </Link>
            </li>
            <li>
              <Link
                to={`/${slug}/japan`}
                className="seo-inline-link"
              >
                {category.title} in Japan
              </Link>
            </li>
            <li>
              <Link
                to={`/${slug}/canada`}
                className="seo-inline-link"
              >
                {category.title} in Canada
              </Link>
            </li>
            <li>
              <Link
                to={`/${slug}/australia`}
                className="seo-inline-link"
              >
                {category.title} in Australia
              </Link>
            </li>
          </ul>
        </section>

        {/* FALLBACK COUNTRY ARCHIVES */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            Browse All Conferences by Country
          </h2>

          <ul className="list-disc ml-6 text-primary font-medium">
            <li><Link to="/conferences/united-states">United States</Link></li>
            <li><Link to="/conferences/united-kingdom">United Kingdom</Link></li>
            <li><Link to="/conferences/germany">Germany</Link></li>
            <li><Link to="/conferences/japan">Japan</Link></li>
            <li><Link to="/conferences/canada">Canada</Link></li>
            <li><Link to="/conferences/australia">Australia</Link></li>
          </ul>
        </section>

        <section className="mt-16">
  <h2 className="text-2xl font-semibold mb-4">
    Latest {category.title} Insights
  </h2>

  <ul className="list-disc ml-6 text-primary font-medium">
    <li>
      <Link to={`/blog/${slug}-in-united-states-2026`}>
        {category.title} in USA 2026
      </Link>
    </li>
    <li>
      <Link to={`/blog/${slug}-in-germany-2026`}>
        {category.title} in Germany 2026
      </Link>
    </li>
  </ul>
</section>

      </main>
    </>
  );
}

import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import ConferenceCards from "../components/ConferenceCards";
import { conferences } from "../data/conferences";
import { isUpcomingConference } from "../utils/conferenceUtils";
import { formatLocationSlug, isRegionSlug, regions } from "../utils/locationNames";
import { blogs } from "../data/blogs";

export default function Country() {
  const { country } = useParams();
  const countryName = formatLocationSlug(country);
  const region = regions[country.toLowerCase()];
  const isRegion = isRegionSlug(country);
  const events = conferences.filter((event) => {
    if (!isUpcomingConference(event)) return false;
    if (isRegion) return region.countries.some((name) => event.country?.toLowerCase() === name.toLowerCase());
    return event.country?.toLowerCase() === countryName.toLowerCase();
  });
  const pageLabel = isRegion ? `Conferences in ${region.label}` : `Conferences in ${countryName}`;
  const intro = isRegion
    ? `Browse conference listings associated with ${region.label}. Use the event details to confirm each venue, date, submission deadline and attendance format with the official organizer.`
    : `Discover upcoming international conferences in ${countryName} across academic, scientific, engineering, medical, environmental and life-science fields. Review each listing's available dates, topics and participation details before registering.`;
  const countryBlogGuides = blogs.filter((blog) => blog.slug.endsWith(`-${country}`)).slice(0, 3);
  const fallbackBlogGuides = blogs.filter((blog) => [
    "upcoming-international-conferences-2026-complete-guide",
    "how-to-choose-the-right-international-conference-2026",
    "are-international-conferences-worth-attending-2026",
  ].includes(blog.slug));
  const relatedGuides = countryBlogGuides.length ? countryBlogGuides : fallbackBlogGuides;

  return (
    <>
      <SEO
        title={`${pageLabel} ${new Date().getFullYear()} | Academic & Research Events`}
        description={intro}
        canonical={`https://www.allconferencealerts.net/conferences/${country}`}
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
              "name": "Conferences",
              "item": "https://www.allconferencealerts.net/conferences"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": countryName,
              "item": `https://www.allconferencealerts.net/conferences/${country}`
            }
          ]
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">
          {isRegion ? `Upcoming Conferences in ${region.label}` : `Upcoming Conferences in ${countryName}`} {new Date().getFullYear()}
        </h1>

        <p className="text-gray-700 max-w-3xl mb-8">{intro}</p>

        <p className="text-gray-700 max-w-3xl mb-8">
          Compare subject areas, conference formats and event dates before choosing an event. Listings can change as organizers update their information; confirm final details on the official event website.
        </p>

        <p className="text-gray-700 max-w-3xl mb-10">
          Explore related listings such as{" "}
          <Link to={`/environmental-conferences/${country}`} className="seo-inline-link">
            environmental conferences in {countryName}
          </Link>{" "}
          and compare them with the wider directory before selecting an event.
        </p>

        <ConferenceCards
          events={events}
          title={`Upcoming conferences in ${countryName}`}
          description={`Review current conference listings in ${countryName}, including dates, formats and research areas.`}
          emptyText={`We do not currently have a future-dated listing for ${countryName} in the local directory. Check back later or browse all conferences.`}
        />

        <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-slate-900">
          How to choose a conference {isRegion ? `in ${region.label}` : `in ${countryName}`}
        </h2>

        <p className="text-gray-700 max-w-3xl">
          Check the organizer, scope, submission deadline, venue, registration fee and publication details. Treat the official organizer page as the source of truth for dates and participation requirements.
        </p>

        {/* CATEGORY × COUNTRY LINKS (HIGH-IMPACT SEO) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Popular Conference Categories in {countryName}
          </h2>

          <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
            <li>
              <Link
                to={`/environmental-conferences/${country}`}
                className="seo-inline-link"
              >
                Environmental Conferences in {countryName}
              </Link>
            </li>
            <li>
              <Link
                to={`/life-science-conferences/${country}`}
                className="seo-inline-link"
              >
                Life Science Conferences in {countryName}
              </Link>
            </li>
            <li>
              <Link
                to={`/engineering-conferences/${country}`}
                className="seo-inline-link"
              >
                Engineering Conferences in {countryName}
              </Link>
            </li>
            <li>
              <Link
                to={`/medical-conferences/${country}`}
                className="seo-inline-link"
              >
                Medical Conferences in {countryName}
              </Link>
            </li>
          </ul>
        </section>

        {/* FAQ SECTION (VISIBLE CONTENT ONLY — NO SCHEMA HERE) */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold">
                Are conferences in {countryName} open to international participants?
              </h3>
              <p className="text-gray-700">
                Participation rules vary by organizer and event. Check the official conference website for eligibility, visa-related information, attendance format and registration requirements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Do conferences in {countryName} provide certificates?
              </h3>
              <p className="text-gray-700">
                Certificate policies differ between organizers. Confirm whether a certificate is provided and what attendance or presentation requirements apply before registering.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
  <h2 className="text-2xl font-semibold mb-4">
    Latest Conference Guides for {countryName}
  </h2>

  <ul className="list-disc ml-6 text-primary font-medium">
    {relatedGuides.map((blog) => (
      <li key={blog.slug}><Link to={`/blog/${blog.slug}`}>{blog.title}</Link></li>
    ))}
  </ul>
</section>

      </main>
    </>
  );
}

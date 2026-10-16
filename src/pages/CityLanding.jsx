import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import SEO from "../seo/SEO";
import ConferenceCards from "../components/ConferenceCards";
import { conferences } from "../data/conferences";
import { isUpcomingConference } from "../utils/conferenceUtils";

const SITE = "https://www.allconferencealerts.net";

export default function CityLanding() {
  // Keep the historic /conferences-in-rome URL intact. The local dataset does
  // not reliably provide city-level venue data, so never label an event as
  // taking place in Rome unless the source record explicitly confirms it.
  const italyEvents = conferences.filter(
    (event) => event.country?.toLowerCase() === "italy" && isUpcomingConference(event),
  );
  const year = new Date().getFullYear();
  const canonical = `${SITE}/conferences-in-rome`;

  return (
    <>
      <SEO
        title={`Conferences in Rome ${year} | Academic Events & Research Meetings`}
        description={`Explore academic and professional conference opportunities in Rome, Italy for ${year}. Review available event details, dates and formats, and verify each venue with the official organizer before making travel plans.`}
        canonical={canonical}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Conferences in Rome ${year}`,
            description: `Conference discovery page for Rome, Italy. Verify venue details with each event organizer.`,
            url: canonical,
            about: { "@type": "City", name: "Rome", containedInPlace: { "@type": "Country", name: "Italy" } },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Conferences in Rome", item: canonical },
            ],
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-teal-800">Home</Link><span className="mx-2">/</span><span aria-current="page">Conferences in Rome</span>
        </nav>
        <div className="max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-900"><FiMapPin aria-hidden="true" /> Rome, Italy</div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Conferences in Rome {year}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Use this page to explore academic and professional conference opportunities associated with Rome and Italy. Event locations can change, so check the organizer’s official event page for the confirmed venue, dates, registration details and participation format before booking travel.</p>
        </div>
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="rome-checklist-title">
          <h2 id="rome-checklist-title" className="text-xl font-bold text-slate-900">Before registering for a conference in Rome</h2>
          <ul className="mt-4 grid gap-3 text-slate-700 sm:grid-cols-2">
            <li className="rounded-xl bg-slate-50 p-4">Confirm the venue and event dates with the official organizer.</li>
            <li className="rounded-xl bg-slate-50 p-4">Review the submission deadline and presentation requirements.</li>
            <li className="rounded-xl bg-slate-50 p-4">Check whether attendance is in-person, virtual or hybrid.</li>
            <li className="rounded-xl bg-slate-50 p-4">Verify registration fees, cancellation terms and publication claims.</li>
          </ul>
        </section>
        {italyEvents.length > 0 ? (
          <section className="mt-12">
            <ConferenceCards events={italyEvents} title="Upcoming conferences listed in Italy" description="These are Italy-wide listings; a Rome venue is not implied unless the event details explicitly name Rome." emptyText="No upcoming Italy listings are currently available." />
          </section>
        ) : (
          <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <h2 className="font-bold">No verified Rome-specific listing is available in the current directory</h2>
            <p className="mt-2 text-sm leading-6">We avoid assigning a city venue to an event unless the available event information confirms it. Browse the wider directory and verify location details with organizers.</p>
          </section>
        )}
        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link to="/conferences/italy" className="group rounded-2xl border border-slate-200 p-5 transition hover:border-teal-300 hover:shadow-md"><span className="font-bold text-slate-900">Conferences in Italy</span><span className="mt-2 flex items-center gap-2 text-sm text-teal-800">Browse country listings <FiArrowRight aria-hidden="true" /></span></Link>
          <Link to="/upcoming-conferences" className="group rounded-2xl border border-slate-200 p-5 transition hover:border-teal-300 hover:shadow-md"><span className="font-bold text-slate-900">Upcoming conferences worldwide</span><span className="mt-2 flex items-center gap-2 text-sm text-teal-800">Explore all listings <FiArrowRight aria-hidden="true" /></span></Link>
        </section>
      </main>
    </>
  );
}

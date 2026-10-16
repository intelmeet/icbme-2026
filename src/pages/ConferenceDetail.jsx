import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import EventSchema from "../seo/EventSchema";
import { conferenceDetails } from "../data/conferenceDetails";

export default function ConferenceDetail() {
  const { slug } = useParams();

  const conference = conferenceDetails.find(
    (conf) => conf.slug === slug
  );

  if (!conference) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-2xl font-semibold">
          Conference details not found
        </h1>
      </main>
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/conference/${slug}`;

  return (
    <>
      {/* SEO */}
      <SEO
        title={`${conference.title} | International Conference`}
        description={conference.description}
        canonical={canonicalUrl}
      />

      {/* EVENT SCHEMA */}
      <EventSchema
        name={conference.title}
        startDate={conference.startDate}
        endDate={conference.endDate}
        url={canonicalUrl}
        location={conference.city}
        organizer={conference.organizer}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4">
          {conference.title}
        </h1>

        {/* META */}
        <p className="text-gray-600 mb-6">
          <strong>Date:</strong> {conference.date} <br />
          <strong>Mode:</strong> {conference.mode} <br />
          <strong>Location:</strong> {conference.country}
        </p>

        {/* POSTER */}
        {conference.poster && (
          <img
            src={conference.poster}
            alt={`${conference.title} Poster`}
            className="w-full max-w-3xl rounded-xl mb-10"
          />
        )}

        {/* DESCRIPTION */}
        <p className="text-lg text-gray-700 mb-10">
          {conference.description}
        </p>

        {/* WHO SHOULD ATTEND */}
        <h2 className="text-2xl font-semibold mb-4">
          Who Should Attend?
        </h2>
        <ul className="list-disc ml-6 mb-8 text-gray-700">
          {conference.whoShouldAttend.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        {/* CALL FOR PAPERS */}
        <h2 className="text-2xl font-semibold mb-4">
          Call for Papers
        </h2>
        <p className="text-gray-700 mb-8">
          {conference.callForPapers}
        </p>

        {/* TOPICS */}
        <h2 className="text-2xl font-semibold mb-4">
          Topics Covered
        </h2>
        <ul className="list-disc ml-6 mb-10 text-gray-700">
          {conference.topics.map((topic, i) => (
            <li key={i}>{topic}</li>
          ))}
        </ul>

        {/* IMPORTANT DATES */}
        <h2 className="text-2xl font-semibold mb-4">
          Important Dates
        </h2>
        <ul className="mb-10 text-gray-700">
          <li><strong>Abstract Deadline:</strong> {conference.importantDates.abstractDeadline}</li>
          <li><strong>Full Paper Deadline:</strong> {conference.importantDates.fullPaperDeadline}</li>
          <li><strong>Registration Deadline:</strong> {conference.importantDates.registrationDeadline}</li>
        </ul>

        {/* CONTACT */}
        <h2 className="text-2xl font-semibold mb-4">
          Contact Information
        </h2>
        <p className="text-gray-700">
          Email:{" "}
          <a
            href={`mailto:${conference.contactEmail}`}
            className="text-primary font-medium"
          >
            {conference.contactEmail}
          </a>
        </p>

        {/* INTERNAL LINKS */}
        <div className="mt-10">
          <Link
            to="/upcoming-conferences"
            className="text-primary font-medium"
          >
            ← Back to Upcoming Conferences
          </Link>
        </div>
      </main>
    </>
  );
}

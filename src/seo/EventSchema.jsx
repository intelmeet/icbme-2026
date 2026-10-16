import { Helmet } from "./Helmet";

const SITE_URL = "https://www.allconferencealerts.net";

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

export default function EventSchema({
  name,
  description,
  startDate,
  endDate,
  url,
  location,
  organizer,
  officialUrl,
  image,
  mode = "Virtual",
}) {
  if (!name || !isIsoDate(startDate)) return null;

  const attendanceMode = /virtual|online/i.test(mode)
    ? "https://schema.org/OnlineEventAttendanceMode"
    : /hybrid/i.test(mode)
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode";
  const start = new Date(`${startDate}T00:00:00Z`);
  const completed = start.getTime() < new Date().setUTCHours(0, 0, 0, 0);
  const eventLocation = /virtual|online/i.test(mode)
    ? { "@type": "VirtualLocation", url: officialUrl || url || SITE_URL }
    : {
        "@type": "Place",
        name: location || "Venue to be confirmed",
        address: { "@type": "PostalAddress", addressCountry: location || undefined },
      };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    ...(image ? { image: [image] } : {}),
    ...(description ? { description: String(description).slice(0, 5000) } : {}),
    startDate: `${startDate}T00:00:00Z`,
    ...(isIsoDate(endDate) && endDate >= startDate ? { endDate: `${endDate}T23:59:59Z` } : {}),
    eventAttendanceMode: attendanceMode,
    eventStatus: completed ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
    location: eventLocation,
    ...(organizer ? { organizer: { "@type": "Organization", name: organizer } } : {}),
    url: url || SITE_URL,
    inLanguage: "en",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    </Helmet>
  );
}

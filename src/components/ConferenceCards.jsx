import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiMapPin, FiMonitor, FiSearch } from "react-icons/fi";

export default function ConferenceCards({ events = [], title = "Upcoming events", description, emptyText }) {
  return (
    <section className="mt-10" aria-label={title}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.17em] text-teal-700">DISCOVER EVENTS</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
        </div>
        <Link to="/upcoming-conferences" className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-950">All conferences <FiArrowRight /></Link>
      </div>
      {events.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article key={event.slug} className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-800">{event.category || "Academic"}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{event.mode || "Event"}</span>
              </div>
              <h3 className="text-base font-bold leading-6 tracking-tight text-slate-900 group-hover:text-teal-800"><Link to={`/conference/${event.slug}`}>{event.title}</Link></h3>
              <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                <p className="flex items-start gap-2"><FiCalendar className="mt-0.5 shrink-0 text-teal-700" /><span>{event.date || "Date to be announced"}</span></p>
                <p className="flex items-start gap-2"><FiMapPin className="mt-0.5 shrink-0 text-teal-700" /><span>{event.country || "International"}</span></p>
                <p className="flex items-start gap-2"><FiMonitor className="mt-0.5 shrink-0 text-teal-700" /><span>{event.mode || "Check event details"}</span></p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-5">
                <span className="text-[11px] text-slate-400">Event information</span>
                <Link to={`/conference/${event.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 transition group-hover:gap-3">View details <FiArrowRight /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-xl text-teal-800"><FiSearch /></span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">No upcoming listings in this selection yet</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{emptyText || "Try the full conference directory to explore other topics, destinations and dates."}</p>
          <Link to="/upcoming-conferences" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800">Browse all conferences <FiArrowRight /></Link>
        </div>
      )}
    </section>
  );
}

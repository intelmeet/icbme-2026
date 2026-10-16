import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiChevronLeft, FiChevronRight, FiMapPin, FiMonitor, FiSearch, FiSliders, FiHeart } from "react-icons/fi";
import { getSavedConferenceSlugs, toggleSavedConference } from "../utils/savedConferences";
import SEO from "../seo/SEO";
import { conferences } from "../data/conferences";

const PER_PAGE = 9;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const COUNTRIES = [...new Set(conferences.map((conf) => conf.country).filter(Boolean))].sort();
const TOPICS = [...new Set(conferences.map((conf) => conf.category).filter(Boolean))].sort();

function setParam(searchParams, key, value) {
  const next = new URLSearchParams(searchParams);
  if (value) next.set(key, value);
  else next.delete(key);
  next.delete("page");
  return next;
}

export default function ConferenceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedSlugs, setSavedSlugs] = useState([]);
  useEffect(() => {
    const refresh = () => setSavedSlugs(getSavedConferenceSlugs());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("aca-saved-conferences-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("aca-saved-conferences-updated", refresh);
    };
  }, []);
  function toggleSaved(slug) { setSavedSlugs(toggleSavedConference(slug)); }
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedCountry = searchParams.get("country") || "";
  const selectedMonth = searchParams.get("month") || "";

  const filteredConferences = useMemo(() => conferences.filter((conf) => {
    const searchable = `${conf.title} ${conf.country} ${conf.mode} ${conf.category}`.toLowerCase();
    const textMatch = searchable.includes(searchQuery.trim().toLowerCase());
    const normalizedCategory = selectedCategory.toLowerCase().replace(/-conferences?$/, "").replace(/-/g, " ");
    const categoryMatch = !selectedCategory || conf.category?.toLowerCase().includes(normalizedCategory) || normalizedCategory.includes(conf.category?.toLowerCase() || "");
    const countryMatch = !selectedCountry || conf.country?.toLowerCase() === selectedCountry.toLowerCase();
    const monthMatch = !selectedMonth || conf.date?.toLowerCase().includes(selectedMonth.toLowerCase());
    return textMatch && categoryMatch && countryMatch && monthMatch;
  }), [searchQuery, selectedCategory, selectedCountry, selectedMonth]);

  const totalPages = Math.max(1, Math.ceil(filteredConferences.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredConferences.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const baseCanonical = "https://www.allconferencealerts.net/upcoming-conferences";
  const hasFilters = Boolean(searchQuery || selectedCategory || selectedCountry || selectedMonth);

  function changePage(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage > 1) next.set("page", String(nextPage));
    else next.delete("page");
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <SEO
        title="Upcoming International Conferences 2026–2027 | Search by Topic & Country"
        description="Discover upcoming international conferences by academic topic, country and month. Compare dates and event details across engineering, medical, technology, business and research fields."
        canonical={baseCanonical}
        robots={currentPage === 1 && !hasFilters ? "index,follow,max-image-preview:large" : "noindex,follow"}
      />

      <main className="min-h-screen bg-slate-50 pb-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
          <div aria-hidden="true" className="absolute -right-24 -top-36 h-96 w-96 rounded-full border border-white/10 shadow-[0_0_0_45px_rgba(255,255,255,.025),0_0_0_90px_rgba(255,255,255,.02)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-300"><Link to="/" className="hover:text-white">Home</Link><span className="mx-2">/</span><span className="text-white">Conferences</span></nav>
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-teal-100"><FiCalendar /> Global conference directory</p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Find your next <span className="text-teal-300">conference</span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Explore academic and professional events by research field, destination and month. Review each listing before following the organizer’s official details.</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Filter conferences">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><FiSliders className="text-teal-700" /> Refine your search</div>
            <form onSubmit={(event) => event.preventDefault()} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="sm:col-span-2 lg:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Keyword</span>
                <span className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/10"><FiSearch className="shrink-0 text-slate-400" /><input aria-label="Search by keyword" value={searchQuery} onChange={(event) => setSearchParams(setParam(searchParams, "search", event.target.value), { replace: true })} placeholder="Conference, subject or keyword" className="w-full min-w-0 border-0 bg-transparent py-3 text-sm text-slate-900 outline-none focus:ring-0" /></span>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Country</span>
                <select value={selectedCountry} onChange={(event) => setSearchParams(setParam(searchParams, "country", event.target.value), { replace: true })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"><option value="">All countries</option>{COUNTRIES.map((country) => <option key={country}>{country}</option>)}</select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Topic</span>
                <select value={selectedCategory} onChange={(event) => setSearchParams(setParam(searchParams, "category", event.target.value), { replace: true })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"><option value="">All topics</option>{TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Month</span>
                <select value={selectedMonth} onChange={(event) => setSearchParams(setParam(searchParams, "month", event.target.value), { replace: true })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"><option value="">Any month</option>{MONTHS.map((month) => <option key={month}>{month}</option>)}</select>
              </label>
            </form>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600"><strong className="text-slate-900">{filteredConferences.length}</strong> {filteredConferences.length === 1 ? "conference" : "conferences"} found{hasFilters ? " for your filters" : " in the directory"}</p>
              {hasFilters && <button type="button" onClick={() => setSearchParams({})} className="text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950">Clear all filters</button>}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-9 sm:px-6 lg:px-8">
          {!hasFilters && <div className="mb-7 max-w-3xl"><h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Upcoming international conferences</h2><p className="mt-2 text-sm leading-6 text-slate-600">Browse current listings across academic and professional disciplines. Use the filters above to narrow results by destination, topic or month.</p></div>}
          {paginated.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-2xl text-teal-700"><FiSearch /></span>
              <h2 className="mt-4 text-lg font-bold text-slate-900">No matching conferences found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Try a broader keyword or clear one of your filters to see more events.</p>
              <button type="button" onClick={() => setSearchParams({})} className="mt-5 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800">Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginated.map((conf, index) => (
                <article key={conf.slug} className="group relative flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3 pr-9">
                    <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-800">{conf.category || "Academic"}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{conf.mode || "Event"}</span>
                  </div>
                  <button type="button" className={`v10-list-save ${savedSlugs.includes(conf.slug) ? "is-saved" : ""}`} onClick={() => toggleSaved(conf.slug)} aria-label={savedSlugs.includes(conf.slug) ? `Remove ${conf.title} from saved conferences` : `Save ${conf.title}`} aria-pressed={savedSlugs.includes(conf.slug)} title={savedSlugs.includes(conf.slug) ? "Remove from saved" : "Save conference"}><FiHeart /></button>
                  <h2 className="text-base font-bold leading-6 tracking-tight text-slate-900 transition group-hover:text-teal-800"><Link to={`/conference/${conf.slug}`}>{conf.title}</Link></h2>
                  <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                    <p className="flex items-start gap-2"><FiCalendar className="mt-0.5 shrink-0 text-teal-700" /><span>{conf.date || "Date to be announced"}</span></p>
                    <p className="flex items-start gap-2"><FiMapPin className="mt-0.5 shrink-0 text-teal-700" /><span>{conf.country || "International"}</span></p>
                    <p className="flex items-start gap-2"><FiMonitor className="mt-0.5 shrink-0 text-teal-700" /><span>{conf.mode || "Check event details"}</span></p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-5">
                    <span className="text-[11px] text-slate-400">Listing {String((currentPage - 1) * PER_PAGE + index + 1).padStart(2, "0")}</span>
                    <Link to={`/conference/${conf.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 transition group-hover:gap-3">View details <FiArrowRight /></Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Conference results pages">
              <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><FiChevronLeft /> Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => <button key={number} type="button" aria-current={number === currentPage ? "page" : undefined} onClick={() => changePage(number)} className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-bold ${number === currentPage ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800"}`}>{number}</button>)}
              <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Next <FiChevronRight /></button>
            </nav>
          )}
        </section>
      </main>
    </>
  );
}

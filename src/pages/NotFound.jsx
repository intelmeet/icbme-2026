import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import SEO from "../seo/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found | AllConferenceAlerts"
        description="We could not find that page. Explore upcoming conferences by topic, country or month on AllConferenceAlerts."
        robots="noindex,follow"
      />
      <main className="grid min-h-[65vh] place-items-center bg-slate-50 px-4 py-16">
        <div className="max-w-xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-2xl text-teal-800"><FiSearch /></span>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-teal-800">404 · Page not found</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">This page isn’t where the research leads.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">The address may have changed or the page may no longer be available. Head back to the conference directory to keep exploring.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"><FiArrowLeft /> Home</Link>
            <Link to="/upcoming-conferences" className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"><FiSearch /> Explore conferences</Link>
          </div>
        </div>
      </main>
    </>
  );
}

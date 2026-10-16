import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight, FiCalendar, FiCheckCircle, FiClock, FiGlobe, FiMail, FiMapPin, FiMonitor, FiShare2, FiUsers, FiHeart } from "react-icons/fi";
import SEO from "../seo/SEO";
import { getSavedConferenceSlugs, toggleSavedConference } from "../utils/savedConferences";
import EventSchema from "../seo/EventSchema";
import { conferenceDetails } from "../data/conferenceDetails";
import { conferences } from "../data/conferences";

const categoryThemes = {
  "Computer Science": { label: "Computing & AI", accent: "from-cyan-300 via-teal-400 to-blue-600", mark: "AI" },
  Education: { label: "Education & Learning", accent: "from-amber-200 via-orange-300 to-rose-500", mark: "ED" },
  Environmental: { label: "Climate & Sustainability", accent: "from-lime-200 via-emerald-400 to-teal-700", mark: "ES" },
  "Physical Sciences": { label: "Physical Sciences", accent: "from-violet-300 via-indigo-400 to-blue-700", mark: "PS" },
  Medical: { label: "Health & Medicine", accent: "from-rose-200 via-pink-400 to-red-600", mark: "MH" },
  Law: { label: "Law & Public Policy", accent: "from-slate-300 via-slate-500 to-indigo-800", mark: "LP" },
  "Arts & Humanities": { label: "Arts & Humanities", accent: "from-fuchsia-200 via-purple-400 to-indigo-700", mark: "AH" },
};

function formatDate(value) {
  if (!value) return "To be announced";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", {
    day: "numeric", month: "long", year: "numeric",
  }).format(date);
}

function ConferenceArtwork({ conference }) {
  const theme = categoryThemes[conference.category] || {
    label: conference.category || "Academic Conference",
    accent: "from-teal-200 via-cyan-500 to-slate-900",
    mark: "ACA",
  };
  return (
    <div className={`relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${theme.accent} min-h-[300px] sm:min-h-[390px] text-white shadow-2xl`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-30">
        <div className="absolute -right-12 -top-16 h-72 w-72 rounded-full border border-white/70" />
        <div className="absolute -right-2 -top-6 h-52 w-52 rounded-full border border-white/60" />
        <div className="absolute right-12 top-10 h-28 w-28 rounded-full border border-white/50" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full border border-white/50" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.45) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      </div>
      <div className="relative flex min-h-[300px] sm:min-h-[390px] flex-col justify-between p-7 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[.2em] backdrop-blur">{theme.label}</span>
          <span className="text-xs font-semibold tracking-[.16em] text-white/80">ALLCONFERENCEALERTS</span>
        </div>
        <div className="max-w-2xl py-8">
          <div className="mb-5 text-6xl font-black tracking-[-.08em] text-white/30 sm:text-8xl">{theme.mark}</div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[.24em] text-white/80">International research exchange</p>
          <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{conference.title}</h2>
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-white/90"><FiCalendar /> {conference.date || formatDate(conference.startDate)}</p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-white/30 pt-4">
          <span className="text-sm text-white/85">Ideas • Research • Collaboration</span>
          <span className="text-xs font-bold tracking-widest">ACA / 2026</span>
        </div>
      </div>
    </div>
  );
}

function RegistrationForm({ conference }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("subject", `Conference interest: ${conference.title}`);
    formData.set("conference_name", conference.title);
    formData.set("conference_slug", conference.slug);
    formData.set("page_url", window.location.href);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "We could not submit your request. Please try again.");
      setStatus("success");
      form.reset();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again or email our support team.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="register-interest" className="scroll-mt-28 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-6 py-7 text-white sm:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-100"><FiMail /> Conference updates</div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Register your interest</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Receive updates and participation information related to this conference. Your details will be used to respond to this request.</p>
      </div>
      <div className="p-6 sm:p-8">
        {status === "success" ? (
          <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
            <FiCheckCircle className="mb-3 text-2xl" />
            <h3 className="font-bold">Thank you for your interest.</h3>
            <p className="mt-1 text-sm">Your request has been submitted successfully.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold underline underline-offset-4">Submit another response</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="access_key" value="801d0d9e-5afc-4868-aedf-43fd4365f37d" />
            <input type="hidden" name="from_name" value="AllConferenceAlerts.net" />
            <input type="checkbox" name="botcheck" className="hidden" tabIndex="-1" autoComplete="off" />
            <div>
              <label htmlFor={`full-name-${conference.slug}`} className="mb-2 block text-sm font-semibold text-slate-800">Full name <span className="text-rose-600">*</span></label>
              <input id={`full-name-${conference.slug}`} name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} placeholder="Enter your full name" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10" />
            </div>
            <div>
              <label htmlFor={`email-${conference.slug}`} className="mb-2 block text-sm font-semibold text-slate-800">Email address <span className="text-rose-600">*</span></label>
              <input id={`email-${conference.slug}`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10" />
            </div>
            <div>
              <label htmlFor={`role-${conference.slug}`} className="mb-2 block text-sm font-semibold text-slate-800">I am a <span className="font-normal text-slate-500">(optional)</span></label>
              <select id={`role-${conference.slug}`} name="participant_type" defaultValue="" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10">
                <option value="">Choose your role</option>
                <option>Researcher / Academic</option>
                <option>PhD / Postgraduate student</option>
                <option>Industry professional</option>
                <option>Conference organizer</option>
                <option>Other</option>
              </select>
            </div>
            <label className="flex items-start gap-3 text-sm leading-5 text-slate-600">
              <input type="checkbox" name="consent" value="yes" required className="mt-1 h-4 w-4 rounded border-slate-300 accent-teal-700" />
              <span>I agree to be contacted about this conference and have read the website's <Link to="/privacy-policy" className="font-semibold text-teal-800 underline underline-offset-2">Privacy Policy</Link>.</span>
            </label>
            {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-4 font-bold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/20 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {busy ? "Submitting…" : "Register interest"} {!busy && <FiArrowUpRight />}
            </button>
            <p className="text-xs leading-5 text-slate-500">Submitting this form expresses interest only. It does not confirm conference registration or payment.</p>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Conference() {
  const { slug } = useParams();
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
  const isSaved = savedSlugs.includes(slug);
  const handleSave = () => setSavedSlugs(toggleSavedConference(slug));
  const detailedConference = conferenceDetails.find((item) => item.slug === slug);
  const directoryConference = conferences.find((item) => item.slug === slug);
  // Preserve already-published conference URLs even when the richer detail
  // record is temporarily unavailable. Only use facts present in the directory
  // record; do not invent dates, venue, organizer, registration links or topics.
  const conference = detailedConference || (directoryConference ? {
    ...directoryConference,
    description: `This directory listing identifies the ${directoryConference.title} and the basic event details currently available. Dates, venue, submission requirements, registration fees and publication information should be confirmed directly with the official organizer before making plans.`,
    topics: [],
    whoShouldAttend: [],
  } : undefined);
  const related = useMemo(() => conferences.filter((item) => item.slug !== slug && item.category === conference?.category).slice(0, 3), [slug, conference]);
  if (!conference) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-24">
        <SEO title="Conference not found | AllConferenceAlerts" description="The requested conference could not be found." robots="noindex,follow" />
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-slate-900">Conference details unavailable</h1>
          <p className="mt-3 text-slate-600">This conference may have moved or its details may be under review.</p>
          <Link to="/upcoming-conferences" className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-800"><FiArrowLeft /> Browse upcoming conferences</Link>
        </div>
      </main>
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/conference/${slug}`;
  const startDate = conference.startDate || "";
  const endDate = conference.endDate || startDate;
  const topicSlug = (conference.category || "academic").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const description = (conference.description || "").slice(0, 300);
  const theme = categoryThemes[conference.category] || { label: conference.category || "Academic Conference" };

  return (
    <>
      <SEO
        title={`${conference.title} | Dates, Topics & Registration`}
        description={description}
        canonical={canonicalUrl}
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.allconferencealerts.net/" },
            { "@type": "ListItem", position: 2, name: "Upcoming Conferences", item: "https://www.allconferencealerts.net/upcoming-conferences" },
            { "@type": "ListItem", position: 3, name: conference.title, item: canonicalUrl },
          ],
        }}
      />
      <EventSchema name={conference.title} description={conference.description} startDate={startDate} endDate={endDate} url={canonicalUrl} officialUrl={conference.website} image={conference.poster ? `https://www.allconferencealerts.net${conference.poster}` : undefined} location={conference.country} organizer={conference.organizer} mode={conference.mode || "Virtual"} />
      <main className="min-h-screen bg-[#f7f9fc] pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="transition hover:text-teal-800">Home</Link><span aria-hidden="true">/</span>
            <Link to="/upcoming-conferences" className="transition hover:text-teal-800">Upcoming conferences</Link><span aria-hidden="true">/</span>
            <Link to={`/category/${topicSlug}`} className="max-w-[220px] truncate transition hover:text-teal-800">{conference.category}</Link><span aria-hidden="true">/</span>
            <span aria-current="page" className="max-w-[260px] truncate font-medium text-slate-800">{conference.title}</span>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">{conference.category}</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{conference.mode || "Online / Hybrid — see event details"}</span>
                <button type="button" className={`v10-detail-save ${isSaved ? "is-saved" : ""}`} onClick={handleSave} aria-pressed={isSaved}>{isSaved ? <FiHeart /> : <FiHeart />} {isSaved ? "Saved to shortlist" : "Save conference"}</button>
              </div>
              <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl lg:text-5xl">{conference.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{conference.description}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="mt-0.5 text-teal-700"><FiCalendar size={20} /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Conference date</p><p className="mt-1 font-bold text-slate-900">{conference.date || formatDate(startDate)}</p></div></div>
                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="mt-0.5 text-teal-700"><FiGlobe size={20} /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</p><p className="mt-1 font-bold text-slate-900">{conference.country || "Online"}</p></div></div>
                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="mt-0.5 text-teal-700"><FiUsers size={20} /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Organized by</p><p className="mt-1 font-bold text-slate-900">{conference.organizer || "Conference organizing committee"}</p></div></div>
              </div>

              <div className="mt-8">
                {conference.poster ? <img src={conference.poster} alt={`${conference.title} conference poster`} width="1200" height="800" fetchpriority="high" className="max-h-[560px] w-full rounded-[1.75rem] border border-slate-200 bg-white object-contain shadow-xl" /> : <ConferenceArtwork conference={conference} />}
              </div>

              <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-700">About the conference</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">A space for research, ideas and collaboration</h2>
                <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{conference.description}</p>
                {conference.callForPapers && <><h3 className="mt-8 text-xl font-bold text-slate-900">Call for papers</h3><p className="mt-3 leading-8 text-slate-600">{conference.callForPapers}</p></>}
              </section>

              {conference.topics?.length > 0 && <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-700">Research scope</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Topics and areas of interest</h2>
                <p className="mt-2 leading-7 text-slate-600">Explore themes relevant to {conference.category} researchers and practitioners. Check the official event information before submitting your work.</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {conference.topics.map((topic) => <li key={topic} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"><FiCheckCircle className="mt-1 shrink-0 text-teal-700" />{topic}</li>)}
                </ul>
              </section>}

              {conference.whoShouldAttend?.length > 0 && <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-slate-950">Who should attend?</h2>
                <p className="mt-2 leading-7 text-slate-600">This event may be relevant to the following audience groups:</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {conference.whoShouldAttend.map((person) => <li key={person} className="flex items-start gap-3 text-slate-700"><FiCheckCircle className="mt-1 shrink-0 text-teal-700" /><span>{person}</span></li>)}
                </ul>
              </section>}

              <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-slate-950">Important dates</h2>
                <p className="mt-2 leading-7 text-slate-600">Review the dates below and confirm deadlines with the organizer before making travel or submission arrangements.</p>
                <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between gap-4 p-4"><span className="flex items-center gap-2 text-sm text-slate-600"><FiCalendar /> Conference date</span><strong className="text-right text-sm text-slate-900">{conference.date || formatDate(startDate)}</strong></div>
                  {conference.importantDates?.abstractDeadline && <div className="flex items-center justify-between gap-4 p-4"><span className="flex items-center gap-2 text-sm text-slate-600"><FiClock /> Abstract deadline</span><strong className="text-right text-sm text-slate-900">{conference.importantDates.abstractDeadline}</strong></div>}
                  {conference.importantDates?.fullPaperDeadline && <div className="flex items-center justify-between gap-4 p-4"><span className="flex items-center gap-2 text-sm text-slate-600"><FiClock /> Full paper deadline</span><strong className="text-right text-sm text-slate-900">{conference.importantDates.fullPaperDeadline}</strong></div>}
                  {conference.importantDates?.registrationDeadline && <div className="flex items-center justify-between gap-4 p-4"><span className="flex items-center gap-2 text-sm text-slate-600"><FiClock /> Registration deadline</span><strong className="text-right text-sm text-slate-900">{conference.importantDates.registrationDeadline}</strong></div>}
                </div>
              </section>

              <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-slate-950">Organizer and contact</h2>
                <p className="mt-3 leading-7 text-slate-600">For event-specific details, submission instructions, or participation questions, contact the organizer using the information below.</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <a href={`mailto:${conference.contactEmail || "support@intelmeetglobal.com"}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-teal-700 hover:text-teal-800"><FiMail /> {conference.contactEmail || "support@intelmeetglobal.com"}</a>
                  {conference.website && <a href={conference.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">Official event website <FiArrowUpRight /></a>}
                </div>
              </section>
              <div className="mt-8"><RegistrationForm conference={conference} /></div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-700">Plan your participation</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">Interested in this conference?</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Send your interest to receive relevant updates. Confirm all details with the organizer before submitting a paper or making payment.</p>
                <a href="#register-interest" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800">Register your interest <FiArrowUpRight /></a>
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                  <p className="flex items-start gap-3"><FiCalendar className="mt-0.5 shrink-0 text-teal-700" /><span><strong className="block text-slate-900">Date</strong>{conference.date || formatDate(startDate)}</span></p>
                  <p className="flex items-start gap-3"><FiMapPin className="mt-0.5 shrink-0 text-teal-700" /><span><strong className="block text-slate-900">Location</strong>{conference.country || "Online event"}</span></p>
                  <p className="flex items-start gap-3"><FiMonitor className="mt-0.5 shrink-0 text-teal-700" /><span><strong className="block text-slate-900">Format</strong>{conference.mode || "See organizer details"}</span></p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-300">Explore more</p>
                <h2 className="mt-2 text-xl font-bold">Find your next research event</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">Browse conferences across academic disciplines and locations.</p>
                <Link to="/upcoming-conferences" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-200 hover:text-white">Browse all conferences <FiArrowUpRight /></Link>
              </div>
              {related.length > 0 && <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold text-slate-950">Related conferences</h2>
                <div className="mt-4 space-y-4">
                  {related.map((item) => <Link key={item.slug} to={`/conference/${item.slug}`} className="group block border-b border-slate-100 pb-4 last:border-0 last:pb-0"><span className="text-sm font-semibold leading-6 text-slate-800 group-hover:text-teal-800">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{item.date} · {item.country}</span></Link>)}
                </div>
              </div>}
            </aside>
          </div>
          <div className="mt-12 border-t border-slate-200 pt-6"><Link to="/upcoming-conferences" className="inline-flex items-center gap-2 font-semibold text-teal-800 hover:text-teal-950"><FiArrowLeft /> Back to upcoming conferences</Link></div>
        </div>
      </main>
    </>
  );
}

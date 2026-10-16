import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight, FaCalendarAlt, FaCheckCircle, FaGlobeAmericas,
  FaGraduationCap, FaLaptopCode, FaMicroscope, FaSearch, FaStethoscope, FaLeaf,
  FaBriefcase, FaBookOpen, FaMapMarkerAlt, FaRegCalendarAlt, FaUsers,
  FaFilter, FaNewspaper, FaHeart, FaRegHeart, FaBolt, FaFlask,
  FaBookmark, FaClock, FaShieldAlt, FaBalanceScale, FaTimes,
} from "react-icons/fa";
import SEO from "../seo/SEO";
import { conferences } from "../data/conferences";
import { blogPreviews } from "../data/blogPreviews";
import { getSavedConferenceSlugs, toggleSavedConference } from "../utils/savedConferences";
import researchGlobe from "../assets/illustrations/global-research.svg";

const fields = [
  { title: "Engineering", description: "Build, test and share what comes next.", icon: FaLaptopCode, href: "/category/engineering-conferences", tone: "mint", keywords: ["engineering", "civil", "mechanical", "electrical"] },
  { title: "Medical & Healthcare", description: "Clinical practice, health and discovery.", icon: FaStethoscope, href: "/category/medical-conferences", tone: "rose", keywords: ["medical", "health", "medicine", "clinical"] },
  { title: "Life Sciences", description: "Biology, biotechnology and living systems.", icon: FaMicroscope, href: "/category/life-science-conferences", tone: "violet", keywords: ["life science", "biology", "biotechnology"] },
  { title: "Environment", description: "Climate, sustainability and our planet.", icon: FaLeaf, href: "/category/environmental-conferences", tone: "green", keywords: ["environment", "environmental", "climate", "sustainability"] },
  { title: "Technology & AI", description: "AI, computing and digital innovation.", icon: FaBolt, href: "/industry/technology-conferences", tone: "blue", keywords: ["technology", "computer", "artificial intelligence", "ai", "software"] },
  { title: "Business & Management", description: "Leadership, economics and new ventures.", icon: FaBriefcase, href: "/industry/business-conferences", tone: "amber", keywords: ["business", "management", "economics"] },
  { title: "Education", description: "Teaching, learning and academic practice.", icon: FaGraduationCap, href: "/upcoming-conferences?category=Education", tone: "peach", keywords: ["education", "teaching", "learning"] },
  { title: "Physical Sciences", description: "Physics, chemistry and materials research.", icon: FaFlask, href: "/upcoming-conferences?category=Physical%20Sciences", tone: "slate", keywords: ["physics", "chemistry", "materials", "physical sciences"] },
];

const countries = [
  { name: "United States", slug: "united-states", note: "Research, technology & innovation", code: "US" },
  { name: "United Kingdom", slug: "united-kingdom", note: "Academic exchange & discovery", code: "UK" },
  { name: "Canada", slug: "canada", note: "Science & interdisciplinary research", code: "CA" },
  { name: "Australia", slug: "australia", note: "Global collaboration & learning", code: "AU" },
  { name: "Germany", slug: "germany", note: "Engineering & industry", code: "DE" },
  { name: "Japan", slug: "japan", note: "Emerging research & technology", code: "JP" },
  { name: "France", slug: "france", note: "Culture, science & ideas", code: "FR" },
  { name: "Singapore", slug: "singapore", note: "Asia-Pacific research hub", code: "SG" },
];

const popularSearches = ["Artificial Intelligence", "Medical", "Engineering", "Environment", "Education"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const searchCountries = [...new Set(conferences.map((item) => item.country).filter(Boolean))].sort();
const searchTopics = [...new Set(conferences.map((item) => item.category).filter(Boolean))].sort();

function getStartDate(dateText) {
  if (!dateText) return null;
  const match = String(dateText).match(/^(\d{1,2})(?:\s*[–—-]\s*\d{1,2})?\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]} ${match[3]} 00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getMonth(dateText) {
  return String(dateText || "").match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i)?.[1] || "";
}

function formatShortDate(dateText) {
  const date = getStartDate(dateText);
  return date ? { day: date.getDate(), month: date.toLocaleString("en", { month: "short" }), year: date.getFullYear() } : null;
}

function EventCard({ conference, saved, onToggle, comparing, onCompare }) {
  const date = formatShortDate(conference.date);
  const visualTone = /medical|health/i.test(conference.category) ? "medical" : /environment|climate/i.test(conference.category) ? "nature" : /business|management/i.test(conference.category) ? "city" : /education|life science/i.test(conference.category) ? "campus" : "research";
  return (
    <article className={`v10-event-card v10-event-${visualTone}`}>
      <div className="v10-event-art" aria-hidden="true">
        <span className="v10-art-orbit v10-art-orbit-one" /><span className="v10-art-orbit v10-art-orbit-two" />
        <span className="v10-event-art-icon">{visualTone === "medical" ? <FaStethoscope /> : visualTone === "nature" ? <FaLeaf /> : visualTone === "city" ? <FaGlobeAmericas /> : visualTone === "campus" ? <FaGraduationCap /> : <FaMicroscope />}</span>
        <span className="v10-event-art-label">{conference.category || "Academic conference"}</span>
        {date && <span className="v10-date-badge"><strong>{String(date.day).padStart(2, "0")}</strong><small>{date.month} {date.year}</small></span>}
        <button type="button" className={`v10-save-button ${saved ? "is-saved" : ""}`} onClick={() => onToggle(conference.slug)} aria-label={saved ? `Remove ${conference.title} from saved conferences` : `Save ${conference.title}`} aria-pressed={saved} title={saved ? "Remove from saved" : "Save conference"}>{saved ? <FaHeart /> : <FaRegHeart />}</button>
      </div>
      <div className="v10-event-body">
        <div className="v10-event-kicker"><span className="v10-status-dot" /> Conference listing <span className="v10-event-mode">{conference.mode || "Event details"}</span></div>
        <h3><Link to={`/conference/${conference.slug}`}>{conference.title}</Link></h3>
        <div className="v10-event-meta"><FaRegCalendarAlt /><span>{conference.date || "Date to be announced"}</span></div>
        <div className="v10-event-meta"><FaMapMarkerAlt /><span>{conference.country || "International"}</span></div>
        <div className="v10-event-footer"><span className="v10-category-chip">{conference.category || "Research"}</span><Link to={`/conference/${conference.slug}`} aria-label={`View details for ${conference.title}`}>View details <FaArrowRight /></Link></div>
        <button type="button" className={`v13-compare-toggle ${comparing ? "is-selected" : ""}`} onClick={() => onCompare(conference)} aria-pressed={comparing}><FaBalanceScale /> {comparing ? "Added to compare" : "Compare event"}</button>
      </div>
    </article>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [activeFeature, setActiveFeature] = useState("upcoming");
  const [matchTopic, setMatchTopic] = useState("Artificial Intelligence");
  const [matchFormat, setMatchFormat] = useState("Any format");
  const [matchCountry, setMatchCountry] = useState("Any country");
  const [showMatches, setShowMatches] = useState(false);
  const [compareSlugs, setCompareSlugs] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

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

  const upcomingConferences = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dated = conferences.map((conference) => ({ ...conference, startDate: getStartDate(conference.date) }));
    const upcoming = dated.filter((conference) => conference.startDate && conference.startDate >= today).sort((a, b) => a.startDate - b.startDate);
    const fallback = dated.filter((conference) => !conference.startDate).slice(0, 4);
    return upcoming.length ? upcoming : fallback;
  }, []);

  const visibleConferences = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (activeFeature === "saved") return conferences.filter((conference) => savedSlugs.includes(conference.slug));
    if (activeFeature === "virtual") return upcomingConferences.filter((conference) => /virtual|online/i.test(conference.mode || ""));
    if (activeFeature === "this-month") return upcomingConferences.filter((conference) => {
      const date = getStartDate(conference.date);
      return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    return upcomingConferences;
  }, [activeFeature, upcomingConferences, savedSlugs]);

  const submitSearch = (event) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedTopic) params.set("category", selectedTopic);
    if (selectedMonth) params.set("month", selectedMonth);
    const search = params.toString();
    navigate(`/upcoming-conferences${search ? `?${search}` : ""}`);
  };

  const toggleSaved = (slug) => setSavedSlugs(toggleSavedConference(slug));
  const toggleCompare = (conference) => {
    setCompareSlugs((current) => current.includes(conference.slug)
      ? current.filter((slug) => slug !== conference.slug)
      : current.length < 3 ? [...current, conference.slug] : current);
    setShowComparison(false);
  };
  const compareItems = useMemo(() => compareSlugs.map((slug) => conferences.find((item) => item.slug === slug)).filter(Boolean), [compareSlugs]);
  const countryCount = new Set(conferences.map((conference) => conference.country).filter(Boolean)).size;
  const topicCount = new Set(conferences.map((conference) => conference.category).filter(Boolean)).size;
  const savedCount = savedSlugs.length;
  const matchedConferences = useMemo(() => conferences.filter((conference) => {
    const topicMatch = !matchTopic || matchTopic === "Any subject" || `${conference.title} ${conference.category}`.toLowerCase().includes(matchTopic.toLowerCase());
    const formatMatch = matchFormat === "Any format" || (matchFormat === "Online" ? /virtual|online/i.test(conference.mode || "") : /in.?person|onsite|physical/i.test(conference.mode || ""));
    const countryMatch = matchCountry === "Any country" || String(conference.country || "").toLowerCase() === matchCountry.toLowerCase();
    return topicMatch && formatMatch && countryMatch;
  }).slice(0, 3), [matchTopic, matchFormat, matchCountry]);

  return (
    <>
      <SEO title="Upcoming International Conferences 2026–2027 | AllConferenceAlerts" description="Discover upcoming international academic conferences by subject, country and date. Explore engineering, medical, technology, environmental and life science events on AllConferenceAlerts." canonical="https://www.allconferencealerts.net/" />
      <main className="v10-home">
        <section className="v10-hero">
          <div className="v10-hero-grid" aria-hidden="true" />
          <div className="v10-container v10-hero-layout">
            <div className="v10-hero-copy">
              <div className="v10-eyebrow v10-eyebrow-light"><span className="v10-eyebrow-mark"><FaGlobeAmericas /></span> YOUR GLOBAL ACADEMIC CONFERENCE PORTAL</div>
              <h1>Find the right conference for your <em>next big idea.</em></h1>
              <p className="v10-hero-lead">Explore academic conferences, research meetings and professional gatherings by subject, destination and date. Find the room where your next idea can grow.</p>
              <form className="v10-searchbar" onSubmit={submitSearch} role="search">
                <FaSearch aria-hidden="true" className="v10-search-symbol" />
                <label className="v10-sr-only" htmlFor="v10-conference-search">Search conferences by keyword, topic or title</label>
                <input id="v10-conference-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “AI conferences”, “Medicine” or “Germany”" />
                <button type="submit">Search conferences <FaArrowRight /></button>
              </form>
              <div className="v10-popular-row"><span>Popular searches</span>{popularSearches.map((item) => <button type="button" key={item} onClick={() => { setQuery(item); navigate(`/upcoming-conferences?search=${encodeURIComponent(item)}`); }}>{item}</button>)}</div>
              <div className="v10-hero-proof"><span><FaCheckCircle /> Topic-led discovery</span><span><FaCheckCircle /> Global destinations</span><span><FaCheckCircle /> Personal shortlist</span></div>
            </div>
            <div className="v10-hero-art-wrap">
              <div className="v10-art-caption v10-art-caption-top"><span className="v10-caption-icon"><FaCalendarAlt /></span><span><strong>Plan with clarity</strong><small>Dates, destinations and details</small></span></div>
              <img className="v10-global-art" src={researchGlobe} alt="Illustration of a connected globe representing global research opportunities" width="760" height="620" fetchPriority="high" />
              <div className="v10-art-caption v10-art-caption-bottom"><span className="v10-caption-icon v10-caption-icon-gold"><FaGraduationCap /></span><span><strong>Ideas travel further</strong><small>Discover communities beyond borders</small></span></div>
              <div className="v10-art-stamp"><span>DISCOVER</span><strong>What's next<br />for your research?</strong><FaArrowRight /></div>
            </div>
          </div>
          <div className="v10-container v10-hero-stats">
            <div className="v10-stat"><span className="v10-stat-icon"><FaCalendarAlt /></span><span><strong>{conferences.length.toLocaleString("en-IN")}</strong><small>Event listings</small></span></div>
            <div className="v10-stat"><span className="v10-stat-icon"><FaGlobeAmericas /></span><span><strong>{countryCount}</strong><small>Destinations represented</small></span></div>
            <div className="v10-stat"><span className="v10-stat-icon"><FaMicroscope /></span><span><strong>{topicCount}</strong><small>Research topics</small></span></div>
            <div className="v10-stat"><span className="v10-stat-icon"><FaHeart /></span><span><strong>Yours to save</strong><small>Build a personal shortlist</small></span></div>
          </div>
        </section>

        <section className="v10-search-refine" aria-label="Refine conference search">
          <div className="v10-container">
            <form className="v10-refine-panel" onSubmit={submitSearch}>
              <div className="v10-refine-intro"><span className="v10-refine-icon"><FaFilter /></span><span><strong>Make the search yours</strong><small>Three quick filters. Better-fit opportunities.</small></span></div>
              <label><span>Destination</span><select value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)}><option value="">All countries</option>{searchCountries.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
              <label><span>Research area</span><select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}><option value="">All topics</option>{searchTopics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></label>
              <label><span>Month</span><select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}><option value="">Any month</option>{months.map((month) => <option key={month}>{month}</option>)}</select></label>
              <button className="v10-refine-submit" type="submit">Show matches <FaArrowRight /></button>
            </form>
          </div>
        </section>

        <section className="v12-matchmaker-section" aria-labelledby="v12-matchmaker-title">
          <div className="v10-container v12-matchmaker-shell">
            <div className="v12-matchmaker-copy">
              <span className="v12-kicker"><span /> YOUR PERSONAL CONFERENCE FINDER</span>
              <h2 id="v12-matchmaker-title">The right room can<br /><em>change everything.</em></h2>
              <p>Tell us what you care about. Get a shortlist from the conference listings already in our directory — without digging through pages.</p>
              <div className="v12-matchmaker-benefits"><span><FaCheckCircle /> Built around your interests</span><span><FaCheckCircle /> No account required</span><span><FaCheckCircle /> Save your favourites</span></div>
            </div>
            <div className="v12-matchmaker-card">
              <div className="v12-matchmaker-card-top"><div><span className="v12-spark">✳</span><div><strong>Conference Matchmaker</strong><small>Make your next search more personal</small></div></div><span className="v12-step-pill">3 QUICK PICKS</span></div>
              <div className="v12-match-question"><label htmlFor="v12-topic">01 / What are you exploring?</label><select id="v12-topic" value={matchTopic} onChange={(e) => { setMatchTopic(e.target.value); setShowMatches(false); }}><option>Any subject</option><option>Artificial Intelligence</option><option>Engineering</option><option>Medical</option><option>Computer Science</option><option>Education</option><option>Environment</option><option>Life Science</option><option>Business</option></select></div>
              <div className="v12-match-two"><div className="v12-match-question"><label htmlFor="v12-format">02 / Preferred format</label><select id="v12-format" value={matchFormat} onChange={(e) => { setMatchFormat(e.target.value); setShowMatches(false); }}><option>Any format</option><option>Online</option><option>In person</option></select></div><div className="v12-match-question"><label htmlFor="v12-country">03 / Where?</label><select id="v12-country" value={matchCountry} onChange={(e) => { setMatchCountry(e.target.value); setShowMatches(false); }}><option>Any country</option>{searchCountries.map((country) => <option key={country}>{country}</option>)}</select></div></div>
              <button type="button" className="v12-match-submit" onClick={() => setShowMatches(true)}>Find my conferences <FaArrowRight /></button>
              {showMatches && <div className="v12-match-results" aria-live="polite"><div className="v12-match-results-head"><strong>{matchedConferences.length ? `Your shortlist · ${matchedConferences.length} match${matchedConferences.length === 1 ? "" : "es"}` : "No exact matches yet"}</strong><button type="button" onClick={() => navigate(`/upcoming-conferences?${new URLSearchParams({ ...(matchTopic && matchTopic !== "Any subject" ? { search: matchTopic } : {}), ...(matchCountry !== "Any country" ? { country: matchCountry } : {}) }).toString()}`)}>Open full results <FaArrowRight /></button></div>{matchedConferences.length ? matchedConferences.map((item) => <Link className="v12-match-result" to={`/conference/${item.slug}`} key={item.slug}><span><strong>{item.title}</strong><small>{item.date || "Date to be announced"} · {item.country || "International"} · {item.mode || "See event details"}</small></span><FaArrowRight /></Link>) : <p>Try “Any subject” or broaden your country and format selections to discover more listings.</p>}</div>}
              <div className="v12-match-foot"><span><FaShieldAlt /> Matches use published directory information</span><span>01 — 03</span></div>
            </div>
          </div>
        </section>

        <section className="v10-section v10-category-section">
          <div className="v10-container">
            <div className="v10-section-head"><div><span className="v10-eyebrow"><span className="v10-eyebrow-dot" /> EXPLORE WITH INTENTION</span><h2>Start with your <em>research world.</em></h2><p>Browse by discipline and discover events that speak your language.</p></div><Link to="/upcoming-conferences" className="v10-arrow-link">Explore all conferences <FaArrowRight /></Link></div>
            <div className="v10-category-grid">
              {fields.map((field) => {
                const Icon = field.icon;
                const count = conferences.filter((conference) => field.keywords.some((word) => `${conference.title} ${conference.category}`.toLowerCase().includes(word))).length;
                return <Link className={`v10-category-card v10-tone-${field.tone}`} to={field.href} key={field.title}><span className="v10-category-icon"><Icon /></span><span className="v10-category-content"><strong>{field.title}</strong><small>{field.description}</small><span className="v10-category-count">{count} {count === 1 ? "matching listing" : "matching listings"}</span></span><span className="v10-category-arrow"><FaArrowRight /></span></Link>;
              })}
            </div>
          </div>
        </section>

        <section className="v10-featured-section">
          <div className="v10-container">
            <div className="v10-section-head v10-featured-head"><div><span className="v10-eyebrow"><span className="v10-eyebrow-dot" /> YOUR NEXT OPPORTUNITY</span><h2>Conferences to <em>explore next.</em></h2><p>Review dates and details, then save the listings you want to revisit.</p></div><Link to="/upcoming-conferences" className="v10-arrow-link">Browse directory <FaArrowRight /></Link></div>
            <div className="v10-feature-tabs" role="tablist" aria-label="Conference views">
              <button type="button" role="tab" aria-selected={activeFeature === "upcoming"} className={activeFeature === "upcoming" ? "is-active" : ""} onClick={() => setActiveFeature("upcoming")}>Upcoming</button>
              <button type="button" role="tab" aria-selected={activeFeature === "this-month"} className={activeFeature === "this-month" ? "is-active" : ""} onClick={() => setActiveFeature("this-month")}>This month</button>
              <button type="button" role="tab" aria-selected={activeFeature === "virtual"} className={activeFeature === "virtual" ? "is-active" : ""} onClick={() => setActiveFeature("virtual")}>Virtual events</button>
              <button type="button" role="tab" aria-selected={activeFeature === "saved"} className={activeFeature === "saved" ? "is-active" : ""} onClick={() => setActiveFeature("saved")}><FaHeart /> Saved <span>{savedCount}</span></button>
            </div>
            {visibleConferences.length ? <div className="v10-event-grid">{visibleConferences.slice(0, 4).map((conference) => <EventCard key={conference.slug} conference={conference} saved={savedSlugs.includes(conference.slug)} onToggle={toggleSaved} comparing={compareSlugs.includes(conference.slug)} onCompare={toggleCompare} />)}</div> : <div className="v10-empty-state"><span><FaBookmark /></span><strong>{activeFeature === "saved" ? "Your shortlist starts here" : activeFeature === "this-month" ? "No dated listings found for this month" : "No virtual listings found in the upcoming selection"}</strong><p>{activeFeature === "saved" ? "Tap the heart on any conference card to keep it close. Your shortlist stays in this browser." : "Explore the full directory to discover more opportunities."}</p><button type="button" onClick={() => setActiveFeature("upcoming")}>Explore upcoming listings <FaArrowRight /></button></div>}
            <div className="v10-featured-footnote"><span><FaCheckCircle /> Always review the event details before registering.</span><Link to="/upcoming-conferences">See all listings <FaArrowRight /></Link></div>
            {compareItems.length > 0 && <div className="v13-compare-dock" aria-live="polite"><div className="v13-compare-dock-copy"><span className="v13-compare-icon"><FaBalanceScale /></span><span><strong>Compare your shortlist</strong><small>{compareItems.length} of 3 events selected</small></span></div><div className="v13-compare-chips">{compareItems.map((item) => <span key={item.slug}>{item.title}<button type="button" onClick={() => toggleCompare(item)} aria-label={`Remove ${item.title} from comparison`}><FaTimes /></button></span>)}</div><button type="button" className="v13-compare-open" onClick={() => setShowComparison((value) => !value)}>{showComparison ? "Hide comparison" : "Compare events"} <FaArrowRight /></button></div>}
            {showComparison && compareItems.length > 0 && <div className="v13-comparison-panel"><div className="v13-comparison-head"><div><span>DECISION DESK / SIDE-BY-SIDE</span><h3>Choose with more confidence.</h3></div><button type="button" onClick={() => setShowComparison(false)} aria-label="Close comparison"><FaTimes /></button></div><div className="v13-comparison-grid" style={{"--compare-count": compareItems.length}}>{compareItems.map((item) => <article key={item.slug}><span className="v13-comparison-category">{item.category || "Academic conference"}</span><h4>{item.title}</h4><dl><div><dt><FaCalendarAlt /> Date</dt><dd>{item.date || "Not specified"}</dd></div><div><dt><FaGlobeAmericas /> Destination</dt><dd>{item.country || "Not specified"}</dd></div><div><dt><FaLaptopCode /> Format</dt><dd>{item.mode || "Check event details"}</dd></div></dl><Link to={`/conference/${item.slug}`}>Review event <FaArrowRight /></Link></article>)}</div><p className="v13-comparison-note">Comparison uses the information currently published in each listing. Confirm details with the organizer before registering.</p></div>}
          </div>
        </section>

        <section className="v10-destination-section">
          <div className="v10-container v10-destination-layout">
            <div className="v10-destination-copy"><span className="v10-eyebrow v10-eyebrow-light"><span className="v10-eyebrow-dot" /> RESEARCH HAS NO BORDERS</span><h2>Explore opportunities <em>around the world.</em></h2><p>Use destination pages to narrow your search and explore conference listings associated with each country.</p><Link to="/upcoming-conferences" className="v10-destination-cta">Explore the directory <FaArrowRight /></Link><div className="v10-world-mark" aria-hidden="true"><FaGlobeAmericas /></div></div>
            <div className="v10-country-grid">{countries.map((country, index) => { const count = conferences.filter((conference) => conference.country?.toLowerCase() === country.name.toLowerCase()).length; return <Link className={`v10-country-card v10-country-card-${index + 1}`} to={`/conferences/${country.slug}`} key={country.slug}><span className="v10-country-code">{country.code}</span><span className="v10-country-detail"><strong>{country.name}</strong><small>{country.note}</small><em>{count} {count === 1 ? "listing" : "listings"} in directory</em></span><FaArrowRight className="v10-country-arrow" /></Link>; })}</div>
          </div>
        </section>

        <section className="v10-planning-section">
          <div className="v10-container">
            <div className="v10-section-head"><div><span className="v10-eyebrow"><span className="v10-eyebrow-dot" /> PLAN AHEAD</span><h2>Your academic calendar, <em>at a glance.</em></h2><p>Jump into a month to discover relevant event listings and plan your next step.</p></div><span className="v10-planning-badge"><FaClock /> Search by month</span></div>
            <div className="v10-month-grid">{months.map((month, index) => <Link to={`/upcoming-conferences?month=${encodeURIComponent(month)}`} key={month} className={`v10-month-card ${index === new Date().getMonth() ? "is-current" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{month}</strong><FaArrowRight /></Link>)}</div>
          </div>
        </section>

        <section className="v10-how-section">
          <div className="v10-container v10-how-layout"><div className="v10-how-intro"><span className="v10-eyebrow"><span className="v10-eyebrow-dot" /> FROM SEARCH TO NEXT STEP</span><h2>Less searching.<br /><em>More meaningful choices.</em></h2><p>Conference discovery should help you make a confident shortlist, not add another layer of complexity.</p><Link to="/upcoming-conferences" className="v10-arrow-link">Start exploring <FaArrowRight /></Link></div><div className="v10-how-steps"><article><span className="v10-step-no">01</span><span className="v10-step-icon"><FaSearch /></span><div><h3>Discover</h3><p>Search by topic, country, month or keyword to surface relevant listings.</p></div></article><article><span className="v10-step-no">02</span><span className="v10-step-icon"><FaBookOpen /></span><div><h3>Compare</h3><p>Review the published date, location, subject and event information.</p></div></article><article><span className="v10-step-no">03</span><span className="v10-step-icon"><FaHeart /></span><div><h3>Shortlist</h3><p>Save interesting listings in this browser so you can return to them later.</p></div></article></div></div>
        </section>

        <section className="v10-insights-section">
          <div className="v10-container"><div className="v10-section-head"><div><span className="v10-eyebrow"><span className="v10-eyebrow-dot" /> THE RESEARCH DESK</span><h2>Good preparation <em>opens doors.</em></h2><p>Practical reading for researchers, students and conference organizers.</p></div><Link to="/blog" className="v10-arrow-link">Read all insights <FaArrowRight /></Link></div>
            <div className="v10-insights-grid">{blogPreviews.slice(0, 3).map((blog, index) => <article className={`v10-insight-card v10-insight-${index + 1}`} key={blog.slug}><div className="v10-insight-art"><span className="v10-insight-art-icon">{index === 0 ? <FaBookOpen /> : index === 1 ? <FaUsers /> : <FaNewspaper />}</span><span className="v10-insight-art-label">FIELD NOTES / {String(index + 1).padStart(2, "0")}</span><span className="v10-insight-art-lines" /></div><div className="v10-insight-body"><span>GUIDES &amp; INSIGHTS</span><h3><Link to={`/blog/${blog.slug}`}>{blog.title}</Link></h3><p>{blog.excerpt}</p><Link to={`/blog/${blog.slug}`} className="v10-insight-link">Read the guide <FaArrowRight /></Link></div></article>)}</div>
          </div>
        </section>

        <section className="v10-organizer-section"><div className="v10-container v10-organizer-panel"><div className="v10-organizer-symbol"><FaGraduationCap /></div><div className="v10-organizer-copy"><span className="v10-eyebrow v10-eyebrow-light">FOR EVENT ORGANIZERS</span><h2>Put your conference in front of the right audience.</h2><p>Submit your event for consideration in our conference directory and help researchers discover the opportunity.</p></div><Link to="/submit-conference" className="v10-organizer-cta">Submit a conference <FaArrowRight /></Link><div className="v10-organizer-orbit" aria-hidden="true" /></div></section>
      </main>
    </>
  );
}

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaBars, FaChevronDown, FaTimes, FaArrowRight, FaHeart, FaRegHeart, FaCheckCircle } from "react-icons/fa";
import allconferencealerts from "../assets/allconferencealerts.webp";
import { conferences } from "../data/conferences";
import { getSavedConferenceSlugs, toggleSavedConference } from "../utils/savedConferences";

const countryLinks = [
  ["United States", "/conferences/united-states"],
  ["United Kingdom", "/conferences/united-kingdom"],
  ["Canada", "/conferences/canada"],
  ["Australia", "/conferences/australia"],
  ["Germany", "/conferences/germany"],
  ["Japan", "/conferences/japan"],
];

const categoryLinks = [
  ["Engineering", "/category/engineering-conferences"],
  ["Medical & Healthcare", "/category/medical-conferences"],
  ["Environmental Science", "/category/environmental-conferences"],
  ["Life Sciences", "/category/life-science-conferences"],
];

const industryLinks = [
  ["Business & Management", "/industry/business-conferences"],
  ["Technology & IT", "/industry/technology-conferences"],
  ["Engineering", "/industry/engineering-conferences"],
  ["Medical & Healthcare", "/industry/medical-conferences"],
];

const roleLinks = [
  ["PhD Scholars", "/conferences-for/phd-scholars"],
  ["Faculty", "/conferences-for/faculty"],
  ["Industry Professionals", "/conferences-for/industry-professionals"],
  ["Startups", "/conferences-for/startups"],
];

function NavDropdown({ label, id, openMenu, setOpenMenu, items }) {
  const isOpen = openMenu === id;
  return (
    <div
      className={`aca-nav-dropdown ${isOpen ? "is-open" : ""}`}
      onMouseEnter={() => setOpenMenu(id)}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <button
        className="aca-nav-link aca-nav-trigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setOpenMenu(isOpen ? null : id)}
      >
        {label}<FaChevronDown aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="aca-nav-menu">
          <div className="aca-nav-menu-label">EXPLORE {label.toUpperCase()}</div>
          {items.map(([text, to]) => (
            <Link key={`${id}-${to}`} to={to} onClick={() => setOpenMenu(null)}>
              <span>{text}</span><FaArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [savedOpen, setSavedOpen] = useState(false);

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

  useEffect(() => {
    if (!savedOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSavedOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [savedOpen]);

  const savedConferences = conferences.filter((conference) => savedSlugs.includes(conference.slug));
  const closeMenu = () => setOpenMenu(null);

  return (
    <header className="aca-site-header">
      <div className="aca-header-inner">
        <Link to="/" className="aca-brand" aria-label="AllConferenceAlerts home" onClick={closeMenu}>
          <img src={allconferencealerts} width="160" height="40" alt="AllConferenceAlerts" />
          <span className="aca-brand-copy">
            <strong>AllConferenceAlerts</strong>
            <small>Discover. Connect. Advance.</small>
          </span>
        </Link>

        <nav className="aca-desktop-nav" aria-label="Primary navigation">
          <Link className="aca-nav-link" to="/upcoming-conferences">Conferences</Link>
          <NavDropdown label="By Country" id="country" openMenu={openMenu} setOpenMenu={setOpenMenu} items={countryLinks} />
          <NavDropdown label="By Category" id="category" openMenu={openMenu} setOpenMenu={setOpenMenu} items={categoryLinks} />
          <NavDropdown label="By Industry" id="industry" openMenu={openMenu} setOpenMenu={setOpenMenu} items={industryLinks} />
          <NavDropdown label="By Role" id="role" openMenu={openMenu} setOpenMenu={setOpenMenu} items={roleLinks} />
          <Link className="aca-nav-link" to="/blog">Insights</Link>
        </nav>

        <button className="aca-saved-trigger" type="button" onClick={() => { setSavedOpen(true); closeMenu(); }} aria-label={`Open saved conferences, ${savedSlugs.length} saved`} aria-expanded={savedOpen}>
          {savedSlugs.length ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
          <span>Saved</span><b>{savedSlugs.length}</b>
        </button>
        <Link to="/submit-conference" className="aca-header-cta">
          Submit a conference <FaArrowRight aria-hidden="true" />
        </Link>

        <button
          className="aca-mobile-toggle"
          type="button"
          aria-label={openMenu === "mobile" ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={openMenu === "mobile"}
          onClick={() => setOpenMenu(openMenu === "mobile" ? null : "mobile")}
        >
          {openMenu === "mobile" ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {openMenu === "mobile" && (
        <nav className="aca-mobile-nav" aria-label="Mobile navigation">
          <Link to="/upcoming-conferences" onClick={closeMenu}>Upcoming Conferences</Link>
          <div className="aca-mobile-nav-group">
            <span>Browse by country</span>
            <div>{countryLinks.map(([label, to]) => <Link key={to} to={to} onClick={closeMenu}>{label}</Link>)}</div>
          </div>
          <div className="aca-mobile-nav-group">
            <span>Browse by category</span>
            <div>{categoryLinks.map(([label, to]) => <Link key={to} to={to} onClick={closeMenu}>{label}</Link>)}</div>
          </div>
          <div className="aca-mobile-nav-group">
            <span>Browse by industry</span>
            <div>{industryLinks.map(([label, to]) => <Link key={to} to={to} onClick={closeMenu}>{label}</Link>)}</div>
          </div>
          <Link to="/blog" onClick={closeMenu}>Research insights</Link>
          <Link to="/submit-conference" className="aca-mobile-submit" onClick={closeMenu}>Submit a conference <FaArrowRight aria-hidden="true" /></Link>
        </nav>
      )}
      {savedOpen && createPortal((
        <div className="aca-saved-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSavedOpen(false); }}>
          <aside className="aca-saved-drawer" role="dialog" aria-modal="true" aria-labelledby="aca-saved-title">
            <div className="aca-saved-drawer-head"><div><span>YOUR PERSONAL SHORTLIST</span><h2 id="aca-saved-title">Saved conferences <b>{savedConferences.length}</b></h2></div><button type="button" onClick={() => setSavedOpen(false)} aria-label="Close saved conferences"><FaTimes /></button></div>
            {savedConferences.length ? <div className="aca-saved-list">{savedConferences.map((conference) => <article key={conference.slug}><span className="aca-saved-list-icon"><FaHeart /></span><div><Link to={`/conference/${conference.slug}`} onClick={() => setSavedOpen(false)}>{conference.title}</Link><small>{conference.date || "Date to be announced"} · {conference.country || "International"}</small></div><button type="button" className="aca-saved-remove" onClick={() => setSavedSlugs(toggleSavedConference(conference.slug))} aria-label={`Remove ${conference.title} from saved conferences`} title="Remove from shortlist"><FaTimes /></button></article>)}</div> : <div className="aca-saved-empty"><span><FaRegHeart /></span><strong>Keep good opportunities close.</strong><p>Use the heart on any conference card to add it to your shortlist. Your saved list stays in this browser.</p><Link to="/upcoming-conferences" onClick={() => setSavedOpen(false)}>Explore conferences <FaArrowRight /></Link></div>}
            <div className="aca-saved-drawer-foot"><FaCheckCircle /> Saved locally on this device. No account required.</div>
          </aside>
        </div>
      ), document.body)}
    </header>
  );
}

import { Link } from "react-router-dom";
import { FaArrowRight, FaGlobeAmericas } from "react-icons/fa";
import allconferencealerts from "../assets/allconferencealerts.webp";

const countries = [
  ["United States", "/conferences/united-states"],
  ["United Kingdom", "/conferences/united-kingdom"],
  ["Canada", "/conferences/canada"],
  ["Australia", "/conferences/australia"],
  ["Germany", "/conferences/germany"],
  ["Japan", "/conferences/japan"],
];

const categories = [
  ["Engineering", "/category/engineering-conferences"],
  ["Medical & Healthcare", "/category/medical-conferences"],
  ["Environmental Science", "/category/environmental-conferences"],
  ["Life Sciences", "/category/life-science-conferences"],
  ["Technology & IT", "/industry/technology-conferences"],
  ["Business & Management", "/industry/business-conferences"],
];

export default function Footer() {
  return (
    <footer className="aca-site-footer">
      <div className="aca-container">
        <div className="aca-footer-main">
          <div className="aca-footer-brand-column">
            <Link to="/" className="aca-footer-brand" aria-label="AllConferenceAlerts home">
              <img src={allconferencealerts} width="160" height="40" alt="" />
              <span>AllConferenceAlerts</span>
            </Link>
            <p>
              Helping researchers, scholars, students and professionals discover
              academic conference opportunities across disciplines and destinations.
            </p>
            <Link to="/upcoming-conferences" className="aca-footer-discover">
              Explore conferences <FaArrowRight aria-hidden="true" />
            </Link>
          </div>

          <nav className="aca-footer-column" aria-label="Conference destinations">
            <h2>Destinations</h2>
            {countries.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>

          <nav className="aca-footer-column" aria-label="Conference subjects">
            <h2>Explore by field</h2>
            {categories.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>

          <nav className="aca-footer-column" aria-label="About AllConferenceAlerts">
            <h2>About & resources</h2>
            <Link to="/blog">Research insights</Link>
            <Link to="/submit-conference">Submit a conference</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms">Terms & conditions</Link>
          </nav>
        </div>

        <div className="aca-footer-callout">
          <div className="aca-footer-callout-icon"><FaGlobeAmericas aria-hidden="true" /></div>
          <div>
            <strong>Have an academic event to share?</strong>
            <p>Help the research community discover your conference.</p>
          </div>
          <Link to="/submit-conference">Submit event <FaArrowRight aria-hidden="true" /></Link>
        </div>

        <div className="aca-footer-bottom">
          <span>© {new Date().getFullYear()} AllConferenceAlerts. All rights reserved.</span>
          <span className="aca-footer-note">A discovery platform for the global academic community.</span>
        </div>
      </div>
    </footer>
  );
}

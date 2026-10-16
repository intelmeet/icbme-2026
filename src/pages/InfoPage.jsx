import { Link, useLocation } from "react-router-dom";
import SEO from "../seo/SEO";
import { FaArrowRight, FaEnvelope, FaShieldAlt, FaFileContract, FaGlobeAmericas } from "react-icons/fa";

const pages = {
  "/about": {
    title: "About AllConferenceAlerts",
    description: "Learn how AllConferenceAlerts helps researchers and professionals discover academic conference opportunities.",
    eyebrow: "ABOUT THE PLATFORM",
    heading: "Connecting people with academic opportunities.",
    intro: "AllConferenceAlerts is a discovery platform designed to help researchers, scholars, students and professionals find conference opportunities across academic disciplines and destinations.",
    icon: FaGlobeAmericas,
    sections: [
      ["Our purpose", "Academic events create opportunities to share research, exchange ideas and build professional connections. Our aim is to make conference information easier to discover and explore."],
      ["How to use the directory", "Browse conference listings by subject, country or keyword. Review the information available on each listing and visit the official event website to confirm dates, submission requirements, fees and registration details."],
      ["Information accuracy", "Conference details can change. Visitors should verify important dates, fees, publication claims and organizer information directly with the official event organizer before submitting work or making payments."]
    ]
  },
  "/contact": {
    title: "Contact AllConferenceAlerts",
    description: "Contact AllConferenceAlerts about conference listings, corrections and event submissions.",
    eyebrow: "WE'RE HERE TO HELP",
    heading: "Get in touch with our team.",
    intro: "Have a question about a listing, need to report an update, or want to submit an academic event? Use the options below to reach the appropriate next step.",
    icon: FaEnvelope,
    sections: [
      ["Conference submissions", "Organizers can share event details through our conference submission page. Please provide accurate dates, venue or online format, official website and contact information.", "submit"],
      ["Corrections and updates", "If a listing contains an outdated date or incorrect detail, include the conference title and its page URL when contacting the site operator so the information can be reviewed."],
      ["Before you register", "For registration, payment, paper acceptance, certificates or publication questions, contact the event organizer through the official conference website."]
    ]
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Learn about privacy considerations when browsing AllConferenceAlerts and submitting information through the website.",
    eyebrow: "YOUR PRIVACY",
    heading: "Privacy matters.",
    intro: "This page summarizes key privacy considerations for visitors to AllConferenceAlerts. The site operator should review and update this notice to reflect its current data practices and applicable legal requirements.",
    icon: FaShieldAlt,
    sections: [
      ["Information you submit", "If you submit a conference or contact information through a form, the details you provide may be processed to respond to the request, review the listing or operate the service. Do not submit confidential or sensitive information through public forms."],
      ["Analytics and embedded services", "The website code may use analytics and third-party chat or form services. Those providers may process technical information under their own privacy policies and settings. Their current terms should be reviewed for details."],
      ["External websites", "Conference listings may link to external organizer websites. Their privacy practices, registration forms and payment processes are managed by those organizations, not by this directory."],
      ["Questions", "For privacy-related questions, use the contact options provided on this website. This notice should be reviewed periodically and updated whenever the website's data practices change."]
    ]
  },
  "/terms": {
    title: "Terms & Conditions",
    description: "Review general terms for using the AllConferenceAlerts academic conference directory.",
    eyebrow: "WEBSITE TERMS",
    heading: "Clear information. Responsible use.",
    intro: "By using AllConferenceAlerts, visitors should use the directory responsibly and verify important event information with the official organizer before taking action.",
    icon: FaFileContract,
    sections: [
      ["Listing information", "Conference details are provided for discovery and informational purposes. Dates, venues, deadlines, fees, publication opportunities and other details may change. Always confirm them with the official event organizer."],
      ["External organizers", "AllConferenceAlerts is a discovery directory and does not independently guarantee the quality, legitimacy, acceptance decisions, proceedings or services of every listed event. Registration and participation arrangements are handled by the organizer."],
      ["Acceptable use", "Do not misuse the website, submit misleading information, attempt to disrupt its operation or use listings in a way that violates applicable law."],
      ["Updates to these terms", "Terms may be revised as the website evolves. The site operator should ensure this page reflects its actual services and applicable legal requirements."]
    ]
  }
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const page = pages[pathname] || pages["/about"];
  const Icon = page.icon;

  return (
    <>
      <SEO
        title={`${page.title} | AllConferenceAlerts`}
        description={page.description}
        canonical={`https://www.allconferencealerts.net${pathname}`}
      />
      <main className="aca-info-page">
        <section className="aca-info-hero">
          <div className="aca-container">
            <div className="aca-eyebrow"><span className="aca-eyebrow-dot" /> {page.eyebrow}</div>
            <div className="aca-info-hero-grid">
              <div>
                <h1>{page.heading}</h1>
                <p>{page.intro}</p>
              </div>
              <div className="aca-info-hero-icon"><Icon aria-hidden="true" /></div>
            </div>
          </div>
        </section>
        <section className="aca-info-content aca-container">
          {page.sections.map(([heading, body, action]) => (
            <article className="aca-info-card" key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
              {action === "submit" && (
                <Link to="/submit-conference" className="aca-text-link">Submit a conference <FaArrowRight aria-hidden="true" /></Link>
              )}
            </article>
          ))}
          <div className="aca-info-cta">
            <div>
              <strong>Explore academic opportunities</strong>
              <p>Browse conference listings or share an event with the research community.</p>
            </div>
            <Link to="/upcoming-conferences" className="aca-button aca-button-primary">Explore conferences <FaArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}

import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";

export default function Role() {
  const { roleSlug } = useParams();

  const roleMap = {
    "phd-scholars": {
      title: "Conferences for PhD Scholars 2026",
      description:
        "Find upcoming conferences for PhD scholars 2026 offering research presentation, publication opportunities, academic networking, and international exposure.",
    },
    "industry-professionals": {
      title: "Conferences for Industry Professionals 2026",
      description:
        "Explore industry-focused conferences 2026 designed for professionals seeking networking, innovation insights, certifications, and career growth.",
    },
    "faculty": {
      title: "Conferences for Faculty & Academicians 2026",
      description:
        "Discover academic conferences 2026 for faculty members focusing on teaching, research collaboration, publication, and professional development.",
    },
    "startups": {
      title: "Conferences for Startups & Entrepreneurs 2026",
      description:
        "Browse startup and entrepreneurship conferences 2026 focusing on innovation, funding, networking, and business growth.",
    },
  };

  const role = roleMap[roleSlug];

  if (!role) {
    return (
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        robots="noindex,follow"
      />
    );
  }

  const canonicalUrl = `https://www.allconferencealerts.net/conferences-for/${roleSlug}`;

  return (
    <>
      <SEO
        title={role.title}
        description={role.description}
        canonical={canonicalUrl}
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.allconferencealerts.net/" },
            { "@type": "ListItem", position: 2, name: role.title, item: canonicalUrl },
          ],
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{role.title}</h1>

        <p className="max-w-4xl text-gray-700 mb-8">
          {role.description}
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          Popular Conference Categories
        </h2>

        <ul className="list-disc ml-6 text-primary font-medium">
          <li><Link to="/category/engineering-conferences">Engineering Conferences</Link></li>
          <li><Link to="/category/medical-conferences">Medical Conferences</Link></li>
          <li><Link to="/category/business-conferences">Business Conferences</Link></li>
          <li><Link to="/category/technology-conferences">Technology Conferences</Link></li>
        </ul>
      </main>
    </>
  );
}

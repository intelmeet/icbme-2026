import { useParams, Link } from "react-router-dom";
import SEO from "../seo/SEO";
import { blogs } from "../data/blogs";

export default function BlogPost() {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <SEO
        title="Blog Not Found"
        description="The requested blog post does not exist."
        robots="noindex,follow"
      />
    );
  }

  return (
    <>
      <SEO
        title={blog.metaTitle}
        description={blog.metaDescription}
        canonical={`https://www.allconferencealerts.net/blog/${blog.slug}`}
        type="article"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.metaDescription,
            "mainEntityOfPage": `https://www.allconferencealerts.net/blog/${blog.slug}`,
            "author": { "@type": "Organization", "name": "AllConferenceAlerts" },
            "publisher": {
              "@type": "Organization",
              "name": "AllConferenceAlerts",
              "logo": { "@type": "ImageObject", "url": "https://www.allconferencealerts.net/brand-logo.webp" }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.allconferencealerts.net/" },
              { "@type": "ListItem", "position": 2, "name": "Research Guides", "item": "https://www.allconferencealerts.net/blog" },
              { "@type": "ListItem", "position": 3, "name": blog.title, "item": `https://www.allconferencealerts.net/blog/${blog.slug}` }
            ]
          }
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

        <div className="max-w-4xl text-gray-700 space-y-6">
  {blog.sections.map((section, index) => {
    if (section.type === "paragraph") {
      return <p key={index}>{section.content}</p>;
    }

    if (section.type === "heading") {
      return <h2 key={index} className="text-2xl font-semibold mt-8">
        {section.content}
      </h2>;
    }

    if (section.type === "list") {
      return (
        <ul key={index} className="list-disc ml-6">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    return null;
  })}
</div>


        <section className="mt-12">
  <h2 className="text-2xl font-semibold mb-4">
    Related Conference Pages
  </h2>

  <ul className="list-disc ml-6 text-primary font-medium">
    <li>
      <Link to="/conferences/united-states">
        Conferences in United States
      </Link>
    </li>
    <li>
      <Link to="/category/environmental-conferences">
        Environmental Conferences 2026
      </Link>
    </li>
    <li>
      <Link to="/environmental-conferences/united-states">
        Environmental Conferences in USA
      </Link>
    </li>
    <li>
      <Link to="/industry/engineering-conferences/united-states">
        Engineering Conferences in USA
      </Link>
    </li>
  </ul>
</section>

      </main>
    </>
  );
}

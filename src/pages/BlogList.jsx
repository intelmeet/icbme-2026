import { Link } from "react-router-dom";
import SEO from "../seo/SEO";
import { blogs } from "../data/blogs";

export default function BlogList() {
  return (
    <>
      <SEO
        title="Conference Blogs & Research Guides | AllConferenceAlerts"
        description="Read expert blogs on international conferences, paper publication, Scopus indexing, and academic research guidance."
        canonical="https://www.allconferencealerts.net/blog"
      />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">
          Conference & Research Blogs
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.slug}
              className="border rounded-xl p-6 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                <Link to={`/blog/${blog.slug}`} className="seo-link">
                  {blog.title}
                </Link>
              </h2>

              <p className="text-gray-600 mb-3">{blog.excerpt}</p>

              <Link
                to={`/blog/${blog.slug}`}
                className="text-primary font-medium"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

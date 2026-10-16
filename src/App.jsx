import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SiteStructuredData from "./seo/SiteStructuredData";

// Lazy-loaded pages (performance optimization)
const Country = React.lazy(() => import("./pages/Country"));
const Category = React.lazy(() => import("./pages/Category"));
const Conference = React.lazy(() => import("./pages/Conference"));
const ConferenceList = React.lazy(() => import("./pages/ConferenceList"));
const CategoryCountry = React.lazy(() => import("./pages/CategoryCountry"));

const Industry = React.lazy(() => import("./pages/Industry"));
const IndustryCountry = React.lazy(() => import("./pages/IndustryCountry"));
const Role = React.lazy(() => import("./pages/Role"));

const BlogList = React.lazy(() => import("./pages/BlogList"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));

const SubmitConference = React.lazy(() => import("./pages/SubmitConference"));
const InfoPage = React.lazy(() => import("./pages/InfoPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const CityLanding = React.lazy(() => import("./pages/CityLanding"));
// Simple loader component
function PageLoader() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <div className="aca-design-system">
      <SiteStructuredData />
      <Header />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/conferences/:country" element={<Country />} />

          <Route path="/category/:slug" element={<Category />} />

          <Route path="/conference/:slug" element={<Conference />} />

          <Route
            path="/upcoming-conferences"
            element={<ConferenceList />}
          />
          <Route
  path="/:categorySlug/:country"
  element={<CategoryCountry />}
/>

<Route
  path="/industry/:industrySlug"
  element={<Industry />}
/>

<Route
  path="/industry/:industrySlug/:country"
  element={<IndustryCountry />}
/>

<Route
  path="/conferences-for/:roleSlug"
  element={<Role />}
/>

<Route path="/blog" element={<BlogList />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/submit-conference" element={<SubmitConference />} />
<Route path="/about" element={<InfoPage />} />
<Route path="/contact" element={<InfoPage />} />
<Route path="/privacy-policy" element={<InfoPage />} />
<Route path="/terms" element={<InfoPage />} />



          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

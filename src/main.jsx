import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "./seo/Helmet";
import App from "./App";
import "./index.css";
import "./premium-refresh.css";
import "./premium-v10.css";
import "./premium-v11.css";
import "./premium-v13.css";

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

import "./premium-v14.css";

import "./premium-v15.css";

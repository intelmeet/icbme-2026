import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Keep react-helmet-async inside Vite's SSR transform. Its ESM entry is
  // otherwise externalized and misdetected as CommonJS by Node 24 during prerender.
  ssr: {
    noExternal: ["react-helmet-async"],
  },

  // Required for S3 / CloudFront
  base: "/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,

    // 🔥 CRITICAL PERFORMANCE OPTIMIZATIONS
    rollupOptions: {
      output: {
        // Split vendor chunks (reduces TBT)
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
        },

        // Better caching for assets
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },

    // Reduce JS parsing cost
    cssCodeSplit: true,

    // Smaller bundles
    minify: "esbuild",
  },
});


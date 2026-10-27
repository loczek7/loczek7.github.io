import type { NextConfig } from "next";

// Static export for GitHub Pages (user site loczek7.github.io, so no basePath).
const nextConfig: NextConfig = {
  output: "export",
  // `/pl` -> `/pl/index.html`, which GitHub Pages serves without rewrites.
  trailingSlash: true,
  // The default image loader needs a server; Pages only serves static files.
  images: { unoptimized: true },
};

export default nextConfig;

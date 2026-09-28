import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images from external domains if needed in the future.
  // The API currently only returns filename strings (no external URLs),
  // so no remotePatterns are needed yet.
  images: {
    // Allow unoptimized local images to work on any static host.
    // Remove this line if deploying to Vercel (it handles optimization automatically).
    unoptimized: false,
  },

  // Ensure trailing slashes are consistent across all pages.
  trailingSlash: false,
};

export default nextConfig;

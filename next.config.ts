import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare tunnel origins for dev server
  allowedDevOrigins: [
    "https://dev.abm.dev",
    "https://api-dev.abm.dev",
  ],
};

export default nextConfig;

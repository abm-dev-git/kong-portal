import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare tunnel origins for dev server
  // Format: hostname only, protocol is inferred
  allowedDevOrigins: [
    "dev.abm.dev",
    "api-dev.abm.dev",
  ],
};

export default nextConfig;

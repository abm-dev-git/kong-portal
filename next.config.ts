import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Allow Cloudflare tunnel origins for dev server
  // Format: hostname only, protocol is inferred
  allowedDevOrigins: [
    "dev.abm.dev",
    "api-dev.abm.dev",
  ],
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "foxley-farm-operations-ltd",
  project: "kong-portal",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  // Source maps configuration
  sourcemaps: {
    // Hide source maps from generated client bundles
    deleteSourcemapsAfterUpload: true,
  },
});

import type { NextConfig } from "next";

import type { NextConfig } from "next";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disabled Turbopack rules to use stable Webpack build for production
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;

export default nextConfig;

export default nextConfig;

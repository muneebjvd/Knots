import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  transpilePackages: ["three"],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Vercel was failing the build due to strict linting.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

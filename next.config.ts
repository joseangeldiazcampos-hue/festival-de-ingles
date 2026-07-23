import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from common flag providers
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },
    ],
  },
  // Ensure Prisma works correctly in production
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;

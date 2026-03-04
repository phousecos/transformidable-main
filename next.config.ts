import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.transformidable.media",
      },
      {
        protocol: "https",
        hostname: "assets.transformidable.media",
      },
    ],
  },
};

export default nextConfig;

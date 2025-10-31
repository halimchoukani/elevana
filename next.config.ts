import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "dropinblog.net",
      },
      {
        protocol: "https",
        hostname: "www.britsoc.co.uk",
      },
      {
        protocol: "https",
        hostname: "cdncn.goodao.net",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.freepik.com",
      },
      {
        protocol: "https",
        hostname: "mk-media.mytek.tn",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

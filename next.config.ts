import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "s.alicdn.com",
      "dropinblog.net",
      "www.britsoc.co.uk",
      "cdncn.goodao.net",
      "cdn-icons-png.freepik.com",
      "mk-media.mytek.tn",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dnu4lxiie/image/upload/**",
      },
    ],
  },
};

export default nextConfig;

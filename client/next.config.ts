import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["qrcode.react"],
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;

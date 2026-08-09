import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["qrcode.react"],
  devIndicators: false,
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || process.env.BACKEND_URL;
    if (!backend) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

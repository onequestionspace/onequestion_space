import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.git', '**/data/**', '**/data/data/**', '/data', '/data/data', '/']
      };
    }
    return config;
  },
};

export default nextConfig;

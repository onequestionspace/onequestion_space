/** @type {import('next').NextConfig} */
const nextConfig = {
  // serverActions is a boolean in Next.js 14/15, but let's follow the version requirements
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

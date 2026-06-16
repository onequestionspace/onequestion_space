/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
        {
          source: '/.well-known/apple-developer-merchantid-domain-association',
          destination: '/api/well-known',
        },
        {
          source: '/.well-known/apple-developer-merchantid-domain-association',
          destination: '/.well-known/apple-developer-merchantid-domain-association',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

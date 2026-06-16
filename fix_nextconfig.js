const fs = require('fs');

const config = `/** @type {import('next').NextConfig} */
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
            value: 'application/text',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
`;

fs.writeFileSync('next.config.js', config);
console.log('next.config.js cleaned');

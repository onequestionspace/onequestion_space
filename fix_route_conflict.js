const fs = require('fs');

// Remove the broken middleware
if (fs.existsSync('middleware.ts')) {
  fs.unlinkSync('middleware.ts');
  console.log('✅ Removed middleware.ts');
}

// The real fix: add a rewrites rule in next.config.js
// that ensures /api/* never hits [username]
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
      ],
    };
  },
};

module.exports = nextConfig;
`;

fs.writeFileSync('next.config.js', config);
console.log('✅ Updated next.config.js with beforeFiles rewrite');
console.log('\nNow restart dev server: npx next dev --webpack');

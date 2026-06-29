const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/)[1].trim();
const convex = new ConvexHttpClient(url);

async function main() {
  const { api } = require('./convex/_generated/api.js');

  // Find profile with old dev ID
  const profile = await convex.query(api.profiles.byUsername, { username: 'asym_alwali' });
  console.log('Profile found:', profile?._id, 'userId:', profile?.userId);
}
main().catch(console.error);
